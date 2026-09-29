# Configuração manual do Supabase Auth — galeria-web

Passos feitos no painel do Supabase (projeto do `poiema-gallery`), no mesmo
espírito de `docs/adr/0006-supabase-manual-setup.md` do core: nada disto é
automatizado por migration ou script, porque é configuração do projeto
Supabase Auth, não do schema do banco.

## 1. Site URL e Redirect URLs

**Authentication → URL Configuration**

- **Site URL**: `https://<domínio-da-vercel>` em produção. Em
  desenvolvimento local, `http://localhost:3000` (bate com
  `NEXT_PUBLIC_SITE_URL` do `.env.local`).
- **Redirect URLs** (lista de permitidas): adicionar as duas variantes de
  `/auth/confirm`, para local e produção:
  - `http://localhost:3000/auth/confirm`
  - `https://<domínio-da-vercel>/auth/confirm`

Sem isso, `verifyOtp` funciona mas o link do e-mail não redireciona pro
domínio certo.

## 2. Templates de e-mail (pt-BR)

**Authentication → Email Templates**

### Invite user

Assunto: `Convite — Galeria Poiema CWB`

Corpo (adaptar o texto ao gosto, mas manter o link exatamente assim):

```html
<h2>Você foi convidado para a Galeria Poiema CWB</h2>
<p>Clique no link abaixo para criar sua senha e ativar o acesso.</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite">Criar minha conta</a></p>
<p>Este convite expira em 7 dias.</p>
```

### Reset password

Assunto: `Recuperação de senha — Galeria Poiema CWB`

```html
<h2>Recuperação de senha</h2>
<p>Se foi você quem pediu, clique no link abaixo para definir uma nova senha.</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery">Definir nova senha</a></p>
<p>Se você não pediu isso, ignore este e-mail.</p>
```

`{{ .TokenHash }}` e `{{ .SiteURL }}` são variáveis do template do Supabase
— não trocar por outra coisa, é o que `app/auth/confirm/route.ts` espera
receber (`token_hash` + `type`).

## 3. Signup público

**Authentication → Providers → Email**

Confirmar que **"Allow new users to sign up" continua desligado**. Conta
nova só existe por convite enviado pelo painel (Authentication → Users →
Invite user) até a tela de membros (fase 6) substituir esse passo manual.

## 4. Política de senha mínima

**Authentication → Policies** (ou "Password Requirements", dependendo da
versão do painel): mínimo de **8 caracteres**. É o mesmo mínimo validado em
`lib/auth/actions.ts` (`setNewPassword`, `acceptInvite`) — os dois lados
precisam concordar, senão alguém passa pela validação do form e é rejeitado
pela API (ou pior, o contrário).
