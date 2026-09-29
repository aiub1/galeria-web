// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  disabled,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .4 : 1,
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 20,
      height: 20,
      flex: 'none',
      display: 'grid',
      placeItems: 'center',
      borderRadius: 'var(--radius-control)',
      background: checked ? 'var(--ink-1)' : 'var(--paper-1)',
      boxShadow: checked ? 'none' : 'inset 0 0 0 1px var(--paper-4)',
      transition: 'var(--transition-control)'
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 5,
      borderLeft: '2px solid var(--paper-1)',
      borderBottom: '2px solid var(--paper-1)',
      transform: 'rotate(-45deg) translate(1px,-1px)'
    }
  })), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }
