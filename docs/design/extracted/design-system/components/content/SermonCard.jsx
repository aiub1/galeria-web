// components/content/SermonCard.jsx
try { (() => {
function SermonCard({
  title,
  preacher,
  date,
  series,
  duration,
  inverse
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    interactive: true,
    inverse: inverse,
    padding: "0",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '16/9',
      background: 'repeating-linear-gradient(45deg,#2a2724 0 12px,#211f1c 12px 24px)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 10,
      left: 12,
      fontFamily: 'var(--font-ui)',
      fontSize: 10,
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,.45)'
    }
  }, "Thumbnail placeholder"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-control)',
      background: 'var(--overlay-glass)',
      backdropFilter: 'var(--blur-glass)',
      display: 'grid',
      placeItems: 'center',
      color: '#fff',
      fontSize: 17
    }
  }, "\u25B6"), duration && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 10,
      bottom: 10,
      background: 'var(--ink-1)',
      color: 'var(--paper-1)',
      fontFamily: 'var(--font-ui)',
      fontSize: 11,
      fontWeight: 600,
      padding: '3px 6px'
    }
  }, duration)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)'
    }
  }, series && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-micro)',
      fontWeight: 600,
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--text-accent)',
      marginBottom: 6
    }
  }, series), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      lineHeight: 1.02,
      letterSpacing: 'var(--ls-display)',
      textTransform: 'uppercase',
      color: inverse ? 'var(--paper-1)' : 'var(--text-strong)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)'
    }
  }, preacher, date ? ' · ' + date : '')));
}
Object.assign(__ds_scope, { SermonCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SermonCard.jsx", error: String((e && e.message) || e) }); }
