import type { NextConfig } from "next";

// Pragmatic CSP: the docs viewer needs inline styles (framer-motion, theme
// tokens) and next-themes injects a small inline no-flash script, so scripts
// and styles allow 'unsafe-inline'. 'unsafe-eval' is granted to development
// only: React dev mode requires eval() for debugging features
// (react-server-dom-turbopack checkEvalAvailabilityOnceDev), while the
// production bundle never calls eval(). The deployed policy stays strict.
const isDevelopment = process.env.NODE_ENV !== "production";
const scriptSrc = isDevelopment ? "'self' 'unsafe-inline' 'unsafe-eval'" : "'self' 'unsafe-inline'";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "form-action 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // HSTS is intentionally omitted: the provided Caddyfile serves plain HTTP
  // on :81. Add Strict-Transport-Security once TLS is terminated in front.
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
