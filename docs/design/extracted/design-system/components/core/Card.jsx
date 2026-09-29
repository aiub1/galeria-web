// components/core/Card.jsx
try { (() => {
function Card({
  as = 'div',
  interactive,
  inverse,
  accentRule,
  padding = 'var(--space-5)',
  href,
  children,
  style
}) {
  const [h, setH] = React.useState(false);
  const El = href ? 'a' : as;
  return /*#__PURE__*/React.createElement(El, {
    href: href,
    onMouseEnter: interactive ? () => setH(true) : undefined,
    onMouseLeave: interactive ? () => setH(false) : undefined,
    style: {
      display: 'block',
      padding,
      borderRadius: 'var(--radius-card)',
      textDecoration: 'none',
      background: inverse ? 'var(--ink-2)' : 'var(--surface-card)',
      color: inverse ? 'var(--text-on-inverse)' : 'var(--text-body)',
      boxShadow: 'inset 0 0 0 1px ' + (h ? inverse ? 'var(--paper-1)' : 'var(--border-strong)' : inverse ? '#2C2C31' : 'var(--border-hairline)') + (h ? ', var(--shadow-2)' : ''),
      borderTop: accentRule ? 'var(--border-w-strong) solid var(--border-accent)' : undefined,
      transition: 'box-shadow var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)',
      transform: h ? 'translateY(-2px)' : 'none',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }
