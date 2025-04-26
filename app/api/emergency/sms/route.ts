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
    const { contacts, message } = body

    // Validate request parameters
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json({ error: "Missing required parameter: contacts (array)" }, { status: 400 })
    }

    if (!message) {
      return NextResponse.json({ error: "Missing required parameter: message" }, { status: 400 })
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken)

    // Send SMS to each contact
    const results = await Promise.all(
      contacts.map(async (contact) => {
        try {
          const sms = await client.messages.create({
            body: message,
            to: contact,
            from: twilioPhoneNumber,
          })
          return { contact, success: true, messageSid: sms.sid }
        } catch (error) {
          console.error(`Error sending SMS to ${contact}:`, error)
          return { contact, success: false, error: (error as Error).message }
        }
      }),
    )

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Error sending emergency SMS:", error)
    return NextResponse.json({ error: "Failed to send emergency SMS" }, { status: 500 })
  }
}
