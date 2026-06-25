import React from "react";
import { SEO_CONFIG } from "@/data/seo-config";

export default function GoogleSearchConsole() {
  const verificationCode = SEO_CONFIG.googleSiteVerification;

  if (!verificationCode || verificationCode === "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE") {
    return null;
  }

  return (
    <meta name="google-site-verification" content={verificationCode} />
  );
}
