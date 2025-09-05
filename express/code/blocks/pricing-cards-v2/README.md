# Pricing Cards v2 — Authoring

This block renders one or more pricing cards from a table-like authoring structure. Each column is a card. The first 7 rows define card content; the final row is a shared footer.

## Table rows (top → bottom)

1. Header
   - Use a heading (H2 recommended) as the card title. An inline image after the text will appear as an icon.
   - To show a head-count badge, include a number in parentheses in the title, e.g. "Team (10 users)".
2. Border params
   - Controls promo styling and optional promo headline.
   - Author text followed by a token to set the promo style: `Special Offer ((special-promo))`.
   - The token value (inside `((...))`) becomes a class on the card border (spaces are removed).
3. Plan explanation
   - Supporting copy for the plan. Plain paragraphs recommended.
4. Pricing area (monthly pricing row)
   - Include a link whose text is exactly `((pricing))`. Its `href` must be a valid PlanOne pricing URL.
   - Immediately following the pricing button container, add a paragraph of space-separated placeholder tokens for the price suffix (VAT, billing cadence, etc.). Example: `((billed-monthly)) ((vat-included))`.
   - To render dynamic values:
     - Year 2 price: include `[[year-2-pricing-token]]` in a paragraph.
     - Base (pre-discount) price: include `[[base-pricing-token]]` in a paragraph.
   - Offer and savings:
     - Use an italic tag inside the pricing area for the offer line: `<i>Save ((savePercentage)) today</i>`.
5. CTA group
   - Add one or two links. All CTAs are upsized automatically; the second link is styled as secondary.
   - Wrap a CTA in `<strong>` to force a primary button.
   - Phone CTAs: include `((business-sales-numbers))` in the link title to auto-format regional sales numbers.
6. Feature list
   - Bullets or paragraphs listing plan features.
7. Compare
   - A link to the compare-all page. Styling is applied automatically.
8. Footer (shared)
   - The very last row in the block is used as a shared footer across all cards (legal text, help links, etc.).

## Tokens and placeholders

- `((...))` placeholders are replaced from the site’s placeholders configuration (VAT text, cadence, etc.).
- Special tokens inside the pricing area:
  - `((pricing))`: link text marker to fetch and render live price.
  - `[[year-2-pricing-token]]`: replaced with the localized Year 2 price.
  - `[[base-pricing-token]]`: replaced with the localized base price when discounts apply.
  - `((savePercentage))`: replaced with the current percent savings in offer copy.
  - `((business-sales-numbers))`: formats sales phone numbers on eligible links via the link title attribute.
- Promo border class: put a token in the Border params row, e.g. `((special-promo))`.

## Minimal example

```html
<div class="pricing-cards-v2">
  <div>
    <!-- 1. Header (one cell per card) -->
    <div><h2>Individual</h2></div>
    <div><h2>Team (10 users)</h2></div>
  </div>
  <div>
    <!-- 2. Border params -->
    <div>Special Offer ((special-promo))</div>
    <div>((premium))</div>
  </div>
  <div>
    <!-- 3. Plan explanation -->
    <div><p>Best for solo creators.</p></div>
    <div><p>Collaboration and admin controls.</p></div>
  </div>
  <div>
    <!-- 4. Pricing area -->
    <div>
      <p><a href="https://example.com/planone?id=IND">((pricing))</a></p>
      <div class="button-container"><a href="#">Buy now</a></div>
      <p>((billed-monthly)) ((vat-included))</p>
      <p>[[year-2-pricing-token]]</p>
      <p>[[base-pricing-token]]</p>
      <p><i>Save ((savePercentage)) today</i></p>
    </div>
    <div>
      <p><a href="https://example.com/planone?id=TEAM">((pricing))</a></p>
      <div class="button-container"><a href="#">Buy for team</a></div>
      <p>((billed-monthly)) ((vat-included))</p>
    </div>
  </div>
  <div>
    <!-- 5. CTA group -->
    <div><strong><a href="#" title="((business-sales-numbers))">Start free trial</a></strong> <a href="#">Buy now</a></div>
    <div><a href="#">Contact sales</a></div>
  </div>
  <div>
    <!-- 6. Feature list -->
    <div><ul><li>All core features</li></ul></div>
    <div><ul><li>Everything in Individual, plus …</li></ul></div>
  </div>
  <div>
    <!-- 7. Compare -->
    <div><a href="/pricing/compare">Compare plans</a></div>
    <div><a href="/pricing/compare">Compare plans</a></div>
  </div>
  <div>
    <!-- 8. Footer (shared) -->
    <div><p>Prices subject to tax where applicable.</p></div>
  </div>
</div>
```

Notes:
- The block automatically formats price, base price, and savings using the PlanOne API.
- The pricing button container (`.action-area` or `.button-container`) inside the pricing area is removed after price rendering; CTAs should be provided in the dedicated CTA group row.
