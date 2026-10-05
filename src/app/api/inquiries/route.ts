import { createInquiryHandler } from "@/server/inquiries.mjs";

export const runtime = "nodejs";
const handle = createInquiryHandler();
function environment() {
  return {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    INQUIRY_MAIL_ENABLED: process.env.INQUIRY_MAIL_ENABLED,
    INQUIRY_MAIL_FROM: process.env.INQUIRY_MAIL_FROM,
    INQUIRY_ALLOWED_ORIGINS: process.env.INQUIRY_ALLOWED_ORIGINS,
  };
}
export function GET(request: Request) { return handle(request, environment()); }
export function POST(request: Request) {
  // Forwarded IPs are trustworthy only when the deployment proxy overwrites them.
  // Default to one bounded bucket until trusted proxy handling is configured.
  return handle(request, environment(), "public");
}
