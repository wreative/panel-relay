import { relayAaPanel } from "../src/core/relay.js";
import { WHITELISTED_IPS } from "../src/config/whitelist.js";

export default async function handler(
  req: any,
  res: any
) {
  // Get client IP (works for most Node.js frameworks, adjust if needed)
  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip;

  if (WHITELISTED_IPS.length > 0 && !WHITELISTED_IPS.includes(clientIp)) {
    return res.status(403).json({
      code: 403,
      msg: "Forbidden: IP not allowed",
    });
  }
  if (req.method !== "POST") {
    return res.status(405).json({
      code: 405,
      msg: "Method Not Allowed",
    });
  }

  try {
    const result = await relayAaPanel(
      req.body
    );

    return res
      .status(result.status)
      .json(result.payload);
  } catch (error: any) {
    return res.status(500).json({
      code: 500,
      msg:
        error.message ||
        "Internal Server Error",
    });
  }
}