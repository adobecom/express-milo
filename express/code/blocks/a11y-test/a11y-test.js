export default async function decorate(block) {
  console.log('Ally Test Block Decorated', block);

  block.innerHTML = `
      <section >
    <!-- WCAG A violation: missing alt text -->
    <article class="a11y-test-image">
      <h2>WCAG A Violation</h2>
      <img src="https://placehold.co/650x360">
      <p>This image has no <code>alt</code> attribute, which is a Level A violation.</p>
    </article>

    <!-- WCAG AA violation: insufficient color contrast -->
    <article style="background:#ffffff; padding:10px;">
      <h2 style="color:#999999;">WCAG AA Violation</h2>
      <p style="color:#cccccc; background:#ffffff;">
        This text has very low contrast against the background, failing WCAG AA.
      </p>
    </article>

    <!-- WCAG AAA violation: too much text in a single line -->
    <article>
      <h2>WCAG AAA Violation</h2>
      <p style="font-size:10px; line-height:1;">
        This text is intentionally set at a very small font size with poor line spacing,
        which fails AAA readability guidelines.
      </p>
    </article>
  </section>
  `
};
