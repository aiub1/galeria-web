// components/navigation/NavBar.jsx
try { (() => {
function NavBar({
  city,
  items = [],
  active,
  onNavigate,
  action,
  inverse,
  sticky = true,
  style
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: sticky ? 'sticky' : 'static',
      top: 0,
      zIndex: 20,
      background: inverse ? 'var(--overlay-glass)' : 'rgba(255,255,255,.86)',
      backdropFilter: 'var(--blur-glass)',
      borderBottom: '1px solid ' + (inverse ? 'rgba(255,255,255,.14)' : 'var(--border-hairline)'),
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      padding: '0 var(--gutter-page)',
      height: 72,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 26,
    city: city,
    inverse: inverse
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      marginLeft: 'auto'
    }
  }, items.map(it => {
    const on = it.id === active;
    return /*#__PURE__*/React.createElement("a", {
      key: it.id,
      href: it.href || '#',
      onClick: e => {
        if (onNavigate) {
          e.preventDefault();
          onNavigate(it.id);
        }
      },
      style: {
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--text-micro)',
        fontWeight: 700,
        letterSpacing: 'var(--ls-label)',
        textTransform: 'uppercase',
        textDecoration: 'none',
        paddingBottom: 3,
        borderBottom: '2px solid ' + (on ? 'var(--clay-3)' : 'transparent'),
        color: on ? inverse ? 'var(--paper-1)' : 'var(--ink-1)' : inverse ? 'var(--ink-5)' : 'var(--ink-4)',
        transition: 'var(--transition-control)'
      }
    }, it.label);
  })), action !== undefined ? action : /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: inverse ? 'inverse' : 'solid',
    size: "sm"
  }, "Ir para loja")));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app-2ou/data.js
try { (() => {
window.GC_DATA = [{
  id: 1,
  name: '2OU+ | CASAIS - BAIRRO ALTO',
  local: 'Rua Marco Polo, 16 - Bairro Alto – Curitiba/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Raphael e Kezia',
  wa: '5548991914758',
  group: 'Casais',
  city: 'Curitiba'
}, {
  id: 3,
  name: '2OU+ | CASAIS - BAIRRO ALTO II',
  local: 'Rua Sebastião Silva, 393 - Sb 03 - Barirro Alto – Curitiba/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Danilo e Fabiana',
  wa: '5541995402227',
  group: 'Casais',
  city: 'Curitiba'
}, {
  id: 2,
  name: '2OU+ | CASAIS - BOQUEIRÃO',
  local: 'Rua Arthur Manoel Iwersen, 550 – SB 79 – Boqueirão – Curitiba/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Ronaldo e Luciana',
  wa: '5541992299262',
  group: 'Casais',
  city: 'Curitiba'
}, {
  id: 10,
  name: '2OU+ | CASAIS - BOQUEIRÃO ll',
  local: 'Rua Conde de São João das Duas Barras 2186 - Boqueirão – Curitiba/PR',
  when: 'Terça-feira às 20:00',
  leaders: 'Garcez e Isabele',
  wa: '5541988660942',
  group: 'Casais',
  city: 'Curitiba'
}, {
  id: 5,
  name: '2OU+ | CASAIS - CAMPO COMPRIDO',
  local: 'Rua Rosamélia de Oliveira, 666 - Bloco5, Ap32 - Campo Comprido – Curitiba/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Kevin e Ana Clara',
  wa: '5541987742000',
  group: 'Casais',
  city: 'Curitiba'
}, {
  id: 4,
  name: '2OU+ | CASAIS - GUABIROTUBA',
  local: 'R. Araújo Pôrto Alegre, 34 – Guabirotuba – Curitiba/PR',
  when: 'Terça-feira às 20:00',
  leaders: 'Pedro e Dani',
  wa: '5541999970536',
  group: 'Casais',
  city: 'Curitiba'
}, {
  id: 12,
  name: '2OU+ | CASAIS - HAUER',
  local: 'Rua Oliveira Viana, 1385 - Sobrado 4 - Hauer - Curitiba/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Kahoe e Carol',
  wa: '5541996993982',
  group: 'Casais',
  city: 'Curitiba'
}, {
  id: 6,
  name: '2OU+ | CASAIS - PINHEIRINHO',
  local: 'Rua Antônio Teixeira de Andrade, 165 – Pinheirinho – Curitiba/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Bruno e Micheli',
  wa: '5541996842623',
  group: 'Casais',
  city: 'Curitiba'
}, {
  id: 7,
  name: '2OU+ | CASAIS - SANTA CÂNDIDA',
  local: 'Estrada de Santa Cândida, 177 – Sb 57 – Santa Cândida – Curitiba/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Arilson e Danielle',
  wa: '5541999437774',
  group: 'Casais',
  city: 'Curitiba'
}, {
  id: 11,
  name: '2OU+ | CASAIS - XAXIM',
  local: 'Rua Tenente Olderico Gabardo, 304 – Xaxim – Curitiba/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Gael e Ketura',
  wa: '5541995375045',
  group: 'Casais',
  city: 'Curitiba'
}, {
  id: 13,
  name: '2OU+ | CAMPO LARGO',
  local: 'Rua João Florindo Zanetti, 660 – Ouro Verde I – Campo Largo/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Edson e Joisse',
  wa: '554199372611',
  group: 'Casais',
  city: 'Campo Largo'
}, {
  id: 14,
  name: '2OU+ | COLOMBO',
  local: 'Rua Rio São Francisco, 180 – Roça Grande – Colombo/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Diogo e Mirela',
  wa: '5541999002799',
  group: 'Casais',
  city: 'Colombo'
}, {
  id: 20,
  name: '2OU+ | MULHERES - PINHAIS',
  local: 'Rua Nigéria, 180 – Pineville – Pinhais/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Carla',
  wa: '5541985067880',
  group: 'Mulheres',
  city: 'Pinhais'
}, {
  id: 21,
  name: '2OU+ | MULHERES - XAXIM',
  local: 'Rua Ângelo Scaramuza, 222 - Xaxim, Curitiba/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Nicolly',
  wa: '5541996039373',
  group: 'Mulheres',
  city: 'Curitiba'
}, {
  id: 25,
  name: '2OU+ | INFLUA - BASE - FEMININO (PINHEIRINHO)',
  local: 'Rua Reinaldo Stocco, 174 - Apto 1205 - Torre Atlanta - Pinheirinho – Curitiba/PR',
  when: 'Terça-feira às 20:00',
  leaders: 'Nathy',
  wa: '5541998494579',
  group: 'Influa',
  city: 'Curitiba'
}, {
  id: 22,
  name: '2OU+ | INFLUA - BASE - MASCULINO',
  local: 'Rua Marcos Jacob Déa, 88 – Cajuru – Curitiba/PR',
  when: 'Terça-feira às 20:00',
  leaders: 'Otávio',
  wa: '5541995807530',
  group: 'Influa',
  city: 'Curitiba'
}, {
  id: 26,
  name: '2OU+ | INFLUA - FEMININO (HAUER)',
  local: 'Rua Padre Dehon, 1260 – Hauer – Curitiba/PR',
  when: 'Sábado às 10:00',
  leaders: 'Beatriz',
  wa: '5541998443004',
  group: 'Influa',
  city: 'Curitiba'
}, {
  id: 24,
  name: '2OU+ | INFLUA - MASCULINO (HAUER) +18',
  local: 'Rua Padre Dehon, 1260 – Hauer – Curitiba/PR',
  when: 'Sábado às 10:00',
  leaders: 'Gabriel',
  wa: '5541999680515',
  group: 'Influa',
  city: 'Curitiba'
}, {
  id: 29,
  name: '2OU+ | JOVENS CASAIS',
  local: 'Rua Renato Baroni, 87 - Guabirotuba',
  when: 'Segunda-feira às 20:00',
  leaders: 'Marioto e Fernanda',
  wa: '5512996041501',
  group: 'Casais',
  city: 'Curitiba'
}, {
  id: 30,
  name: '2OU+ | CASAIS - LONDRINA',
  local: 'Rua Espírito Santo, 1579 - Centro - Londrina/RP',
  when: 'Terça-feira às 19:30',
  leaders: 'Gabriel e Isadora',
  wa: '5531984417676',
  group: 'Casais',
  city: 'Londrina'
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app-2ou/data.js", error: String((e && e.message) || e) }); }

// ui_kits/app-2ou/directory.jsx
try { (() => {
const {
  GCCard,
  Input,
  Select,
  Tag,
  Icon,
  Wordmark,
  Badge,
  Checkbox
} = window.PoiemaDesignSystem_dcfe26;
function AppHeader() {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      background: 'var(--ink-1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      padding: '0 20px',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 24,
    city: "Curitiba",
    inverse: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent"
  }, "2OU+"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 150,
      background: 'repeating-linear-gradient(45deg,#242120 0 16px,#1b1917 16px 32px)',
      display: 'flex',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 10,
      left: 20,
      fontFamily: 'var(--font-ui)',
      fontSize: 10,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,.35)'
    }
  }, "Banner placeholder"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--overlay-protect)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 1080,
      width: '100%',
      margin: '0 auto',
      padding: '0 20px 18px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 46,
      lineHeight: .94,
      letterSpacing: 'var(--ls-display)',
      textTransform: 'uppercase',
      color: 'var(--paper-1)'
    }
  }, "Endere\xE7os dos grupos de comunh\xE3o"))));
}
function Directory() {
  const all = window.GC_DATA;
  const [q, setQ] = React.useState('');
  const [g, setG] = React.useState('Todos');
  const [day, setDay] = React.useState('todos');
  const [near, setNear] = React.useState(false);
  const [share, setShare] = React.useState(null);
  const groups = ['Todos', 'Casais', 'Mulheres', 'Influa'];
  const list = all.filter(x => (g === 'Todos' || x.group === g) && (day === 'todos' || x.when.toLowerCase().startsWith(day)) && (!near || x.city === 'Curitiba') && (x.name + x.local + x.leaders).toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper-2)',
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement(AppHeader, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: 'rgba(255,255,255,.9)',
      backdropFilter: 'var(--blur-glass)',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      padding: '14px 20px',
      display: 'flex',
      gap: 14,
      alignItems: 'flex-end',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Buscar",
    placeholder: "Bairro, cidade ou l\xEDder",
    value: q,
    onChange: e => setQ(e.target.value),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 18
    }),
    style: {
      width: 300
    }
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Dia",
    value: day,
    onChange: e => setDay(e.target.value),
    style: {
      width: 170
    },
    options: [{
      value: 'todos',
      label: 'Todos os dias'
    }, {
      value: 'segunda',
      label: 'Segunda-feira'
    }, {
      value: 'terça',
      label: 'Terça-feira'
    }, {
      value: 'quarta',
      label: 'Quarta-feira'
    }, {
      value: 'sábado',
      label: 'Sábado'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      paddingBottom: 5
    }
  }, groups.map(x => /*#__PURE__*/React.createElement(Tag, {
    key: x,
    selected: g === x,
    onClick: () => setG(x)
  }, x))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 8,
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Somente Curitiba",
    checked: near,
    onChange: e => setNear(e.target.checked)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      padding: '24px 20px 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-micro)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 14
    }
  }, list.length, " grupos"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
      gap: 14
    }
  }, list.map(x => /*#__PURE__*/React.createElement(GCCard, {
    key: x.id,
    name: x.name,
    local: x.local,
    when: x.when,
    leaders: x.leaders,
    whatsapp: 'https://wa.me/' + x.wa,
    tag: x.group,
    onShare: () => setShare(x)
  }))), list.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Nenhum grupo encontrado com esses filtros.")), /*#__PURE__*/React.createElement(ShareSheet, {
    gc: share,
    onClose: () => setShare(null)
  }));
}
Object.assign(window, {
  Directory,
  AppHeader
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app-2ou/directory.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app-2ou/share-sheet.jsx
try { (() => {
const {
  Button,
  IconButton,
  Icon,
  Wordmark
} = window.PoiemaDesignSystem_dcfe26;
function shareText(gc) {
  return '🌟 ' + gc.name + '\n\n📍 Local: ' + gc.local + '\n📅 Dia/Hora: ' + gc.when + '\n👥 Líderes: ' + gc.leaders + '\n\n🔗 https://app.poiemacuritiba.com.br/2ou+#gc-' + gc.id;
}
function ShareSheet({
  gc,
  onClose
}) {
  const [copied, setCopied] = React.useState(false);
  if (!gc) return null;
  const text = shareText(gc);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--overlay-scrim)',
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(560px,100%)',
      background: 'var(--paper-1)',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '18px 20px',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-micro)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase'
    }
  }, "Compartilhar 2OU+"), /*#__PURE__*/React.createElement(IconButton, {
    label: "Fechar",
    onClick: onClose,
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-micro)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 8
    }
  }, "Texto para compartilhamento:"), /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: 0,
      whiteSpace: 'pre-wrap',
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-body-sm)',
      lineHeight: 1.7,
      background: 'var(--paper-2)',
      padding: '14px 16px',
      boxShadow: 'inset 0 0 0 1px var(--border-hairline)'
    }
  }, text), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    onClick: () => {
      navigator.clipboard && navigator.clipboard.writeText(text);
      setCopied(true);
    }
  }, copied ? 'Copiado' : 'Copiar texto'), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    href: 'https://wa.me/?text=' + encodeURIComponent(text),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "message-circle",
      size: 16
    })
  }, "WhatsApp")))));
}
Object.assign(window, {
  ShareSheet,
  shareText
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app-2ou/share-sheet.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/gcs-screen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  SectionLabel,
  GCCard,
  Input,
  Tag,
  Icon,
  Card,
  Button
} = window.PoiemaDesignSystem_dcfe26;
const GCS = [{
  name: '2OU+ | CASAIS - BAIRRO ALTO',
  local: 'Rua Marco Polo, 16 - Bairro Alto – Curitiba/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Raphael e Kezia',
  whatsapp: 'https://wa.me/5548991914758',
  group: 'Casais'
}, {
  name: '2OU+ | CASAIS - BOQUEIRÃO',
  local: 'Rua Arthur Manoel Iwersen, 550 – SB 79 – Boqueirão – Curitiba/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Ronaldo e Luciana',
  whatsapp: 'https://wa.me/5541992299262',
  group: 'Casais'
}, {
  name: '2OU+ | CASAIS - HAUER',
  local: 'Rua Oliveira Viana, 1385 - Sobrado 4 - Hauer - Curitiba/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Kahoe e Carol',
  whatsapp: 'https://wa.me/5541996993982',
  group: 'Casais'
}, {
  name: '2OU+ | MULHERES - XAXIM',
  local: 'Rua Ângelo Scaramuza, 222 - Xaxim, Curitiba/PR',
  when: 'Quarta-feira às 20:00',
  leaders: 'Nicolly',
  whatsapp: 'https://wa.me/5541996039373',
  group: 'Mulheres'
}, {
  name: '2OU+ | INFLUA - MASCULINO (HAUER) +18',
  local: 'Rua Padre Dehon, 1260 – Hauer – Curitiba/PR',
  when: 'Sábado às 10:00',
  leaders: 'Gabriel',
  whatsapp: 'https://wa.me/5541999680515',
  group: 'Influa'
}, {
  name: '2OU+ | JOVENS CASAIS',
  local: 'Rua Renato Baroni, 87 - Guabirotuba',
  when: 'Segunda-feira às 20:00',
  leaders: 'Marioto e Fernanda',
  whatsapp: 'https://wa.me/5512996041501',
  group: 'Casais'
}];
function GCsScreen({
  onOpenApp
}) {
  const [q, setQ] = React.useState('');
  const [g, setG] = React.useState('Todos');
  const groups = ['Todos', 'Casais', 'Mulheres', 'Influa'];
  const list = GCS.filter(x => (g === 'Todos' || x.group === g) && (x.name + x.local + x.leaders).toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      padding: 'var(--section-y-tight) var(--gutter-page) var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    eyebrow: "Grupos de crescimento",
    title: "Encontre o GC mais pr\xF3ximo de voc\xEA",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      onClick: onOpenApp
    }, "Abrir app 2OU+")
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: 'var(--measure-prose)',
      marginTop: 'var(--space-5)',
      color: 'var(--text-body)'
    }
  }, "Procure as mesas do Senhor, o discipulado e a alegria da fam\xEDlia espiritual dispon\xEDvel para todos."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'flex-end',
      margin: 'var(--space-6) 0 var(--space-5)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Buscar",
    placeholder: "Bairro, cidade ou l\xEDder",
    value: q,
    onChange: e => setQ(e.target.value),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 18
    }),
    style: {
      width: 340
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      paddingBottom: 4
    }
  }, groups.map(x => /*#__PURE__*/React.createElement(Tag, {
    key: x,
    selected: g === x,
    onClick: () => setG(x)
  }, x)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
      gap: 'var(--space-5)'
    }
  }, list.map(x => /*#__PURE__*/React.createElement(GCCard, _extends({
    key: x.name + x.leaders
  }, x, {
    tag: x.group
  }))))));
}
Object.assign(window, {
  GCsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/gcs-screen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/hero.jsx
try { (() => {
const {
  Wordmark,
  Button,
  ScriptureQuote
} = window.PoiemaDesignSystem_dcfe26;
function Hero({
  city
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      background: 'var(--ink-1)',
      minHeight: 620,
      display: 'flex',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'repeating-linear-gradient(45deg,#242120 0 16px,#1b1917 16px 32px)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 16,
      left: 24,
      fontSize: 10,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,.35)'
    }
  }, "Full-bleed image placeholder"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--overlay-protect)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      padding: '0 var(--gutter-page) var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 40,
    city: city,
    inverse: true
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-display-1)',
      lineHeight: 'var(--lh-display)',
      letterSpacing: 'var(--ls-display)',
      textTransform: 'uppercase',
      color: 'var(--paper-1)',
      maxWidth: '14ch'
    }
  }, "Um poema \xE0s na\xE7\xF5es"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-4)',
      fontSize: 'var(--text-body-lg)',
      color: '#D9D5D1',
      maxWidth: '42ch'
    }
  }, "De criaturas a servos, amigos e filhos. Somos igreja, dentro e fora das paredes."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Encontre um GC"), /*#__PURE__*/React.createElement(Button, {
    variant: "inverse",
    size: "lg"
  }, "Assista as prega\xE7\xF5es"))));
}
Object.assign(window, {
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/home-screen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  SectionLabel,
  Button,
  Card,
  SermonCard,
  EventCard,
  FeedTile,
  ScriptureQuote,
  Icon
} = window.PoiemaDesignSystem_dcfe26;
const Wrap = ({
  children,
  tone,
  style
}) => /*#__PURE__*/React.createElement("section", {
  "data-theme": tone === 'dark' ? 'inverse' : undefined,
  style: {
    background: tone === 'dark' ? 'var(--ink-1)' : tone === 'white' ? 'var(--paper-1)' : 'var(--paper-2)',
    padding: 'var(--section-y) 0',
    ...style
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 'var(--max-content)',
    margin: '0 auto',
    padding: '0 var(--gutter-page)'
  }
}, children));
function ServiceTimes() {
  const rows = [['Domingo', '10h e 18h', 'Culto'], ['Terça e quarta', '20h', 'GCs nas casas'], ['Sábado', '10h', 'Influa (jovens)']];
  return /*#__PURE__*/React.createElement(Wrap, {
    tone: "white"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)',
      gap: 'var(--space-9)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, {
    eyebrow: "Programa\xE7\xE3o",
    title: "Nossos encontros"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-5)',
      maxWidth: 'var(--measure-prose)',
      color: 'var(--text-body)'
    }
  }, "Nossos cultos acontecem no seguinte endere\xE7o: Av. Marechal Floriano Peixoto, 4010. Voc\xEA \xE9 nosso convidado para estarmos juntos."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 'var(--space-5)',
      color: 'var(--text-muted)',
      fontSize: 'var(--text-body-sm)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 18
  }), " Av. Marechal Floriano Peixoto, 4010 \u2014 Curitiba/PR")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 1,
      background: 'var(--border-hairline)'
    }
  }, rows.map(([d, h, w]) => /*#__PURE__*/React.createElement("div", {
    key: d + w,
    style: {
      background: 'var(--paper-1)',
      padding: 'var(--space-5)',
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      letterSpacing: '.02em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      minWidth: 170
    }
  }, d), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontWeight: 700,
      fontSize: 'var(--text-h3)',
      color: 'var(--text-accent)'
    }
  }, h), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: 'var(--text-micro)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, w))))));
}
function ScriptureBand() {
  return /*#__PURE__*/React.createElement(Wrap, {
    tone: "dark"
  }, /*#__PURE__*/React.createElement(ScriptureQuote, {
    size: "lg",
    align: "center",
    inverse: true,
    reference: "Ef\xE9sios 2:10"
  }, "\u201CPorque somos poiema de Deus, realizada em Cristo Jesus para fazermos boas obras, as quais Deus preparou antes para n\xF3s as praticarmos.\u201D"));
}
function GCBand({
  onGo
}) {
  return /*#__PURE__*/React.createElement(Wrap, {
    tone: "white"
  }, /*#__PURE__*/React.createElement(Card, {
    accentRule: true,
    padding: "var(--space-8)",
    style: {
      display: 'grid',
      gap: 'var(--space-5)',
      justifyItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-micro)',
      fontWeight: 600,
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--text-accent)'
    }
  }, "Vida na vida"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-display-2)',
      lineHeight: 'var(--lh-display)',
      letterSpacing: 'var(--ls-display)',
      textTransform: 'uppercase',
      maxWidth: '20ch'
    }
  }, "Encontre o GC mais pr\xF3ximo de voc\xEA"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 'var(--measure-prose)',
      color: 'var(--text-body)'
    }
  }, "Pra n\xF3s, n\xE3o \xE9 um m\xE9todo, mas o verdadeiro lifestyle da igreja: vida na vida. As igrejas reunidas nas casas mostram o corpo de Cristo crescendo nas cidades."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: onGo
  }, "Ver todos os GCs")));
}
function Sermons({
  onGo
}) {
  const list = [{
    series: 'Poiema Curitiba',
    title: 'A única fonte de luz da igreja',
    preacher: 'Gustavo Strumiello',
    date: '24 nov',
    duration: '48:12'
  }, {
    series: 'Poiema Curitiba',
    title: 'Largar o controle',
    preacher: 'Leandro Barreto',
    date: '17 nov',
    duration: '51:40'
  }, {
    series: 'Poiema Taubaté',
    title: 'Chamado e vocação',
    preacher: 'Time de ministros',
    date: '10 nov',
    duration: '44:05'
  }];
  return /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(SectionLabel, {
    eyebrow: "Prega\xE7\xF5es",
    title: "Assista nossas \xFAltimas prega\xE7\xF5es",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      onClick: onGo
    }, "Ver biblioteca")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
      gap: 'var(--space-5)',
      marginTop: 'var(--space-6)'
    }
  }, list.map(s => /*#__PURE__*/React.createElement(SermonCard, _extends({
    key: s.title
  }, s)))));
}
function Events() {
  return /*#__PURE__*/React.createElement(Wrap, {
    tone: "white"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    eyebrow: "Agenda",
    title: "Confer\xEAncias e retiros"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
      gap: 'var(--space-5)',
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(EventCard, {
    name: "Get Up Conference",
    dates: "28, 29 e 30 de mar\xE7o",
    place: "Curitiba/PR",
    status: "Inscri\xE7\xF5es abertas",
    blurb: "N\xE3o buscamos multid\xF5es, mas cora\xE7\xF5es queimando por Deus. Get Up \xE9 um convite para um novo posicionamento, para um movimento em dire\xE7\xE3o ao nosso maior alvo: Cristo."
  }), /*#__PURE__*/React.createElement(EventCard, {
    name: "Poiema Garden",
    dates: "Mar\xE7o",
    place: "Para voc\xEA e seu c\xF4njuge",
    status: "Em breve",
    cta: "Avise-me",
    blurb: "Ser\xE3o dias incr\xEDveis para voc\xEA e seu c\xF4njuge."
  })));
}
function Feed() {
  const caps = [{
    kind: 'reel',
    caption: 'Nós fomos chamados para curar as pessoas!'
  }, {
    kind: 'post',
    caption: 'Estamos distraídos demais com os nossos desejos e necessidades, quando deveríamos voltar os nossos olhos para o propósito de Jesus para nós.'
  }, {
    kind: 'reel',
    caption: 'Você é nosso convidado para estarmos juntos nos dois cultos deste domingo, às 10h e 18h. 📌 Av. Marechal Floriano Peixoto, 4010'
  }, {
    kind: 'post',
    caption: 'Vivemos dias rápidos, cheios de afazeres, inundados de ansiedade. Às 18h, temos mais um culto e esperamos por você! ❤️‍🔥'
  }, {
    kind: 'reel',
    caption: 'Esse dia ficará marcado em nossos corações! 🌱'
  }, {
    kind: 'reel',
    caption: 'IMPERDÍVEL! 🔥 As inscrições para o POIEMA GARDEN já estão abertas ❤️‍🔥'
  }];
  return /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(SectionLabel, {
    eyebrow: "@poiemacuritiba",
    title: "No Instagram",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      href: "https://www.instagram.com/poiemacuritiba/"
    }, "Seguir")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6,minmax(0,1fr))',
      gap: 2,
      marginTop: 'var(--space-6)'
    }
  }, caps.map((c, i) => /*#__PURE__*/React.createElement(FeedTile, _extends({
    key: i
  }, c)))));
}
function HomeScreen({
  onGo
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Hero, {
    city: "Curitiba"
  }), /*#__PURE__*/React.createElement(ServiceTimes, null), /*#__PURE__*/React.createElement(ScriptureBand, null), /*#__PURE__*/React.createElement(GCBand, {
    onGo: () => onGo('gcs')
  }), /*#__PURE__*/React.createElement(Sermons, {
    onGo: () => onGo('pregacoes')
  }), /*#__PURE__*/React.createElement(Events, null), /*#__PURE__*/React.createElement(Feed, null));
}
Object.assign(window, {
  HomeScreen,
  Wrap
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/home-screen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/sermons-screen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  SectionLabel,
  SermonCard,
  Input,
  Select,
  Tag,
  Icon
} = window.PoiemaDesignSystem_dcfe26;
const ALL = [{
  series: 'Poiema Curitiba',
  title: 'A única fonte de luz da igreja',
  preacher: 'Gustavo Strumiello',
  date: '24 nov',
  duration: '48:12',
  campus: 'Curitiba'
}, {
  series: 'Poiema Curitiba',
  title: 'Largar o controle',
  preacher: 'Leandro Barreto',
  date: '17 nov',
  duration: '51:40',
  campus: 'Curitiba'
}, {
  series: 'Poiema Taubaté',
  title: 'Chamado e vocação',
  preacher: 'Time de ministros',
  date: '10 nov',
  duration: '44:05',
  campus: 'Taubaté'
}, {
  series: 'Poiema Taubaté',
  title: 'Igreja paternal',
  preacher: 'Time de ministros',
  date: '03 nov',
  duration: '39:22',
  campus: 'Taubaté'
}, {
  series: 'Poiema Curitiba',
  title: 'Crescer na direção de Deus',
  preacher: 'Leandro Barreto',
  date: '27 out',
  duration: '46:18',
  campus: 'Curitiba'
}, {
  series: 'Poiema Curitiba',
  title: 'Não apenas conhecer, mas viver a palavra',
  preacher: 'Gustavo Strumiello',
  date: '20 out',
  duration: '52:07',
  campus: 'Curitiba'
}];
function SermonsScreen() {
  const [q, setQ] = React.useState('');
  const [campus, setCampus] = React.useState('todos');
  const list = ALL.filter(s => (campus === 'todos' || s.campus === campus) && (s.title + s.preacher).toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper-2)',
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      padding: 'var(--section-y-tight) var(--gutter-page) var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    eyebrow: "Biblioteca",
    title: "Prega\xE7\xF5es"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'flex-end',
      margin: 'var(--space-6) 0 var(--space-5)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Buscar",
    placeholder: "T\xEDtulo ou ministro",
    value: q,
    onChange: e => setQ(e.target.value),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 18
    }),
    style: {
      width: 320
    }
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Campus",
    value: campus,
    onChange: e => setCampus(e.target.value),
    style: {
      width: 200
    },
    options: [{
      value: 'todos',
      label: 'Todos'
    }, {
      value: 'Curitiba',
      label: 'Poiema Curitiba'
    }, {
      value: 'Taubaté',
      label: 'Poiema Taubaté'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: "neutral"
  }, list.length, " resultados"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
      gap: 'var(--space-5)'
    }
  }, list.map(s => /*#__PURE__*/React.createElement(SermonCard, _extends({
    key: s.title
  }, s)))), list.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Nenhuma prega\xE7\xE3o encontrada.")));
}
Object.assign(window, {
  SermonsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/sermons-screen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ScriptureQuote = __ds_scope.ScriptureQuote;

__ds_ns.SectionLabel = __ds_scope.SectionLabel;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.EventCard = __ds_scope.EventCard;

__ds_ns.FeedTile = __ds_scope.FeedTile;

__ds_ns.GCCard = __ds_scope.GCCard;

__ds_ns.SermonCard = __ds_scope.SermonCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.NavBar = __ds_scope.NavBar;

})();
