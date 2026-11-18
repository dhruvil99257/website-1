import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const REQUESTS_PER_MINUTE = parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || "5");
const REQUESTS_PER_HOUR = parseInt(process.env.RATE_LIMIT_REQUESTS_PER_HOUR || "20");

interface InquiryData {
  name: string;
  phone: string;
  pickup: string;
  destination: string;
  date: string;
  passengers: string;
  seating: string;
  tripType: string;
  notes?: string;
}

function sanitizeInput(input: unknown): string | null {
  if (typeof input !== "string") return null;
  return input
    .trim()
    .slice(0, 500)
    .replace(/[<>]/g, "");
}

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits);
}

function validateDate(date: string): boolean {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today && !isNaN(d.getTime());
}

function validatePassengers(passengers: string): boolean {
  const n = Number(passengers);
  return Number.isInteger(n) && n >= 1 && n <= 56;
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = await getClientIp();

    // Rate limiting checks
    const minuteLimit = await rateLimit(`ip:${clientIp}:minute`, {
      maxRequests: REQUESTS_PER_MINUTE,
      windowMs: 60000,
    });

    if (!minuteLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((minuteLimit.resetTime - Date.now()) / 1000)) },
        }
      );
    }

    const hourLimit = await rateLimit(`ip:${clientIp}:hour`, {
      maxRequests: REQUESTS_PER_HOUR,
      windowMs: 3600000,
    });

    if (!hourLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in an hour." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((hourLimit.resetTime - Date.now()) / 1000)) },
        }
      );
    }

    const body = await request.json();

    // Validate all required fields
    const name = sanitizeInput(body.name);
    const phone = sanitizeInput(body.phone);
    const pickup = sanitizeInput(body.pickup);
    const destination = sanitizeInput(body.destination);
    const date = sanitizeInput(body.date);
    const passengers = sanitizeInput(body.passengers);
    const seating = sanitizeInput(body.seating);
    const tripType = sanitizeInput(body.tripType);
    const notes = sanitizeInput(body.notes);

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!phone || !validatePhone(phone)) return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    if (!pickup) return NextResponse.json({ error: "Pickup is required" }, { status: 400 });
    if (!destination) return NextResponse.json({ error: "Destination is required" }, { status: 400 });
    if (!date || !validateDate(date)) return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    if (!passengers || !validatePassengers(passengers)) return NextResponse.json({ error: "Invalid passengers" }, { status: 400 });
    if (!tripType) return NextResponse.json({ error: "Trip type is required" }, { status: 400 });

    const data: InquiryData = {
      name,
      phone,
      pickup,
      destination,
      date,
      passengers,
      seating: seating || "not specified",
      tripType,
      notes: notes || "",
    };

    // TODO: Send notification email to admin
    // TODO: Log inquiry to database
    // For now, just return success
    console.log("[INQUIRY]", { ip: clientIp, data, timestamp: new Date().toISOString() });

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry submitted successfully",
        data: {
          name: data.name,
          phone: data.phone.slice(-4).padStart(10, "*"),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API_ERROR]", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
