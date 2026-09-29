// components/core/Icon.jsx
try { (() => {
/* Lucide is loaded from CDN (documented substitution — Poiema has no proprietary icon set).
   Host page must include:
   <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script> */
function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  color = 'currentColor',
  style
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const draw = () => window.lucide && window.lucide.createIcons({
      nameAttr: 'data-lucide',
      root: ref.current
    });
    draw();
    const id = setInterval(() => {
      if (window.lucide) {
        draw();
        clearInterval(id);
      }
    }, 120);
    return () => clearInterval(id);
  }, [name, size, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      color,
      flex: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": name,
    style: {
      width: size,
      height: size
    },
    "data-stroke": strokeWidth
  }));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }
