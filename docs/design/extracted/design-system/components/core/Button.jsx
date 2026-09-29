// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  fontFamily: 'var(--font-ui)',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 'var(--ls-label)',
  border: 0,
  borderRadius: 'var(--radius-control)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-2)',
  transition: 'var(--transition-control)',
  textDecoration: 'none',
  lineHeight: 1,
  whiteSpace: 'nowrap'
};
const sizes = {
  sm: {
    fontSize: 11,
    padding: '9px 14px'
  },
  md: {
    fontSize: 13,
    padding: '13px 22px'
  },
  lg: {
    fontSize: 15,
    padding: '18px 32px'
  }
};
const looks = {
  primary: {
    rest: {
      background: 'var(--clay-3)',
      color: 'var(--text-on-accent)'
    },
    hover: {
      background: 'var(--clay-4)'
    },
    active: {
      background: 'var(--clay-5)'
    }
  },
  solid: {
    rest: {
      background: 'var(--ink-1)',
      color: 'var(--paper-1)'
    },
    hover: {
      background: 'var(--ink-3)'
    },
    active: {
      background: 'var(--ink-2)'
    }
  },
  outline: {
    rest: {
      background: 'transparent',
      color: 'var(--text-strong)',
      boxShadow: 'inset 0 0 0 var(--border-w-strong) var(--border-strong)'
    },
    hover: {
      background: 'var(--ink-1)',
      color: 'var(--paper-1)'
    },
    active: {
      background: 'var(--ink-2)',
      color: 'var(--paper-1)'
    }
  },
  ghost: {
    rest: {
      background: 'transparent',
      color: 'var(--text-strong)'
    },
    hover: {
      background: 'var(--paper-3)'
    },
    active: {
      background: 'var(--paper-4)'
    }
  },
  inverse: {
    rest: {
      background: 'var(--paper-1)',
      color: 'var(--ink-1)'
    },
    hover: {
      background: 'var(--paper-3)'
    },
    active: {
      background: 'var(--paper-4)'
    }
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  href,
  disabled,
  fullWidth,
  iconLeft,
  iconRight,
  onClick,
  children,
  style
}) {
  const [h, setH] = React.useState(false);
  const [a, setA] = React.useState(false);
  const l = looks[variant] || looks.primary;
  const s = {
    ...base,
    ...sizes[size],
    ...l.rest,
    ...(h && !disabled ? l.hover : null),
    ...(a && !disabled ? {
      ...l.active,
      transform: 'translateY(1px)'
    } : null),
    ...(disabled ? {
      opacity: .4,
      cursor: 'not-allowed'
    } : null),
    ...(fullWidth ? {
      width: '100%'
    } : null),
    ...style
  };
  const p = {
    style: s,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setA(false);
    },
    onMouseDown: () => setA(true),
    onMouseUp: () => setA(false)
  };
  const inner = /*#__PURE__*/React.createElement(React.Fragment, null, iconLeft, children, iconRight);
  if (href && !disabled) return /*#__PURE__*/React.createElement("a", _extends({
    href: href
  }, p, {
    onClick: onClick
  }), inner);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: disabled ? undefined : onClick
  }, p), inner);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }
