// components/core/Tag.jsx
try { (() => {
function Tag({
  tone = 'neutral',
  selected,
  onClick,
  children,
  style
}) {
  const tones = {
    neutral: {
      background: 'var(--paper-3)',
      color: 'var(--ink-2)'
    },
    accent: {
      background: 'var(--clay-1)',
      color: 'var(--clay-5)'
    },
    inverse: {
      background: 'rgba(255,255,255,.14)',
      color: 'var(--paper-1)'
    }
  };
  const on = selected ? {
    background: 'var(--ink-1)',
    color: 'var(--paper-1)'
  } : tones[tone];
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    role: onClick ? 'button' : undefined,
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-micro)',
      fontWeight: 600,
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      padding: '6px 12px',
      borderRadius: 'var(--radius-pill)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'var(--transition-control)',
      ...on,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }
