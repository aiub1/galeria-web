// components/brand/ScriptureQuote.jsx
try { (() => {
function ScriptureQuote({
  reference,
  align = 'left',
  size = 'md',
  inverse,
  children,
  style
}) {
  const fs = size === 'lg' ? 'var(--text-scripture-lg)' : 'var(--text-scripture)';
  const centered = align === 'center';
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      maxWidth: 'var(--measure-scripture)',
      borderLeft: centered ? undefined : 'var(--border-w-strong) solid var(--border-accent)',
      paddingLeft: centered ? 0 : 'var(--space-5)',
      textAlign: centered ? 'center' : 'left',
      marginInline: centered ? 'auto' : undefined,
      ...style
    }
  }, /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-scripture)',
      fontStyle: 'italic',
      fontSize: fs,
      lineHeight: 'var(--lh-scripture)',
      color: inverse ? 'var(--paper-1)' : 'var(--text-strong)'
    }
  }, children), reference && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: 'var(--space-3)',
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-micro)',
      fontWeight: 600,
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: inverse ? 'var(--clay-2)' : 'var(--text-accent)'
    }
  }, reference));
}
Object.assign(__ds_scope, { ScriptureQuote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/ScriptureQuote.jsx", error: String((e && e.message) || e) }); }
