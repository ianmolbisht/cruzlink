// /app/api/send-sms/route.ts (Next 13+ App Router)
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: NextRequest) {
  const { to, message } = await req.json();

  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER!;

  const client = twilio(accountSid, authToken);

  try {
    const twilioResponse = await client.messages.create({
      body: message,
      from: fromPhone,
      to: to,
    });

    return NextResponse.json({ success: true, sid: twilioResponse.sid });
  } catch (error) {
    console.error("Twilio SMS error:", error);
    return NextResponse.json({ success: false, error: "Failed to send SMS" }, { status: 500 });
  }
}
