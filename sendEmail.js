import { Resend } from "resend";
import type { NextApiRequest, NextApiResponse } from "next";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { firstName, lastName, email, message, requestPitch } = req.body;

  try {
    // Email to you
    await resend.emails.send({
      from: "noreply@dnaseals.com",
      to: ["dnaseals@emailn.de"],
      subject: `New Contact from ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>Business Model Pitch Requested:</strong> ${requestPitch ? "Yes" : "No"}</p>
      `,
    });

    // Confirmation email to user
    await resend.emails.send({
      from: "noreply@dnaseals.com",
      to: [email],
      subject: "Thank you for contacting DNA Seals",
      html: `
        <h2>Thank you for your interest in DNA Seals!</h2>
        <p>Dear ${firstName},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        ${requestPitch ? "<p>We will also send you our detailed business model pitch shortly.</p>" : ""}
        <p>Best regards,<br>The DNA Seals Team</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return res.status(500).json({ error: "Email failed to send" });
  }
}
