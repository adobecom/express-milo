/**
   * Generate URL Shortener configuration based on environment
   * @returns {object} Configuration object with serviceUrl, apiKey, and enabled flag
   */
function getUrlShortenerConfig(envName) {
    // URL shortener service endpoint
    const serviceUrlMap = {
        prod: 'https://go.adobe.io',
        stage: 'https://go-stage.adobe.io',
        local: 'https://go-stage.adobe.io',
    };

    // API key for URL shortener service
    const apiKeyMap = {
        prod: 'quickactions_hz_webapp',
        stage: 'hz-dynamic-url-service',
        local: 'hz-dynamic-url-service',
    };

    const serviceUrl = serviceUrlMap[envName] || serviceUrlMap.stage;
    const apiKey = apiKeyMap[envName] || apiKeyMap.stage;

    return {
        serviceUrl,
        apiKey // Enable URL shortening
    };
}

/**
 * Generate UUID v4
 * @returns {string} UUID
 */
function generateUUID() {
    return crypto.randomUUID();
}

export class EasyUpload {
    constructor(uploadService, envName, quickAction, block, startSDKWithUnconvertedFiles, createTag) {
        this.qrCode = null;
        this.qrCodeContainer = null;
        this.confirmButton = null;
        this.qrRefreshInterval = null;
        this.isUploadFinalizing = false;
        this.envName = envName;
        this.quickAction = quickAction;
        this.block = block;
        this.startSDKWithUnconvertedFiles = startSDKWithUnconvertedFiles;
        this.createTag = createTag;

        // ACP Storage properties
        this.uploadService = uploadService;
        this.asset = null;
        this.uploadAsset = null;
        this.pollingInterval = null;
        this.versionReadyPromise = null;

        // ACP Storage constants
        this.MAX_FILE_SIZE = 60000000; // 60 MB
        this.TRANSFER_DOCUMENT = 'application/vnd.adobecloud.bulk-transfer+json';
        this.CONTENT_TYPE = 'application/octet-stream';
        this.SECOND_IN_MS = 1000;
        this.MAX_POLLING_ATTEMPTS = 100;
        this.POLLING_TIMEOUT_MS = 100000;

        // Link relation constants
        this.LINK_REL = {
            BLOCK_UPLOAD_INIT: 'http://ns.adobe.com/adobecloud/rel/block/upload/init',
            BLOCK_TRANSFER: 'http://ns.adobe.com/adobecloud/rel/block/transfer',
            BLOCK_FINALIZE: 'http://ns.adobe.com/adobecloud/rel/block/finalize',
            SELF: 'self',
            RENDITION: 'http://ns.adobe.com/adobecloud/rel/rendition',
        };

        // QR Code constants
        this.QR_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
        this.QR_CODE_CONFIG = {
            width: 200,
            height: 200,
            type: 'canvas',
            data: '',
            dotsOptions: {
                color: '#000000',
                type: 'rounded',
            },
            backgroundOptions: {
                color: '#ffffff',
            },
            imageOptions: {
                crossOrigin: 'anonymous',
                margin: 10,
            },
        };

        // Bind cleanup to window unload
        window.addEventListener('beforeunload', () => this.cleanup());
    }

    isExperimentEnabled(quickAction) {
        return this.enabledQuickActions.includes(quickAction);
    }

    loadQRCodeLibrary() {
        return new Promise((resolve, reject) => {
            if (window.QRCodeStyling) {
                resolve(window.QRCodeStyling);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/qr-code-styling@1.9.2/lib/qr-code-styling.js';
            script.onload = () => resolve(window.QRCodeStyling);
            script.onerror = () => reject(new Error('Failed to load QR code library'));
            document.head.appendChild(script);
        });
    }

    /**
     * Extract link href from asset links
     */
    getLinkHref(links, relation) {
        if (!links || !links[relation]) {
            return null;
        }
        return links[relation].href;
    }

    /**
     * Extract upload URL from transfer document
     */
    extractUploadUrl(uploadAsset) {
        const uploadUrl = this.getLinkHref(uploadAsset._links, this.LINK_REL.BLOCK_TRANSFER);
        if (!uploadUrl) {
            throw new Error('Block transfer URL not found in upload asset links');
        }
        return uploadUrl;
    }

    /**
     * Generate presigned upload URL from ACP Storage
     */
    async generatePresignedUploadUrl() {
        console.log('Generating upload URL for mobile client');

        try {
            this.asset = await this.uploadService.createAsset(this.CONTENT_TYPE);
            this.uploadAsset = await this.uploadService.initializeBlockUpload(this.asset, this.MAX_FILE_SIZE, this.MAX_FILE_SIZE, this.CONTENT_TYPE);

            const uploadUrl = this.uploadAsset._links["http://ns.adobe.com/adobecloud/rel/block/transfer"][0].href;

            console.log('Upload URL generated successfully', {
                assetId: this.asset.assetId,
                hasUploadUrl: !!uploadUrl,
            });

            return uploadUrl;
        } catch (error) {
            console.error('Failed to generate upload URL:', error);
            throw error;
        }
    }

    /**
     * Wait for asset version to be ready
     */
    async waitForAssetVersionReady() {
        return new Promise((resolve, reject) => {
            this.versionReadyPromise = { resolve, reject };
            let pollAttempts = 0;

            const timeoutId = setTimeout(() => {
                if (this.pollingInterval) {
                    clearInterval(this.pollingInterval);
                }
                reject(new Error(`Polling timeout: Asset version not ready after ${this.POLLING_TIMEOUT_MS}ms`));
            }, this.POLLING_TIMEOUT_MS);

            this.pollingInterval = setInterval(async () => {
                try {
                    pollAttempts++;
                    console.log('Polling for asset version', {
                        assetId: this.asset?.assetId,
                        attempt: pollAttempts,
                    });

                    const version = await this.uploadService.getAssetVersion(this.asset);
                    const success = version === '1';

                    if (success) {
                        clearInterval(this.pollingInterval);
                        clearTimeout(timeoutId);
                        console.log('Asset version ready', {
                            assetId: this.asset?.assetId,
                            attempts: pollAttempts,
                        });
                        resolve();
                    } else if (pollAttempts >= this.MAX_POLLING_ATTEMPTS) {
                        clearInterval(this.pollingInterval);
                        clearTimeout(timeoutId);
                        reject(new Error(`Max polling attempts reached (${this.MAX_POLLING_ATTEMPTS}). Asset version: ${version}`));
                    }
                } catch (error) {
                    clearInterval(this.pollingInterval);
                    clearTimeout(timeoutId);
                    console.error('Error during version polling:', error);
                    reject(error);
                }
            }, this.SECOND_IN_MS);
        });
    }

    async finalizeUpload() {
        this.uploadService.finalizeUpload(this.uploadAsset);
    }

    /**
     * Detect file type from content string
     */
    detectFileType(typeString) {
        const lowerTypeString = typeString.toLowerCase();

        // Image types
        if (lowerTypeString.includes('png')) return 'image/png';
        if (lowerTypeString.includes('jpg') || lowerTypeString.includes('jpeg') || lowerTypeString.includes('jfif') || lowerTypeString.includes('exif')) return 'image/jpeg';
        if (lowerTypeString.includes('gif')) return 'image/gif';
        if (lowerTypeString.includes('webp')) return 'image/webp';
        if (lowerTypeString.includes('svg')) return 'image/svg+xml';
        if (lowerTypeString.includes('bmp')) return 'image/bmp';
        if (lowerTypeString.includes('heic')) return 'image/heic';

        // Video types
        if (lowerTypeString.includes('mp4')) return 'video/mp4';
        if (lowerTypeString.includes('mov')) return 'video/quicktime';
        if (lowerTypeString.includes('avi')) return 'video/x-msvideo';
        if (lowerTypeString.includes('webm')) return 'video/webm';

        // Default to JPEG for images
        return 'image/jpeg';
    }

    /**
     * Retrieve uploaded file from ACP Storage
     */
    async retrieveUploadedFile() {
        console.log('Retrieving uploaded file', { assetId: this.asset?.assetId });

        try {
            await this.waitForAssetVersionReady();

            if (this.versionReadyPromise?.isRejected) {
                throw new Error("Asset version not ready");
            }

            const blob = await this.uploadService.downloadAssetContent(this.asset);
            const typeString = await blob.slice(0, 50).text();
            const detectedType = this.detectFileType(typeString);
            const fileName = `upload_${Date.now()}_${generateUUID().substring(0, 8)}`;

            const file = new File([blob], fileName, { type: detectedType });

            console.log('File retrieved successfully', {
                assetId: this.asset?.assetId,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
            });

            return file;
        } catch (error) {
            console.error('Failed to retrieve uploaded file:', error);
            throw error;
        }
    }

    /**
     * Dispose and cleanup ACP Storage resources
     */
    async disposeAcpStorage() {
        console.log('Disposing ACP Storage resources', {
            assetId: this.asset?.assetId,
            hasPollingInterval: !!this.pollingInterval,
        });

        try {
            if (this.uploadService && this.asset) {
                await this.uploadService.deleteAsset(this.asset);
            }
            if (this.pollingInterval) {
                clearInterval(this.pollingInterval);
                this.pollingInterval = null;
            }

            this.asset = null;
            this.uploadAsset = null;
            this.versionReadyPromise = null;

            console.log('ACP Storage disposal completed');
        } catch (error) {
            console.error('Error during disposal:', error);
        }
    }

    async generateUploadUrl() {
        try {
            // Generate presigned upload URL
            const presignedUrl = await this.generatePresignedUploadUrl();

            // Build mobile upload URL
            return this.buildMobileUploadUrl(presignedUrl);
        } catch (error) {
            console.error('Failed to generate upload URL:', error);
            throw error;
        }
    }

    buildMobileUploadUrl(presignedUrl) {
        const urlParams = new URLSearchParams(window.location.search);
        const qrHost = urlParams.get('qr_host');
        const host = this.envName === 'prod'
            ? 'express.adobe.com'
            : qrHost ? qrHost : 'express-stage.adobe.com';


        const url = new URL(`https://${host}/uploadFromOtherDevice`);
        url.searchParams.set('upload_url', presignedUrl);

        return url.toString();
    }

    async shortenUrl(longUrl) {
        // Return long URL for logged-out users
        if (!window?.adobeIMS?.isSignedInUser()) {
            console.log('User not logged in, using original URL');
            return longUrl;
        }

        try {
            const accessToken = window.adobeIMS.getAccessToken()?.token;
            if (!accessToken) {
                console.log('No access token available, using original URL');
                return longUrl;
            }

            const urlShortenerConfig = getUrlShortenerConfig(this.envName);
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const metaData = 'easy-upload-qr-code';

            console.log('Attempting to shorten URL', {
                originalUrlLength: longUrl.length,
                timeZone,
                metaData,
            });

            const url = new URL(`${urlShortenerConfig.serviceUrl}/v1/short-links/`);
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'x-api-key': urlShortenerConfig.apiKey,
                },
                body: JSON.stringify({
                    url: longUrl,
                    timeZone,
                    metaData,
                }),
            });

            if (!response.ok) {
                console.warn('Failed to shorten URL (HTTP error), using original', {
                    status: response.status,
                    statusText: response.statusText,
                });
                return longUrl;
            }

            const data = await response.json();
            if (data.status === 'success' && data.data) {
                console.log('URL shortened successfully', {
                    shortUrl: data.data,
                    originalLength: longUrl.length,
                    shortLength: data.data.length,
                });
                return data.data;
            }

            console.warn('Failed to shorten URL (unexpected response), using original', {
                responseData: data,
            });
            return longUrl;
        } catch (error) {
            console.error('Error shortening URL, using original', {
                error: error instanceof Error ? error.message : String(error),
            });
            return longUrl;
        }
    }

    async displayQRCode(uploadUrl) {
        const QRCodeStyling = await this.loadQRCodeLibrary();

        if (!this.qrCode) {
            this.qrCode = new QRCodeStyling({
                ...this.QR_CODE_CONFIG,
                data: uploadUrl,
            });
        } else {
            this.qrCode.update({
                ...this.QR_CODE_CONFIG,
                data: uploadUrl,
            });
        }

        // Create a container for the QR code
        const dropzone = document.querySelector('.dropzone');
        const buttonContainer = dropzone.querySelector('.button-container');
        if (buttonContainer && !this.qrCodeContainer) {
            this.qrCodeContainer = this.createTag('div', { class: 'qr-code-container' });
            buttonContainer.appendChild(this.qrCodeContainer);
        }

        if (this.qrCodeContainer) {
            this.qrCodeContainer.innerHTML = '';
            this.qrCode.append(this.qrCodeContainer);
        }
    }

    async initializeQRCode() {
        try {
            const uploadUrl = await this.generateUploadUrl();
            console.log('Upload URL:', uploadUrl);
            const finalUrl = await this.shortenUrl(uploadUrl);
            await this.displayQRCode(finalUrl);

            // Set up refresh interval
            this.scheduleQRRefresh();
        } catch (error) {
            console.error('Failed to initialize QR code:', error);
            throw error;
        }
    }

    scheduleQRRefresh() {
        // Clear existing interval
        if (this.qrRefreshInterval) {
            clearTimeout(this.qrRefreshInterval);
        }

        // Schedule next refresh
        this.qrRefreshInterval = setTimeout(() => {
            this.refreshQRCode();
        }, this.QR_REFRESH_INTERVAL);
    }

    async refreshQRCode() {
        try {
            console.log('Refreshing QR code...');
            await this.initializeQRCode();
        } catch (error) {
            console.error('Failed to refresh QR code:', error);
        }
    }

    async handleConfirmImport() {
        if (this.isUploadFinalizing) return;

        this.isUploadFinalizing = true;
        this.updateConfirmButtonState(true);

        try {
            if (!this.uploadService) {
                throw new Error('Upload service not initialized');
            }

            // Finalize the upload first
            await this.finalizeUpload();

            // Retrieve the uploaded file
            const file = await this.retrieveUploadedFile();

            if (file) {
                // Process the file (trigger the standard upload flow)
                await this.startSDKWithUnconvertedFiles([file], this.quickAction, this.block);

                // // Refresh QR code for next upload
                // await this.refreshQRCode();
            } else {
                console.warn('No file was uploaded');
                showErrorToast(block, 'No file detected. Please upload a file from your mobile device.');
            }
        } catch (error) {
            console.error('Failed to confirm import:', error);
            showErrorToast(block, 'Failed to import file. Please try again.');
        } finally {
            this.isUploadFinalizing = false;
            this.updateConfirmButtonState(false);
        }
    }

    updateConfirmButtonState(disabled) {
        if (this.confirmButton) {
            if (disabled) {
                this.confirmButton.classList.add('disabled');
                this.confirmButton.setAttribute('aria-disabled', 'true');
            } else {
                this.confirmButton.classList.remove('disabled');
                this.confirmButton.removeAttribute('aria-disabled');
            }
        }
    }

    createConfirmButton() {
        const confirmButton = this.createTag('a', {
            href: '#',
            class: 'button accent xlarge confirm-import-button',
            title: 'Confirm Import'
        }, 'Confirm Import');

        confirmButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleConfirmImport();
        });

        this.confirmButton = confirmButton;
        return confirmButton;
    }

    async generateQRCode() {
        try {
            await this.initializeQRCode();

            // Add Confirm Import button
            const dropzone = document.querySelector('.dropzone');
            const buttonContainer = dropzone.querySelector('.button-container');
            if (buttonContainer) {
                const confirmButton = this.createConfirmButton();
                buttonContainer.appendChild(confirmButton);
            }
        } catch (error) {
            console.error('Failed to generate QR code:', error);
            throw error;
        }
    }

    async cleanup() {
        // Clear refresh interval
        if (this.qrRefreshInterval) {
            clearTimeout(this.qrRefreshInterval);
            this.qrRefreshInterval = null;
        }

        // Dispose ACP Storage resources
        await this.disposeAcpStorage();

        // Clear references
        this.qrCode = null;
        this.qrCodeContainer = null;
        this.confirmButton = null;

        console.log('EasyUpload resources cleaned up');
    }
}
