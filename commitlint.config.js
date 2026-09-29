module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "ui", // components/ui, design system, tokens
        "auth", // login, sessão, perfil
        "gallery", // eventos, sessões, fotos
        "upload", // envio de fotos, conversão, R2
        "search", // busca facial
        "admin", // telas de administração
        "api", // app/api/*
        "ci", // .github/workflows
        "docs", // docs/, README, CLAUDE.md
        "deps", // package.json e dependências
        "repo", // configuração geral do repositório
      ],
    ],
    "scope-empty": [2, "never"],
    "subject-case": [2, "never", ["start-case", "pascal-case", "upper-case"]],
  },
};
