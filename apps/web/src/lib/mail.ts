const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || ''
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'ustalama.com'
const MAILGUN_FROM = process.env.MAILGUN_FROM || 'Ustalama <noreply@ustalama.com>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ustalama.com'

async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const form = new URLSearchParams()
  form.append('from', MAILGUN_FROM)
  form.append('to', to)
  form.append('subject', subject)
  form.append('html', html)

  const res = await fetch(`https://api.eu.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64'),
    },
    body: form,
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Mailgun error:', err)
    throw new Error(`Mail gönderilemedi: ${res.status}`)
  }

  return res.json()
}

function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#4f46e5,#7c3aed,#db2777);padding:32px 40px;text-align:center;">
          <div style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
            <span style="color:#ffffff;font-weight:900;font-size:24px;">U</span>
          </div>
          <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0;">Ustalama</h1>
        </td></tr>
        <!-- Content -->
        <tr><td style="padding:40px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 40px;background-color:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">Bu mail <a href="${APP_URL}" style="color:#6366f1;text-decoration:none;">ustalama.com</a> tarafından gönderilmiştir.</p>
          <p style="color:#9ca3af;font-size:12px;margin:8px 0 0;">© ${new Date().getFullYear()} Ustalama. Tüm hakları saklıdır.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendWelcomeEmail(to: string, name: string) {
  const displayName = name || 'Değerli Kullanıcımız'
  const html = baseTemplate(`
    <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 16px;">Hoş Geldiniz! 🎉</h2>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px;">
      Merhaba <strong>${displayName}</strong>,
    </p>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px;">
      Ustalama ailesine katıldığınız için çok mutluyuz! Artık binlerce hizmet sağlayıcı arasından
      ihtiyacınıza en uygun olanı bulabilir veya kendi hizmetlerinizi sunabilirsiniz.
    </p>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px;">
      Hemen profilinizi tamamlayarak başlayın:
    </p>
    <div style="text-align:center;margin:0 0 24px;">
      <a href="${APP_URL}/profil" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;font-weight:600;font-size:16px;text-decoration:none;border-radius:12px;">
        Profilime Git
      </a>
    </div>
    <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:0 0 16px;">
      <p style="color:#166534;font-size:14px;margin:0;font-weight:600;">İlk adımlar:</p>
      <ul style="color:#166534;font-size:14px;margin:8px 0 0;padding-left:20px;">
        <li style="margin-bottom:4px;">Profil bilgilerinizi tamamlayın</li>
        <li style="margin-bottom:4px;">Kategorilere göz atın</li>
        <li>İlk talebinizi oluşturun veya hizmet verin</li>
      </ul>
    </div>
    <p style="color:#6b7280;font-size:14px;margin:0;">
      Herhangi bir sorunuz varsa bize ulaşmaktan çekinmeyin.
    </p>
  `)

  return sendMail({ to, subject: 'Ustalama\'ya Hoş Geldiniz! 🎉', html })
}

export async function sendPasswordResetEmail(to: string, name: string, resetToken: string) {
  const displayName = name || 'Değerli Kullanıcımız'
  const resetUrl = `${APP_URL}/sifre-sifirla?token=${resetToken}`
  const html = baseTemplate(`
    <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 16px;">Şifre Sıfırlama</h2>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px;">
      Merhaba <strong>${displayName}</strong>,
    </p>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px;">
      Hesabınız için şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz:
    </p>
    <div style="text-align:center;margin:0 0 24px;">
      <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;font-weight:600;font-size:16px;text-decoration:none;border-radius:12px;">
        Şifremi Sıfırla
      </a>
    </div>
    <div style="background-color:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:16px;margin:0 0 16px;">
      <p style="color:#92400e;font-size:14px;margin:0;">
        ⏱ Bu link <strong>1 saat</strong> boyunca geçerlidir. Süre dolduğunda yeni bir istek oluşturmanız gerekecektir.
      </p>
    </div>
    <p style="color:#6b7280;font-size:14px;margin:0 0 8px;">
      Eğer bu talebi siz yapmadıysanız, bu maili görmezden gelebilirsiniz. Hesabınız güvende.
    </p>
    <p style="color:#9ca3af;font-size:12px;margin:0;word-break:break-all;">
      Link çalışmıyorsa bu URL'yi tarayıcınıza yapıştırın:<br/>${resetUrl}
    </p>
  `)

  return sendMail({ to, subject: 'Şifre Sıfırlama - Ustalama', html })
}
