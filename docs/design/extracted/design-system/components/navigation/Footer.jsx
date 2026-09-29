// components/navigation/Footer.jsx
try { (() => {
function Footer({
  city,
  address,
  columns = [],
  social = [],
  note,
  style
}) {
  return /*#__PURE__*/React.createElement("footer", {
    "data-theme": "inverse",
    style: {
      background: 'var(--ink-1)',
      color: '#E8E6E3',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--gutter-page)',
      display: 'grid',
      gridTemplateColumns: 'minmax(240px,1.4fr) repeat(auto-fit,minmax(140px,1fr))',
      gap: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 34,
    city: city,
    inverse: true
  }), address && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-4) 0 0',
      fontSize: 'var(--text-body-sm)',
      color: 'var(--ink-5)',
      maxWidth: '32ch'
    }
  }, address), social.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-5)'
    }
  }, social.map(s => /*#__PURE__*/React.createElement("a", {
    key: s.label,
    href: s.href,
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-micro)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: 'var(--clay-2)',
      textDecoration: 'none',
      borderBottom: '1px solid currentColor'
    }
  }, s.label)))), columns.map(col => /*#__PURE__*/React.createElement("div", {
    key: col.title
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--ink-5)',
      marginBottom: 'var(--space-4)'
    }
  }, col.title), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gap: 'var(--space-2)'
    }
  }, col.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l.label
  }, /*#__PURE__*/React.createElement("a", {
    href: l.href || '#',
    style: {
      fontSize: 'var(--text-body-sm)',
      color: '#E8E6E3',
      textDecoration: 'none',
      borderBottom: 0
    }
  }, l.label))))))), note && /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid #2C2C31',
      padding: 'var(--space-4) var(--gutter-page)',
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      fontSize: 'var(--text-micro)',
      color: 'var(--ink-5)'
    }
  }, note));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }
