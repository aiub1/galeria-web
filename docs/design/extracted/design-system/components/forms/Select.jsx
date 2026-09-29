// components/forms/Select.jsx
try { (() => {
const fieldBox = (focus, invalid) => ({
  width: '100%',
  fontFamily: 'var(--font-ui)',
  fontSize: 'var(--text-body)',
  color: 'var(--text-body)',
  background: 'var(--paper-1)',
  padding: '13px 14px',
  border: 0,
  borderRadius: 'var(--radius-control)',
  boxShadow: invalid ? 'inset 0 0 0 1px var(--red-3)' : focus ? 'inset 0 0 0 2px var(--clay-3)' : 'inset 0 0 0 1px var(--paper-4)',
  outline: 'none',
  transition: 'var(--transition-control)'
});
const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-ui)',
  fontSize: 'var(--text-micro)',
  fontWeight: 700,
  letterSpacing: 'var(--ls-label)',
  textTransform: 'uppercase',
  color: 'var(--text-strong)',
  marginBottom: 'var(--space-2)'
};
const hintStyle = {
  marginTop: 6,
  fontSize: 'var(--text-body-sm)',
  color: 'var(--text-muted)'
};
function Select({
  label,
  hint,
  invalid,
  options = [],
  value,
  disabled,
  onChange,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      opacity: disabled ? .4 : 1,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: labelStyle
  }, label), /*#__PURE__*/React.createElement("select", {
    value: value,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...fieldBox(focus, invalid),
      appearance: 'none',
      cursor: 'pointer',
      backgroundImage: 'linear-gradient(45deg,transparent 50%,var(--ink-2) 50%),linear-gradient(135deg,var(--ink-2) 50%,transparent 50%)',
      backgroundPosition: 'calc(100% - 18px) 20px, calc(100% - 13px) 20px',
      backgroundSize: '5px 5px,5px 5px',
      backgroundRepeat: 'no-repeat'
    }
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), hint && /*#__PURE__*/React.createElement("span", {
    style: hintStyle
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }
