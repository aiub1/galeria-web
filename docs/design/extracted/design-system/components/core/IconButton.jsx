// components/core/IconButton.jsx
try { (() => {
function IconButton({
  variant = 'ghost',
  size = 40,
  label,
  disabled,
  onClick,
  children,
  style
}) {
  const [h, setH] = React.useState(false);
  const [a, setA] = React.useState(false);
  const v = {
    ghost: {
      background: 'transparent',
      color: 'var(--text-strong)',
      hover: 'var(--paper-3)'
    },
    solid: {
      background: 'var(--ink-1)',
      color: 'var(--paper-1)',
      hover: 'var(--ink-3)'
    },
    accent: {
      background: 'var(--clay-3)',
      color: 'var(--paper-1)',
      hover: 'var(--clay-4)'
    },
    glass: {
      background: 'var(--overlay-glass)',
      color: 'var(--paper-1)',
      hover: 'rgba(11,11,12,.75)'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label,
    disabled: disabled,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setA(false);
    },
    onMouseDown: () => setA(true),
    onMouseUp: () => setA(false),
    style: {
      width: size,
      height: size,
      display: 'inline-grid',
      placeItems: 'center',
      border: 0,
      borderRadius: 'var(--radius-control)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: h && !disabled ? v.hover : v.background,
      color: v.color,
      backdropFilter: variant === 'glass' ? 'var(--blur-glass)' : undefined,
      transform: a ? 'translateY(1px)' : 'none',
      opacity: disabled ? .4 : 1,
      transition: 'var(--transition-control)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }
