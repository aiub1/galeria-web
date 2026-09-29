// components/content/FeedTile.jsx
try { (() => {
function FeedTile({
  caption,
  kind = 'post',
  href,
  style
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      position: 'relative',
      display: 'block',
      aspectRatio: '1/1',
      textDecoration: 'none',
      background: 'repeating-linear-gradient(45deg,#2a2724 0 12px,#211f1c 12px 24px)',
      borderBottom: 0,
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 8,
      left: 10,
      fontFamily: 'var(--font-ui)',
      fontSize: 9,
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,.4)'
    }
  }, "Image placeholder"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--overlay-protect)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 8,
      right: 10,
      fontFamily: 'var(--font-ui)',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: '#fff'
    }
  }, kind === 'reel' ? 'Reel' : 'Post'), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 'auto 0 0 0',
      padding: 12,
      color: '#fff',
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-body-sm)',
      lineHeight: 1.4,
      display: '-webkit-box',
      WebkitLineClamp: h ? 6 : 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, caption));
}
Object.assign(__ds_scope, { FeedTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/FeedTile.jsx", error: String((e && e.message) || e) }); }
