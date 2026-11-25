
import { NextResponse } from "next/server";
import { randomBytes, randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const allowedSubjects = [
  "customer-support",
  "restaurant-partnership",
  "general-enquiry",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, subject, message, website } = body;

    // Honeypot: silently accept submissions from bots.
    if (typeof website === "string" && website.trim()) {
      return NextResponse.json(
        { message: "Your enquiry has been submitted." },
        { status: 201 }
      );
    }

    // Validate required fields.
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (cleanName.length < 2 || cleanName.length > 150) {
      return NextResponse.json(
        { error: "Name must be between 2 and 150 characters." },
        { status: 400 }
      );
    }

    if (
      cleanEmail.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!allowedSubjects.includes(cleanSubject)) {
      return NextResponse.json(
        { error: "Please select a valid enquiry subject." },
        { status: 400 }
      );
    }

    if (cleanMessage.length < 5 || cleanMessage.length > 5000) {
      return NextResponse.json(
        { error: "Message must be between 5 and 5000 characters." },
        { status: 400 }
      );
    }

    // Generate a unique enquiry reference.
    const enquiryNumber = `CRV-ENQ-${Date.now()}-${randomBytes(3)
      .toString("hex")
      .toUpperCase()}`;

    const enquiry = await prisma.contactEnquiry.create({
      data: {
        id: randomUUID(),
        enquiryNumber,
        customerName: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
      },
    });

    return NextResponse.json(
      {
        message: "Your enquiry has been submitted successfully.",
        enquiry: {
          enquiry_number: enquiry.enquiryNumber,
          customer_name: enquiry.customerName,
          email: enquiry.email,
          subject: enquiry.subject,
          status: enquiry.status,
          created_at: enquiry.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create contact enquiry:", error);

    return NextResponse.json(
      { error: "Unable to submit your enquiry. Please try again." },
      { status: 500 }
    );
  }
}
