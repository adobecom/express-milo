Milo Migration for Blog Pages
===

## Quick Statistics

* 793 unique Blog URLs (computed from https://www.adobe.com/robots.txt)
* 17 unique blocks
* Top 5 blocks (by usage):
  1. `template-list` (1451)
  2. `banner` (497)
  3. `blog-posts` (487)
  4. `table-of-contents` (438)
  5. `embed` (354)
* Overall low variance usage in top blocks (ex. for `template-list`, variances are: `horizontal` (13), `4columns` (3), `sixcols` (5))
* 7 blocks used <= 20:
  * `animation`, `quotes`, `sticky-promo-bar`, `icon-list`, `make-a-project`, `link-list`, `hero-animation`
* 11 pages using a "wrong" block and would require a fix (see details below)

## Blocks Mapping to Milo

What milo blocks could be used for current blocks

| Current Block | Current Usage | Milo Block | Comment |
| --- | --- | --- | --- |
| `nav` | all pages | [`global navigation`](https://milo.adobe.com/docs/authoring/global-navigation) | ⚠️ In current example, known issues: `profile` component is not working as it requires extra configuration parameters (IMS, ...), `app launcher` has been disabled as it requires performance improvement |
| `footer` | all pages | `global footer` |  |
| `metadata` | all pages | `metadata` |  |
| --- | --- | --- | --- |
| `template-list` | 1433 ([example](https://www.adobe.com/express/learn/blog/winston-churchill-digital-presentation)) | [`section-metadata (n-up)`](https://main--milo--adobecom.hlx.page/docs/library/blocks/section-metadata) | layout gap? |
| `banner` | 489 ([example](https://www.adobe.com/express/learn/blog/picking-the-best-ai-image-generator-for-your-small-business)) | [`aside`](https://main--milo--adobecom.hlx.page/docs/library/blocks/aside) |  |
| `blog-posts` | 480 ([example](https://www.adobe.com/express/learn/blog/guide-to-ai-text-effects-from-adobe-express)) | _static content:_ `section-metadata` with `card` items <br />OR<br />_dynamic content:_ [`caas`](https://milo.adobe.com/docs/authoring/caas) | "Cards as a Service" |
| `table-of-contents` | 433 ([example](https://www.adobe.com/express/learn/blog/picking-the-best-ai-image-generator-for-your-small-business)) | [`table-of-contents`](https://main--milo--adobecom.hlx.page/docs/library/blocks/table-of-contents) | The Milo design is quite different from the current one. The current simpler block could be ported out for the Milo version |
| `embed` | 354 ([example](https://www.adobe.com/express/learn/blog/winston-churchill-digital-presentation)) | Milo supports embeds OOTB without having to explicitely add an `embed` block |  |
| `image-list` | 107 ([example](https://www.adobe.com/express/learn/blog/linkedin-background-photo)) | <TODO> | Seems to be used mostly (only?) for images with a Link |
| `columns` | 45 ([example](https://www.adobe.com/express/learn/blog/wedding-invitation-wording)) | `columns` | columns are also used for centered text single column. These should be replaced by Milo `text (center)`|
| `how-to-steps` | 44 ([example](https://www.adobe.com/express/learn/blog/how-to-sell-on-etsy)) | `how-to` | design gap? |
| `faq` | 38 ([example](https://www.adobe.com/express/learn/blog/etsy-store)) | _with collapsed content:_ [accordion](https://main--milo--adobecom.hlx.page/docs/library/blocks/accordion)<br />OR<br />_all content visible (closer to the current look):_  section-metadata composed of [`card (product)`](https://main--milo--adobecom.hlx.page/docs/library/blocks/card) blocks |  |
| `animation` | 20 ([example](https://www.adobe.com/express/learn/blog/presentation-animation)) | Milo supports embeds OOTB without having to explicitely add an `embed` block |  |
| `sticky-promo-bar` | 14 ([example](https://www.adobe.com/express/learn/blog/whats-new-in-adobe-creative-cloud-express)) | ?? | I don't see any Milo block doing that OOTB |
| `link-list` | 8 ([example](https://www.adobe.com/express/learn/blog/tags/small-business)) | ?? | I don't see any Milo block doing that OOTB |
| `icon-list` | 5 ([example](https://www.adobe.com/express/learn/blog/creative-cloud-express-features)) | Combination of fragments + section metadata + icon-block | for the 5 occurences it seems to be the localized version of the same content |
| `quotes` | 2 ([example](https://www.adobe.com/express/learn/blog/hope-quotes)) | Multiple [`quote`](https://main--milo--adobecom.hlx.page/docs/library/blocks/quote) blocks |
| `make-a-project` | 1 ([example](https://www.adobe.com/express/learn/blog/welcome-to-adobe-spark)) | <TODO> |  |
| `hero-animation` | 1 ([example](https://www.adobe.com/express/learn/blog/tags/uk)) | [`marquee`](https://main--milo--adobecom.hlx.page/docs/library/blocks/marquee) |

### Questions about block mapping

* `video`, `embed`, `animation`: are these all variations of video embeds?



## Statistics Details

Blocks data statistics available as an [Excel Workbook](https://adobe.sharepoint.com/:x:/r/sites/adobecom/Shared%20Documents/express/drafts/catalan/analysis/blog-blocks-data.xlsx?d=w35b64f7d2a8a4329afb2e2b376f07d51&csf=1&web=1&e=BKzJS5)

### Unknown blocks

| block | URLs |
| --- | --- |
| `wann-poste-ich-am-besten-in-instagram` | https://www.adobe.com/de/express/learn/blog/successful-instagram-post |
| `comment-faire-une-bonne-affiche-publicitaire` | https://www.adobe.com/fr/express/learn/blog/design-event-poster |
| `quelles-sont-les-caract-ristiques-d-une-affiche` | https://www.adobe.com/fr/express/learn/blog/design-event-poster |
| `comment-redimensionner-une-image-pour-une-banni-re-youtube` | https://www.adobe.com/fr/express/learn/blog/design-youtube-banner |
| `liste-de-mod-les` | https://www.adobe.com/fr/express/learn/blog/how-to-create-email-signature, https://www.adobe.com/fr/express/learn/blog/tips-improve-linkedin-profile |
| `inhaltsverzeichnis` | https://www.adobe.com/de/express/learn/blog/creating-perfect-business-facebook-page |
| `author` | https://www.adobe.com/express/learn/blog/2019-graphic-design-trends-and-spark-post-templates |
| `how-do-i-resize-an-image-for-a-youtube-banner` | https://www.adobe.com/express/learn/blog/design-youtube-banner |
| `adobe-spark-for-education` | https://www.adobe.com/express/learn/blog/introducing-adobe-spark-for-education |
| `icon` | https://www.adobe.com/express/learn/blog/everything-you-need-to-know-about-facebook-live |
| `video` | https://www.adobe.com/express/learn/blog/houston-we-have-winners-see-the-sparks-that-earned-nasas-approval |



## Generate Stats Data

### Get Blog Page URLs

1. Get all adobe.com express URLs:

  > Requires [Franklin Bulk CLI](https://github.com/catalan-adobe/franklin-bulk-cli)

  ```
  franklin-bulk importer crawl \
    -o https://www.adobe.com/express/sitemap-index.xml \
    -f adobecom-express-all-urls.txt
  ```

2. Filter blog URLs:

  ```
  grep 'express' adobecom-express-all-urls.txt \
    | grep 'blog/' \
    | sort | uniq \
    > adobecom-express-blog-all-urls.txt
  ```

### Collect Blocks Data

  ```
  node crawl-blog-pages-data.js adobecom-express-blog-all-urls.txt
  ```

  This will generate raw data under `storage-blog-blocks2/datasets/blog-blocks-data`

### Generate Blocks Statistics

  ```
  node process-blocks-dataset.js
  ```

  This will generate statistical data in `blog-blocks-data.xlsx`
