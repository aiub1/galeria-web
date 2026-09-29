// components/content/EventCard.jsx
try { (() => {
function EventCard({
  name,
  dates,
  place,
  blurb,
  status,
  cta = 'Inscreva-se',
  href
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    accentRule: true,
    style: {
      display: 'grid',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 38,
      lineHeight: .94,
      letterSpacing: 'var(--ls-display)',
      textTransform: 'uppercase',
      color: 'var(--text-strong)'
    }
  }, name), status && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: status === 'Em breve' ? 'soon' : 'accent',
    style: {
      marginLeft: 'auto',
      flex: 'none'
    }
  }, status)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-micro)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, [dates, place].filter(Boolean).join(' · ')), blurb && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-body)',
      color: 'var(--text-body)',
      maxWidth: '52ch'
    }
  }, blurb), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    href: href
  }, cta)));
}
Object.assign(__ds_scope, { EventCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/EventCard.jsx", error: String((e && e.message) || e) }); }
