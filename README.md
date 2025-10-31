# Site — Cleciane Becker

Site estático (HTML/CSS/JS) para apresentar a Cleciane Becker, seus programas (Soul Luz, Soul Travel), a comunidade Soul Family e abrir um “diálogo sagrado” via formulário/WhatsApp.

## O que tem aqui

### Páginas
- `index.html` — Landing com hero em vídeo, serviços, depoimentos, CTA e embed do Spotify.
- `sobre.html` — Biografia e missão.
- `soul-luz.html` — Programa de 6 meses com planos Raiz/Alquimia/Ascensão.
- `soul-travel.html` — Jornada de transição consciente (astrocartografia + orientação vibracional).
- `soul-family.html` — Comunidade e formulário de entrada.

### Estilos
- `style.css` — Paleta etérea, tipografia, cards, modais, responsividade.

### Scripts
- `scripts.js` — Navegação mobile, modal de contato, lógica simples de UI (e envio de formulário se configurado).

### Dependências locais
- Fontes e imagens (ex.: `images/Logotipo.webp`, `images/capa_Soul_Luz.webp`, `images/hero_video.mp4`, etc.).

> Observação: há um `package.json` de projeto React/Next.js, mas o site atual é **estático** e não usa build. Pode ignorar ou remover para evitar confusão.

---

## Publicação (Cloudflare Pages)
- Tipo: **estático** (sem build).
- Build command: *(vazio)*  
- Output directory: `/`  
- Conecte ao GitHub → *Create project* → Publish.

## Formulários (rápido)
- Use **Formspree** (ou similar): adicione `action="https://formspree.io/f/SEU_ENDPOINT"` e `method="POST"` no `<form>`.
- Ou direcione CTAs para **WhatsApp** via `https://wa.me/SEU_NUMERO`.

---

## Créditos
- **Conteúdo & direção:** Cleciane Becker  
- **Design/Dev:** Portal Etéreo (HTML/CSS/JS)  
- **Fontes:** Montserrat (Google Fonts), TAN Mon Cheri (local)  
- **Ícones:** Font Awesome

## Roadmap
- Newsletter (Brevo/Mailchimp)  
- Links de pagamento (Stripe/PayPal) por plano  
- Antispam (Cloudflare Turnstile)  
- Blog estático ou migração futura para CMS/Next.js

## Licença
Conteúdos e marca reservados à Cleciane Becker. Código base pode ser reaproveitado internamente com crédito.
