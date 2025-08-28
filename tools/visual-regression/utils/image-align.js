// Lightweight image alignment for Figma comparisons
// Tries OpenCV.js if available (node-opencv4nodejs), otherwise approximates by center-cropping to smallest common size.

import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

let cv = null;
let cvInitPromise = null;
async function getCv() {
	if (cv) return cv;
	if (!cvInitPromise) {
		cvInitPromise = (async () => {
			let mod = null;
			try {
				mod = await import('@techstark/opencv-js');
			} catch (err) {
				return null;
			}
			const instance = mod?.default || mod;
			if (!instance) return null;
			// Wait for WASM ready if exposed
			if (typeof instance.then === 'function') {
				// Some builds export a promise
				cv = await instance;
				return cv;
			}
			await new Promise((resolve) => {
				if (instance.onRuntimeInitialized) {
					instance.onRuntimeInitialized = () => resolve();
				} else {
					resolve();
				}
			});
			cv = instance;
			return cv;
		})();
	}
	return cvInitPromise;
}

export async function alignAndCrop(referencePath, screenshotPath, outputDir, label = 'aligned') {
	// For OpenCV.js path, a robust homography requires more plumbing; we keep sharp fallback here.

	// Fallback: center-crop both to smallest common size
	const refMeta = await sharp(referencePath).metadata();
	const scrMeta = await sharp(screenshotPath).metadata();
	const width = Math.min(refMeta.width, scrMeta.width);
	const height = Math.min(refMeta.height, scrMeta.height);

	const refBuf = await sharp(referencePath)
		.extract({ left: Math.floor((refMeta.width - width) / 2), top: Math.floor((refMeta.height - height) / 2), width, height })
		.png().toBuffer();
	const scrBuf = await sharp(screenshotPath)
		.extract({ left: Math.floor((scrMeta.width - width) / 2), top: Math.floor((scrMeta.height - height) / 2), width, height })
		.png().toBuffer();

	const refOut = path.join(outputDir, 'screenshots', `reference-${label}-cropped.png`);
	const alignedOut = path.join(outputDir, 'screenshots', `website-screenshot-${label}-cropped.png`);
	await fs.writeFile(refOut, refBuf);
	await fs.writeFile(alignedOut, scrBuf);

	return { referencePath: refOut, screenshotPath: alignedOut };
}

export default { alignAndCrop };

// Pixel template matching (normalized cross-correlation) to find best overlap
export async function pixelTemplateMatch(
	referencePath,
	screenshotPath,
	outputDir,
	label = 'ptm',
	searchRange = 50,
) {
	// Read images and downscale to speed up matching
	const refMeta = await sharp(referencePath).metadata();
	const scrMeta = await sharp(screenshotPath).metadata();

	const base = Math.min(refMeta.width, scrMeta.width);
	const scale = Math.min(1, 512 / Math.max(1, base));

	const refImg = await sharp(referencePath)
		.greyscale()
		.resize({
			width: Math.round(refMeta.width * scale),
			height: Math.round(refMeta.height * scale),
			fit: 'fill',
		})
		.raw()
		.toBuffer({ resolveWithObject: true });

	const scrImg = await sharp(screenshotPath)
		.greyscale()
		.resize({
			width: Math.round(scrMeta.width * scale),
			height: Math.round(scrMeta.height * scale),
			fit: 'fill',
		})
		.raw()
		.toBuffer({ resolveWithObject: true });

	const w1 = refImg.info.width; const h1 = refImg.info.height;
	const w2 = scrImg.info.width; const h2 = scrImg.info.height;
	const refData = refImg.data; const scrData = scrImg.data;

	let bestScore = -Infinity; let bestDx = 0; let bestDy = 0;

	const computeNCC = (dx, dy) => {
		const x1 = Math.max(0, dx);
		const y1 = Math.max(0, dy);
		const x2 = Math.min(w1, w2 + dx);
		const y2 = Math.min(h1, h2 + dy);
		const width = x2 - x1; const height = y2 - y1;
		if (width <= 5 || height <= 5) return -Infinity;

		let sumA = 0; let sumB = 0; let sumAA = 0; let sumBB = 0; let sumAB = 0;
		let count = 0;
		for (let yy = 0; yy < height; yy += 1) {
			const ay = y1 + yy; const by = y1 - dy + yy;
			const aRow = ay * w1; const bRow = by * w2;
			for (let xx = 0; xx < width; xx += 1) {
				const ax = x1 + xx; const bx = x1 - dx + xx;
				const a = refData[aRow + ax];
				const b = scrData[bRow + bx];
				sumA += a; sumB += b; sumAA += a * a; sumBB += b * b; sumAB += a * b;
				count += 1;
			}
		}
		const meanA = sumA / count; const meanB = sumB / count;
		const num = sumAB - count * meanA * meanB;
		const denomPartA = sumAA - count * meanA * meanA;
		const denomPartB = sumBB - count * meanB * meanB;
		const denom = Math.sqrt(Math.max(denomPartA * denomPartB, 1e-8));
		return num / denom;
	};

	for (let dy = -searchRange; dy <= searchRange; dy += 1) {
		for (let dx = -searchRange; dx <= searchRange; dx += 1) {
			const score = computeNCC(dx, dy);
			if (score > bestScore) {
				bestScore = score; bestDx = dx; bestDy = dy;
			}
		}
	}

	// Map offsets back to original scale
	const scaleInv = 1 / scale;
	const dxOrig = Math.round(bestDx * scaleInv);
	const dyOrig = Math.round(bestDy * scaleInv);

	// Crop overlap from originals using computed offset
	const x1 = Math.max(0, dxOrig);
	const y1 = Math.max(0, dyOrig);
	const x2 = Math.min(refMeta.width, scrMeta.width + dxOrig);
	const y2 = Math.min(refMeta.height, scrMeta.height + dyOrig);
	const width = x2 - x1; const height = y2 - y1;
	if (width <= 0 || height <= 0) {
		return { referencePath, screenshotPath };
	}

	const refBuf = await sharp(referencePath)
		.extract({ left: x1, top: y1, width, height })
		.png().toBuffer();
	const scrBuf = await sharp(screenshotPath)
		.extract({ left: x1 - dxOrig, top: y1 - dyOrig, width, height })
		.png().toBuffer();

	const refOut = path.join(
		outputDir, 'screenshots', `reference-${label}-ptm.png`,
	);
	const scrOut = path.join(
		outputDir, 'screenshots', `website-screenshot-${label}-ptm.png`,
	);
	await fs.writeFile(refOut, refBuf);
	await fs.writeFile(scrOut, scrBuf);

	return { referencePath: refOut, screenshotPath: scrOut };
}

export const helpers = { alignAndCrop, pixelTemplateMatch };

// Draw red dashed boxes around detected features using OpenCV if available
export async function flagFeatures(referencePath, screenshotPath, outputDir, label = 'features') {
	const cvInstance = await getCv();
	if (!cvInstance) return null;

	const toMatRgba = async (imgPath) => {
		const meta = await sharp(imgPath).metadata();
		const { data } = await sharp(imgPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
		const mat = new cvInstance.Mat(meta.height, meta.width, cvInstance.CV_8UC4);
		mat.data.set(data);
		return { mat, meta };
	};

	const toFile = async (mat, outPath) => {
		const channels = 4;
		const buf = Buffer.from(mat.data);
		await sharp(buf, { raw: { width: mat.cols, height: mat.rows, channels } }).png().toFile(outPath);
	};

	const drawDashedRect = (mat, x, y, w, h, color = new cvInstance.Scalar(0, 0, 255, 255), thickness = 1, dash = 6, gap = 4) => {
		const drawSegment = (x1, y1, x2, y2) => {
			const len = Math.hypot(x2 - x1, y2 - y1);
			const steps = Math.max(1, Math.floor(len / (dash + gap)));
			for (let i = 0; i < steps; i += 1) {
				const t1 = (i * (dash + gap)) / len;
				const t2 = Math.min(((i * (dash + gap)) + dash) / len, 1);
				const sx = Math.round(x1 + (x2 - x1) * t1);
				const sy = Math.round(y1 + (y2 - y1) * t1);
				const ex = Math.round(x1 + (x2 - x1) * t2);
				const ey = Math.round(y1 + (y2 - y1) * t2);
				cvInstance.line(mat, new cvInstance.Point(sx, sy), new cvInstance.Point(ex, ey), color, thickness);
			}
		};
		// border
		drawSegment(x, y, x + w, y);
		drawSegment(x + w, y, x + w, y + h);
		drawSegment(x + w, y + h, x, y + h);
		drawSegment(x, y + h, x, y);
	};

	const process = async (imgPath, outName) => {
		const { mat } = await toMatRgba(imgPath);
		const gray = new cvInstance.Mat();
		cvInstance.cvtColor(mat, gray, cvInstance.COLOR_RGBA2GRAY);

		let usedOrb = false;
		try {
			// Try ORB keypoints for size/scale
			const keypoints = new cvInstance.KeyPointVector();
			let orb = null;
			if (cvInstance.ORB_create) {
				orb = cvInstance.ORB_create();
			} else if (cvInstance.ORB) {
				orb = new cvInstance.ORB();
			}
			if (orb && keypoints) {
				orb.detect(gray, keypoints);
				for (let i = 0; i < keypoints.size(); i += 1) {
					const kp = keypoints.get(i);
					const size = Math.max(8, Math.min(48, Math.round(kp.size || 12)));
					drawDashedRect(
						mat,
						Math.round(kp.pt.x - size / 2),
						Math.round(kp.pt.y - size / 2),
						size,
						size,
					);
				}
				usedOrb = true;
			}
		} catch (e) {
			// Fall back below
		}

		if (!usedOrb) {
			// Fallback: corner features (fixed-size boxes)
			const corners = new cvInstance.Mat();
			cvInstance.goodFeaturesToTrack(gray, corners, 200, 0.01, 10);
			for (let i = 0; i < corners.rows; i += 1) {
				const x = corners.data32F[i * 2];
				const y = corners.data32F[i * 2 + 1];
				drawDashedRect(mat, Math.round(x - 6), Math.round(y - 6), 12, 12);
			}
			corners.delete();
		}

		await toFile(mat, outName);
		gray.delete(); mat.delete();
		return outName;
	};

	const refOut = path.join(outputDir, 'screenshots', `reference-${label}.png`);
	const scrOut = path.join(outputDir, 'screenshots', `website-screenshot-${label}.png`);
	await process(referencePath, refOut);
	await process(screenshotPath, scrOut);
	return { referenceFeaturesPath: refOut, screenshotFeaturesPath: scrOut };
}
