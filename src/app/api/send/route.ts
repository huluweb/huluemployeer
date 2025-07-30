// app/api/send/route.ts
import { Resend } from 'resend';

const resend = new Resend("re_ZqFj6NBw_MFNVvKnZzWEmcKUc5UjFJ2N5"); // Use .env file

export async function POST(req: Request) {
  const body = await req.json();
  const { to, subject, text } = body;

  try {
    const result = await resend.emails.send({
      from: 'HULU GENERAL <onboarding@resend.dev>',
      to,
      subject,
      text,
    });

    return Response.json({ success: true, result });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
