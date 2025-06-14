import { type NextRequest, NextResponse } from "next/server";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTEnA5Hnqj95sHDWHFOpOsS6AeIKcTBNI",
  authDomain: "bingo-418ef.firebaseapp.com",
  projectId: "bingo-418ef",
  storageBucket: "bingo-418ef.firebasestorage.app",
  messagingSenderId: "274888802605",
  appId: "1:274888802605:web:8eda22b4ace869315c93a4",
  measurementId: "G-F3SZCCK8BP",
};

// Initialize Firebase Admin (server-side)
async function initializeFirebase() {
  try {
    const { initializeApp, getApps } = await import("firebase/app");
    const { getFirestore, collection, addDoc } = await import(
      "firebase/firestore"
    );

    // Initialize Firebase if not already initialized
    const app =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);

    return { db, collection, addDoc };
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw new Error("Failed to initialize Firebase");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, timestamp } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Initialize Firebase and save to Firestore
    const { db, collection, addDoc } = await initializeFirebase();

    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      timestamp: timestamp || new Date().toISOString(),
      status: "new",
      userAgent: request.headers.get("user-agent") || "",
      ip:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
    };

    // Add document to Firestore
    const docRef = await addDoc(
      collection(db, "contact-submissions"),
      contactData
    );

    console.log("Contact form submitted:", { id: docRef.id, email, subject });

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
        id: docRef.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);

    return NextResponse.json(
      {
        error: "Internal server error. Please try again later.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
