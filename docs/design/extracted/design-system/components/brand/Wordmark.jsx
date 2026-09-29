// components/brand/Wordmark.jsx
try { (() => {
/* NOTE: Poiema's real logo files were not supplied, so the brand name is set in type.
   When the licensed asset arrives, swap the span for <img src="…/assets/logo.svg" />. */
function Wordmark({
  city,
  size = 28,
  inverse,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: size * .34,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: size,
      lineHeight: 1,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: inverse ? 'var(--paper-1)' : 'var(--ink-1)'
    }
  }, "Poiema"), city && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: Math.max(9, size * .34),
      fontWeight: 600,
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: inverse ? 'var(--ink-5)' : 'var(--ink-4)'
    }
  }, city));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Wordmark.jsx", error: String((e && e.message) || e) }); }
