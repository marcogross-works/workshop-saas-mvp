// lib/email.ts
// Resend email helpers — all copy in Brazilian Portuguese

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "noreply@yourdomain.com";
const APP_NAME = "UX Unicórnio Workshop";

// ─── Magic Link ───────────────────────────────────────────────────────────────

/**
 * Sends a magic link (passwordless sign-in) email.
 * Used by Auth.js as the custom email sender.
 */
export async function sendMagicLink(
  email: string,
  url: string
): Promise<void> {
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `Seu link de acesso — ${APP_NAME}`,
    html: magicLinkHtml(url),
    text: magicLinkText(url),
  });

  if (error) {
    console.error("[email] sendMagicLink error:", error);
    throw new Error(`Failed to send magic link: ${error.message}`);
  }
}

function magicLinkHtml(url: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Seu link de acesso</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#6d28d9;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                🦄 ${APP_NAME}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 12px;font-size:20px;color:#111827;font-weight:600;">
                Seu link de acesso chegou!
              </h2>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#4b5563;">
                Clique no botão abaixo para entrar na sua conta. Não é necessária nenhuma senha.
              </p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${url}"
                       style="display:inline-block;background:#6d28d9;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">
                      Entrar agora
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;text-align:center;">
                Este link expira em 24 horas e só pode ser usado uma vez.<br />
                Se você não solicitou este e-mail, pode ignorá-lo com segurança.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#d1d5db;">
                © ${new Date().getFullYear()} ${APP_NAME}. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function magicLinkText(url: string): string {
  return `${APP_NAME} — Link de acesso

Clique no link abaixo para entrar na sua conta:

${url}

Este link expira em 24 horas e só pode ser usado uma vez.
Se você não solicitou este e-mail, pode ignorá-lo com segurança.`;
}

// ─── Welcome Email ────────────────────────────────────────────────────────────

/**
 * Sends a welcome email after the user's first successful sign-in.
 */
export async function sendWelcomeEmail(
  email: string,
  name: string | null | undefined
): Promise<void> {
  const firstName = name?.split(" ")[0] ?? "por aí";

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `Bem-vindo(a) ao ${APP_NAME}! 🎉`,
    html: welcomeHtml(firstName),
    text: welcomeText(firstName),
  });

  if (error) {
    console.error("[email] sendWelcomeEmail error:", error);
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }
}

function welcomeHtml(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bem-vindo!</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#6d28d9;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                🦄 ${APP_NAME}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 12px;font-size:20px;color:#111827;font-weight:600;">
                Olá, ${firstName}! Seja bem-vindo(a) 🎉
              </h2>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#4b5563;">
                Estamos muito felizes em ter você por aqui. Sua conta foi criada com sucesso e
                você tem <strong>14 dias de acesso gratuito</strong> a todos os recursos PRO.
              </p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#4b5563;">
                Aproveite ao máximo o período de teste e nos diga se tiver alguma dúvida!
              </p>

              <!-- Feature highlights -->
              <table cellpadding="0" cellspacing="0" width="100%" style="background:#f9fafb;border-radius:8px;padding:0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#374151;">
                      ✅ O que você pode fazer no plano TRIAL:
                    </p>
                    <ul style="margin:0;padding-left:20px;font-size:14px;color:#4b5563;line-height:1.8;">
                      <li>Criar listas de tarefas ilimitadas</li>
                      <li>Adicionar itens ilimitados por lista</li>
                      <li>Reorganizar tarefas com drag and drop</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;text-align:center;">
                Tem dúvidas? Responda este e-mail e ficaremos felizes em ajudar.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#d1d5db;">
                © ${new Date().getFullYear()} ${APP_NAME}. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function welcomeText(firstName: string): string {
  return `Olá, ${firstName}! Seja bem-vindo(a) ao ${APP_NAME}! 🎉

Sua conta foi criada com sucesso. Você tem 14 dias de acesso gratuito a todos os recursos PRO.

O que você pode fazer no plano TRIAL:
- Criar listas de tarefas ilimitadas
- Adicionar itens ilimitados por lista
- Reorganizar tarefas com drag and drop

Aproveite ao máximo o período de teste!

Tem dúvidas? Responda este e-mail.

© ${new Date().getFullYear()} ${APP_NAME}`;
}
