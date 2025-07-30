// app/api/send/route.ts
import { Resend } from 'resend';

const resend = new Resend("re_ZqFj6NBw_MFNVvKnZzWEmcKUc5UjFJ2N5"); // Use environment variable

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
  } catch (error: unknown) {
    const message = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';
    return Response.json({ success: false, message }, { status: 500 });
  }
}
