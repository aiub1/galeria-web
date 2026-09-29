// components/brand/SectionLabel.jsx
try { (() => {
function SectionLabel({
  title,
  eyebrow,
  align = 'left',
  inverse,
  action,
  style
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-5)',
      textAlign: align,
      flexWrap: 'wrap',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginInline: align === 'center' ? 'auto' : undefined
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-micro)',
      fontWeight: 600,
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: inverse ? 'var(--clay-2)' : 'var(--text-accent)',
      marginBottom: 'var(--space-2)'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-display-3)',
      lineHeight: 'var(--lh-display)',
      letterSpacing: 'var(--ls-display)',
      textTransform: 'uppercase',
      color: inverse ? 'var(--paper-1)' : 'var(--text-strong)'
    }
  }, title)), action);
}
Object.assign(__ds_scope, { SectionLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SectionLabel.jsx", error: String((e && e.message) || e) }); }
