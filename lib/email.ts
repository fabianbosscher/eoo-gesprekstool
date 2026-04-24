import { Resend } from 'resend'

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')
  return new Resend(apiKey)
}

interface SendReportEmailParams {
  to: string
  clientName: string
  reportTitle: string
  reportUrl: string
  password: string
  senderName: string
}

export async function sendReportEmail({
  to,
  clientName,
  reportTitle,
  reportUrl,
  password,
  senderName,
}: SendReportEmailParams) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f7fa;font-family:'Open Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fa;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#03173d;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-family:Montserrat,Arial,sans-serif;font-weight:700;font-size:22px;">
                Easy <span style="color:#208ad0;">Office</span> Online
              </h1>
              <p style="margin:4px 0 0;color:#53d4a7;font-size:13px;">Gespreksverslag</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;color:#03173d;font-size:16px;">Beste ${clientName},</p>
              <p style="margin:0 0 20px;color:#444;font-size:15px;line-height:1.6;">
                Bedankt voor het gesprek! Bijgaand vind je het verslag van onze bespreking.
                Via onderstaande knop kun je het rapport bekijken.
              </p>

              <!-- Report box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7ff;border-left:4px solid #208ad0;border-radius:6px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;color:#208ad0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Gespreksverslag</p>
                    <p style="margin:0 0 16px;color:#03173d;font-size:16px;font-weight:700;">${reportTitle}</p>
                    <p style="margin:0 0 8px;color:#666;font-size:14px;">
                      🔒 <strong>Toegangscode:</strong> <span style="font-family:monospace;background:#fff;padding:2px 8px;border-radius:4px;border:1px solid #ddd;">${password}</span>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#208ad0;border-radius:8px;">
                    <a href="${reportUrl}" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;font-family:Montserrat,Arial,sans-serif;">
                      Bekijk gespreksverslag →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;color:#888;font-size:13px;">Of kopieer deze link:</p>
              <p style="margin:0 0 28px;color:#208ad0;font-size:13px;word-break:break-all;">${reportUrl}</p>

              <hr style="border:none;border-top:1px solid #eee;margin:0 0 24px;">

              <p style="margin:0 0 4px;color:#444;font-size:14px;">Met vriendelijke groet,</p>
              <p style="margin:0;color:#03173d;font-weight:700;font-size:14px;">${senderName}</p>
              <p style="margin:0;color:#888;font-size:13px;">Easy Office Online</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8f9fa;padding:20px 40px;border-top:1px solid #eee;">
              <p style="margin:0;color:#aaa;font-size:12px;text-align:center;">
                Dit rapport is 60 dagen beschikbaar. Easy Office Online · Deventer
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  const result = await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'noreply@easyofficeonline.nl',
    to,
    subject: `Gespreksverslag: ${reportTitle}`,
    html,
  })

  return result
}
