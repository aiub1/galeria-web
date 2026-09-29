// components/content/GCCard.jsx
try { (() => {
const Field = ({
  label,
  value
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    gap: 8,
    fontSize: 'var(--text-body-sm)',
    lineHeight: 1.5
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontWeight: 700,
    letterSpacing: 'var(--ls-label)',
    textTransform: 'uppercase',
    fontSize: 'var(--text-micro)',
    color: 'var(--text-muted)',
    paddingTop: 2,
    flex: 'none'
  }
}, label, ":"), /*#__PURE__*/React.createElement("span", {
  style: {
    color: 'var(--text-body)'
  }
}, value));
function GCCard({
  name,
  local,
  when,
  leaders,
  whatsapp,
  tag,
  onShare
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    interactive: true,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-h4)',
      fontWeight: 700,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)'
    }
  }, name), tag && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 'var(--text-micro)',
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: 'var(--text-accent)',
      fontWeight: 600
    }
  }, tag)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Local",
    value: local
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Dia/Hora",
    value: when
  }), /*#__PURE__*/React.createElement(Field, {
    label: "L\xEDderes",
    value: leaders
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      marginTop: 'auto'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm",
    href: whatsapp
  }, "Entrar em contato"), onShare && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "sm",
    onClick: onShare
  }, "Compartilhar")));
}
Object.assign(__ds_scope, { GCCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/GCCard.jsx", error: String((e && e.message) || e) }); }
