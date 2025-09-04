# Simplified Pricing Cards v2 — Authoring

This block renders expandable pricing cards with a simplified authoring model. Each column is a card. The first 5 rows define card content; the last 1–2 rows define the footer and a required compare-all button.

## Table rows (top → bottom)

1. Header (toggle)
   - Use a heading (H2 recommended) as the main title. The entire header becomes a toggle button.
   - Optional eyebrow: author two headings (e.g., H3 above H2). The first becomes an eyebrow line.
   - To set which card is open by default, add `default-open-N` to the block’s class list (1-based index).
2. Border params
   - Controls promo styling and optional promo eyebrow text.
   - Author text followed by a token to set the promo class: `Limited-time ((special-promo))`.
   - The token value (inside `((...))`) becomes a class on the card; remaining text becomes the eyebrow promo text.
3. Plan explanation
   - Supporting copy for the plan.
   - If a paragraph contains images, it is rendered as an icon list with image tooltips; otherwise it becomes regular plan text.
4. Pricing area
   - Include a link whose text contains `((pricing))`. Its `href` must be a valid PlanOne pricing URL.
   - Immediately after that link’s paragraph, add a paragraph with space-separated placeholder tokens for the price suffix (VAT, cadence, etc.). Example: `((billed-monthly)) ((vat-included))`.
   - Year 2 price: include `((year-2-pricing-token))` in a paragraph to render the localized Year 2 price.
5. CTA group
   - Add one or two links. All CTAs are upsized; the second link is styled as secondary.
   - Wrap a CTA in `<strong>` to force a primary button.
   - Phone CTAs: include `((business-sales-numbers))` in the link text to auto-format regional sales numbers.

Footer rows:
- Optional footer copy row (applies across all cards). If present, it will be placed above the compare-all row.
- Final row (required): a link that becomes the Compare All button.

## Tokens and placeholders

- `((...))` placeholders are replaced from the site’s placeholders configuration (VAT text, cadence, etc.).
- Special tokens inside the pricing area:
  - `((pricing))`: link text marker to fetch and render live price.
  - `((year-2-pricing-token))`: replaced with the localized Year 2 price.
  - `((business-sales-numbers))`: formats sales phone numbers on eligible links (checked against link text).
- Promo class token: author in the Border params row, e.g. `((special-promo))`.

## Minimal example

```html
<div class="simplified-pricing-cards-v2 default-open-2">
  <div>
    <!-- 1. Header -->
    <div><h3>Special</h3><h2>Individual</h2></div>
    <div><h2>Team</h2></div>
  </div>
  <div>
    <!-- 2. Border params -->
    <div>Limited-time ((special-promo))</div>
    <div>((premium))</div>
  </div>
  <div>
    <!-- 3. Plan explanation -->
    <div><p>Best for solo creators.</p></div>
    <div><p><img src="/express/code/icons/premium.svg" alt=""/> Admin controls included</p></div>
  </div>
  <div>
    <!-- 4. Pricing area -->
    <div>
      <p><a href="https://example.com/planone?id=IND">((pricing))</a></p>
      <p>((billed-monthly)) ((vat-included))</p>
      <p>((year-2-pricing-token))</p>
    </div>
    <div>
      <p><a href="https://example.com/planone?id=TEAM">((pricing))</a></p>
      <p>((billed-monthly))</p>
    </div>
  </div>
  <div>
    <!-- 5. CTA group -->
    <div><strong><a href="#">Start free trial</a></strong> <a href="#">Buy now</a></div>
    <div><a href="#">Contact sales ((business-sales-numbers))</a></div>
  </div>
  <!-- Footer rows -->
  <div><div><p>Prices subject to tax where applicable.</p></div></div>
  <div><div><a href="/pricing/compare">Compare all plans</a></div></div>
</div>
```

Notes:
- Prices, base prices, and Year 2 pricing are fetched from PlanOne and inserted automatically.
- Empty paragraphs inside the pricing area are removed automatically after rendering.
