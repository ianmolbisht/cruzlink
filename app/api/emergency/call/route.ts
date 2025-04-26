import { NextResponse } from "next/server"
import twilio from "twilio"

// Initialize Twilio client with environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

export async function POST(request: Request) {
  try {
    // Validate environment variables
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      return NextResponse.json({ error: "Twilio credentials not configured" }, { status: 500 })
    }

    // Parse request body
    const body = await request.json()
    const { to, message } = body

    // Validate request parameters
    if (!to) {
      return NextResponse.json({ error: "Missing required parameter: to" }, { status: 400 })
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken)

    // Create TwiML for the call
    const twiml = `
      <Response>
        <Say voice="alice" language="en-US">
          ${message || "Emergency alert from CruzLink helmet. The user may need assistance."}
        </Say>
        <Pause length="1"/>
        <Say voice="alice" language="en-US">
          This is an automated emergency call from a smart helmet system.
        </Say>
      </Response>
    `

    // Make the call
    const call = await client.calls.create({
      twiml: twiml,
      to: to,
      from: twilioPhoneNumber,
    })

    return NextResponse.json({ success: true, callSid: call.sid })
  } catch (error) {
    console.error("Error making emergency call:", error)
    return NextResponse.json({ error: "Failed to place emergency call" }, { status: 500 })
  }
}
