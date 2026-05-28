import { relayAaPanel } from "../src/core/relay.js";

export default async function handler(
  req: any,
  res: any
) {
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