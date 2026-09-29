# Como contribuir

Padrão de commits, branches e PRs deste repositório. Aplicado automaticamente
pelo husky (`commit-msg` e `pre-commit`) — commit fora do padrão é rejeitado
localmente, então isto aqui não é sugestão, é o que o hook cobra.

## Commits — Conventional Commits

```
<tipo>(<escopo>): <descrição no imperativo, minúsculo, sem ponto final>
```

**Tipos**: `feat` `fix` `docs` `style` `refactor` `perf` `test` `chore` `ci` `build` `revert`

**Escopos** (um por commit, sempre presente):

| Escopo | Área |
|---|---|
| `ui` | `components/ui`, design system, tokens |
| `auth` | login, sessão, perfil |
| `gallery` | eventos, sessões, fotos |
| `upload` | envio de fotos, conversão, R2 |
| `search` | busca facial |
| `admin` | telas de administração |
| `api` | `app/api/*` |
| `ci` | `.github/workflows` |
| `docs` | `docs/`, `README.md`, `CLAUDE.md` |
| `deps` | `package.json` e dependências |
| `repo` | configuração geral do repositório |

Exemplos:

```
feat(auth): trata perfil provisionado inativo após login
fix(upload): corrige conversão WebP em imagens EXIF rotacionadas
docs(docs): documenta o fluxo de busca facial em ARQUITETURA.md
ci(ci): adiciona checagem de variáveis NEXT_PUBLIC_
```

Corpo do commit (opcional, linha em branco depois do subject) explica o
**porquê**, não o *o quê* — o diff já mostra o quê.

## Branches

```
<tipo>/<slug-em-kebab-case>
```

Mesmos tipos dos commits.

```
feat/tela-login
fix/thumb-orientacao-exif
chore/foundation
```

`main`, `master` e `develop` são as únicas exceções ao padrão.

## Pull Requests

- **Título**: mesmo formato do commit — `tipo(escopo): descrição`. É o que
  vira changelog num squash merge.
- **Descrição**: usar o template em
  [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)
  (preenchido automaticamente ao abrir o PR no GitHub).
- PR que muda `docs/CONTRATO.md` sem a mesma edição no core no mesmo ciclo
  não é mergeado (CONTRATO.md, cabeçalho).
- `develop` = integração (destino usual de PR de feature); `master` =
  produção (só recebe PR de release `develop` → `master`).

## O que os hooks fazem

| Hook | Quando | O quê |
|---|---|---|
| `pre-commit` | todo commit | valida o nome da branch atual (`scripts/check-branch-name.sh`) |
| `commit-msg` | todo commit | valida a mensagem via `commitlint.config.js` |

Rodam via `husky`, instalado pelo script `prepare` do `package.json` — basta
`npm install` depois do clone.
