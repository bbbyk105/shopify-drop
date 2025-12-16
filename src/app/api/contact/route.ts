import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z.string().email("Please enter a valid email address").trim(),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must be less than 200 characters")
    .trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters")
    .trim(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Zodバリデーション
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(
        (issue) => issue.message
      );
      return NextResponse.json(
        { error: errors[0] || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      return NextResponse.json(
        {
          error:
            "Email service is not configured. Please contact the administrator.",
        },
        { status: 500 }
      );
    }

    // Nodemailerの設定
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // メール送信先（環境変数から取得、なければデフォルト）
    const toEmail = process.env.CONTACT_EMAIL || "your-email@example.com";

    // 管理者への通知メール
    const adminMailOptions = {
      from: process.env.SMTP_USER || "noreply@example.com",
      to: toEmail,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email,
    };

    // 送信者への自動返信メール
    const autoReplyMailOptions = {
      from: process.env.SMTP_USER || "noreply@example.com",
      to: email,
      subject: `Thank you for contacting us - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">
            Thank You for Your Message
          </h2>
          <p>Dear ${name},</p>
          <p>Thank you for contacting us. We have received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #333;">
            <p style="margin: 0;"><strong>Your Message:</strong></p>
            <p style="margin: 5px 0 0 0; white-space: pre-wrap;">${message.replace(
              /\n/g,
              "<br>"
            )}</p>
          </div>
          
          <p>We typically respond within 24-48 hours. If your inquiry is urgent, please feel free to reach out to us directly.</p>
          
          <p>Best regards,<br>
          Customer Service Team</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    // メール送信（管理者への通知と自動返信を並行して送信）
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(autoReplyMailOptions),
    ]);

    return NextResponse.json(
      { message: "Thank you for your message. We'll get back to you soon." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);

    // より詳細なエラーメッセージ
    let errorMessage = "Failed to send email. Please try again later.";
    if (error instanceof Error) {
      if (error.message.includes("Invalid login")) {
        errorMessage =
          "Email authentication failed. Please check SMTP credentials.";
      } else if (
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("ETIMEDOUT")
      ) {
        errorMessage =
          "Could not connect to email server. Please check SMTP settings.";
      } else {
        errorMessage = `Email error: ${error.message}`;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
