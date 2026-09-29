// components/forms/Input.jsx
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
function Input({
  label,
  hint,
  invalid,
  type = 'text',
  value,
  placeholder,
  iconLeft,
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
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      ...fieldBox(focus, invalid),
      padding: 0
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: 12,
      display: 'inline-flex',
      color: 'var(--text-muted)'
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 0,
      outline: 'none',
      background: 'transparent',
      font: 'inherit',
      color: 'inherit',
      padding: '13px 14px'
    }
  })), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      ...hintStyle,
      color: invalid ? 'var(--red-3)' : 'var(--text-muted)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }
