This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment Variables

### Contact Form Setup (Gmail)

The contact form requires SMTP configuration. If you're using Gmail, you need to set up an App Password.

#### Steps to Create Gmail App Password:

1. **Enable 2-Step Verification**

   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification
   - Follow the prompts to enable it

2. **Generate App Password**

   - Go to Security → App passwords (or visit: https://myaccount.google.com/apppasswords)
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter a name (e.g., "Shopify Drop Contact Form")
   - Click "Generate"
   - Copy the 16-character password (spaces will be removed automatically)

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in the following variables:
     ```env
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_SECURE=false
     SMTP_USER=your-email@gmail.com
     SMTP_PASSWORD=your-16-character-app-password
     CONTACT_EMAIL=your-contact@example.com
     ```

**Important Notes:**

- Use the **App Password**, not your regular Gmail password
- The App Password is a 16-character code (without spaces)
- Keep your `.env.local` file secure and never commit it to version control

#### Alternative SMTP Providers

You can also use other SMTP providers (SendGrid, Mailgun, etc.) by adjusting the `SMTP_HOST`, `SMTP_PORT`, and `SMTP_SECURE` values accordingly.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
