import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Map rechtsgebiet slugs back to display names
const RECHTSGEBIET_MAP: Record<string, string> = {
  "liegenschaftsrecht": "Liegenschaftsrecht",
  "vergaberecht": "Vergaberecht",
  "schadenersatzrecht": "Schadenersatzrecht",
  "ehe--und-scheidungsrecht": "Ehe- und Scheidungsrecht",
  "erbrecht": "Erbrecht",
  "erwachsenenschutz": "Erwachsenenschutz",
  "unternehmensgründung": "Unternehmensgründung",
  "inkassowesen": "Inkassowesen",
  "rechtsgutachten": "Rechtsgutachten",
  "sonstiges": "Sonstiges",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(200).end();
  }

  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, subject, message, rechtsgebiet } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, E-Mail und Nachricht sind erforderlich." });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Ungültige E-Mail-Adresse." });
  }

  // SMTP Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const kanzleiEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER || "info@girardi-auer.com";
  const rechtsgebietDisplay = RECHTSGEBIET_MAP[rechtsgebiet] || rechtsgebiet || "\u2013";
  const now = new Date().toLocaleString("de-AT", { timeZone: "Europe/Vienna" });

  // ── Email 1: Notification to the law firm ──
  const mailToKanzlei = {
    from: `"Kanzlei Girardi & Auer - Website" <${process.env.SMTP_USER}>`,
    to: kanzleiEmail,
    replyTo: email,
    subject: `Neue Kontaktanfrage: ${subject || rechtsgebietDisplay} \u2013 ${name}`,
    html: `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:650px;margin:0 auto;color:#333">
        <div style="background:#1a365d;padding:24px 32px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;font-size:20px;margin:0;font-weight:500">Neue Kontaktanfrage</h1>
          <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:6px 0 0">Eingegangen am ${now} \u00fcber girardi-auer.com</p>
        </div>

        <div style="border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
          <table style="border-collapse:collapse;width:100%">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-weight:600;width:140px;vertical-align:top;color:#475569">Name</td>
              <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;color:#1e293b">${name}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-weight:600;vertical-align:top;color:#475569">E-Mail</td>
              <td style="padding:12px 0;border-bottom:1px solid #f1f5f9"><a href="mailto:${email}" style="color:#1a365d">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-weight:600;vertical-align:top;color:#475569">Telefon</td>
              <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;color:#1e293b">${phone || "\u2013"}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-weight:600;vertical-align:top;color:#475569">Rechtsgebiet</td>
              <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;color:#1e293b">${rechtsgebietDisplay}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-weight:600;vertical-align:top;color:#475569">Betreff</td>
              <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;color:#1e293b">${subject || "\u2013"}</td>
            </tr>
          </table>

          <div style="margin-top:24px">
            <p style="font-weight:600;color:#475569;margin:0 0 8px;font-size:14px">Nachricht:</p>
            <div style="background:#f8fafc;border-left:3px solid #1a365d;padding:16px 20px;white-space:pre-wrap;line-height:1.7;color:#334155;font-size:14px;border-radius:0 4px 4px 0">${message}</div>
          </div>

          <div style="margin-top:24px;padding:16px;background:#eff6ff;border-radius:8px;font-size:13px;color:#1e40af">
            <strong>Tipp:</strong> Sie k\u00f6nnen direkt auf diese E-Mail antworten \u2013 die Antwort geht an ${email}.
          </div>
        </div>

        <p style="color:#94a3b8;font-size:11px;text-align:center;margin-top:16px">
          Automatisch generiert vom Kontaktformular auf girardi-auer.com
        </p>
      </div>
    `,
  };

  // ── Email 2: Confirmation to the sender ──
  const firstName = name.split(" ")[0];
  const mailToSender = {
    from: `"Rechtsanwaltskanzlei Girardi & Auer" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Ihre Anfrage bei Girardi & Auer \u2013 Best\u00e4tigung",
    html: `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
        <div style="background:#1a365d;padding:32px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;font-size:22px;margin:0;font-weight:400;letter-spacing:0.5px">Girardi & Auer</h1>
          <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:4px 0 0;text-transform:uppercase;letter-spacing:2px">Rechtsanw\u00e4lte</p>
        </div>

        <div style="border:1px solid #e2e8f0;border-top:none;padding:40px 32px;border-radius:0 0 8px 8px">
          <h2 style="font-size:24px;color:#1e293b;margin:0 0 16px;font-weight:400">
            Sehr geehrte/r ${firstName},
          </h2>

          <p style="line-height:1.8;color:#475569;font-size:15px;margin-bottom:20px">
            vielen Dank f\u00fcr Ihre Anfrage. Wir haben Ihre Nachricht erhalten und werden uns
            <strong>schnellstm\u00f6glich</strong>, in der Regel innerhalb von <strong>24 Stunden</strong>,
            bei Ihnen melden.
          </p>

          <div style="background:#f8fafc;border-radius:8px;padding:20px;margin:24px 0;border:1px solid #e2e8f0">
            <p style="margin:0 0 4px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:600">Zusammenfassung Ihrer Anfrage</p>
            <table style="border-collapse:collapse;width:100%;margin-top:12px">
              ${rechtsgebiet ? `<tr><td style="padding:6px 0;font-size:14px;color:#64748b;width:120px">Rechtsgebiet</td><td style="padding:6px 0;font-size:14px;color:#1e293b">${rechtsgebietDisplay}</td></tr>` : ""}
              ${subject ? `<tr><td style="padding:6px 0;font-size:14px;color:#64748b">Betreff</td><td style="padding:6px 0;font-size:14px;color:#1e293b">${subject}</td></tr>` : ""}
              <tr><td style="padding:6px 0;font-size:14px;color:#64748b;vertical-align:top">Nachricht</td><td style="padding:6px 0;font-size:14px;color:#1e293b">${message.length > 200 ? message.substring(0, 200) + "..." : message}</td></tr>
            </table>
          </div>

          <p style="line-height:1.8;color:#475569;font-size:15px;margin-top:24px">
            Sollten Sie in der Zwischenzeit Fragen haben, erreichen Sie uns jederzeit:
          </p>

          <div style="margin:20px 0;padding:16px 20px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">
            <p style="margin:0;font-size:14px;line-height:2;color:#334155">
              <strong>Telefon:</strong> +43 512 574095<br/>
              <strong>E-Mail:</strong> info@girardi-auer.com<br/>
              <strong>Adresse:</strong> Stainerstra\u00dfe 2, 6020 Innsbruck
            </p>
          </div>

          <p style="line-height:1.8;color:#475569;font-size:15px;margin-top:24px">
            Mit freundlichen Gr\u00fc\u00dfen,<br/>
            <strong style="color:#1e293b">Ihr Team von Girardi & Auer</strong>
          </p>
        </div>

        <div style="text-align:center;padding:20px;color:#94a3b8;font-size:12px;line-height:1.6">
          <p style="margin:0">Rechtsanwaltskanzlei Girardi & Auer</p>
          <p style="margin:2px 0">Stainerstra\u00dfe 2 | 6020 Innsbruck | \u00d6sterreich</p>
          <p style="margin:2px 0">Tel: +43 512 574095 | info@girardi-auer.com</p>
          <p style="margin:8px 0 0;font-size:11px;color:#cbd5e1">
            Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese E-Mail.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await Promise.all([
      transporter.sendMail(mailToKanzlei),
      transporter.sendMail(mailToSender),
    ]);

    return res.status(200).json({ success: true, message: "E-Mails erfolgreich gesendet" });
  } catch (error: any) {
    console.error("SMTP Error:", error);
    return res.status(500).json({
      error: "Fehler beim Senden der E-Mail. Bitte versuchen Sie es sp\u00e4ter erneut oder kontaktieren Sie uns telefonisch.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
