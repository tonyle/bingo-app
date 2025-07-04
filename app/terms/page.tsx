"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

// Header ẩn nếu có ?p=mobile
function HeaderClient() {
  "use client";
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();
  const isMobile = searchParams.get("p") === "mobile";

  if (isMobile) return null;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-black/50 border-b border-white/10">
      <div className="container flex h-16 items-center space-x-4">
        <Link href="/" className="flex gap-2 items-center text-xl font-bold">
          <div className="relative">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold">
              B
            </div>
          </div>
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Bingo Lotto
          </span>
        </Link>
        <div className="flex-1" />
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-purple-500/50 text-white hover:bg-purple-500/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </header>
  );
}

// Nút quay về cuối trang (ẩn nếu có ?p=mobile)
function BackButton() {
  "use client";
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();
  const isMobile = searchParams.get("p") === "mobile";

  if (isMobile) return null;

  return (
    <div className="text-center mt-12">
      <Link href="/">
        <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25">
          <ArrowLeft className="h-4 w-4" />
          Back to Bingo Lotto
        </Button>
      </Link>
    </div>
  );
}

export default function TermsOfServicePage() {
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchTerms = async () => {
      const ref = doc(db, "pages", "loto");
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().terms) {
        console.log("Terms fetched:", snap.data().terms);
        setContent(snap.data().terms);
      } else {
        setContent("Terms & Conditions not found for this app.");
      }
    };

    fetchTerms();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Header */}
      <Suspense fallback={null}>
        <HeaderClient />
      </Suspense>

      <main className="flex-1 relative z-10">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 animate-fadeIn">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    <FileText className="h-8 w-8" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter md:text-5xl bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Terms of Service
                </h1>
                <p className="text-gray-400 mt-4">
                  Last updated:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div
                className="space-y-8"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {/* Back Button */}
              <Suspense fallback={null}>
                <BackButton />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
