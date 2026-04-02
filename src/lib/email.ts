import { Resend } from "resend";

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY muss konfiguriert sein");
  }
  return new Resend(apiKey);
}

interface EmailData {
  companyName: string;
  websiteUrl: string;
  branche: string;
  benefitsCount: number;
  stellenCount: number;
  id: string;
}

export async function sendNotificationEmail(data: EmailData) {
  const { companyName, websiteUrl, branche, benefitsCount, stellenCount, id } = data;

  try {
    const resend = getResend();

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Lead Enrichment <onboarding@resend.dev>",
      to: ["artur.b@candidate-flow.de"],
      subject: `Neuer Lead erfasst: ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ededed; padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background: #e8530e; color: white; font-weight: bold; padding: 8px 16px; border-radius: 8px; font-size: 14px;">
              CANDIDATE FLOW&reg;
            </div>
          </div>

          <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 8px; text-align: center;">
            Neuer Lead erfolgreich erfasst
          </h1>

          <p style="color: #888; text-align: center; margin-bottom: 30px;">
            Ein neues Unternehmen wurde &uuml;ber das Lead Enrichment Tool analysiert und gespeichert.
          </p>

          <div style="background: #141414; border: 1px solid #1f1f1f; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 14px;">Firmenname</td>
                <td style="padding: 8px 0; color: #fff; font-size: 14px; font-weight: bold; text-align: right;">${companyName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 14px;">Website</td>
                <td style="padding: 8px 0; text-align: right;">
                  <a href="${websiteUrl}" style="color: #e8530e; text-decoration: none; font-size: 14px;">${websiteUrl}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 14px;">Branche</td>
                <td style="padding: 8px 0; color: #fff; font-size: 14px; text-align: right;">${branche}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 14px;">Benefits gefunden</td>
                <td style="padding: 8px 0; color: #22c55e; font-size: 14px; font-weight: bold; text-align: right;">${benefitsCount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 14px;">Offene Stellen</td>
                <td style="padding: 8px 0; color: #e8530e; font-size: 14px; font-weight: bold; text-align: right;">${stellenCount}</td>
              </tr>
            </table>
          </div>

          <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">
            Lead ID: ${id}<br/>
            Erfasst am: ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}
          </p>
        </div>
      `,
    });

    console.log("Notification email sent successfully");
  } catch (error) {
    console.error("Failed to send notification email:", error);
    // Don't throw - email failure shouldn't break the flow
  }
}
