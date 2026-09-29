// components/core/Badge.jsx
try { (() => {
function Badge({
  tone = 'ink',
  children,
  style
}) {
  const tones = {
    ink: {
      background: 'var(--ink-1)',
      color: 'var(--paper-1)'
    },
    accent: {
      background: 'var(--clay-3)',
      color: 'var(--paper-1)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--ink-1)',
      boxShadow: 'inset 0 0 0 1px var(--ink-1)'
    },
    live: {
      background: 'var(--red-3)',
      color: 'var(--paper-1)'
    },
    soon: {
      background: 'var(--paper-4)',
      color: 'var(--ink-3)'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      padding: '4px 8px',
      borderRadius: 'var(--radius-1)',
      display: 'inline-block',
      lineHeight: 1.2,
      ...tones[tone],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }
