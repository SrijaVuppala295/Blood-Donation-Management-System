import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb" // ✅ use getDb (Sahithi DB)

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    const db = await getDb() // ✅ this connects to Sahithi DB
    const contactsCollection = db.collection("contacts")

    const contactDoc = {
      name,
      email,
      message,
      createdAt: new Date(),
    }

    await contactsCollection.insertOne(contactDoc)

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    )
  }
}
