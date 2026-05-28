import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Only allow POST
    if (req.method !== "POST") {
      return res.status(405).json({
        code: 405,
        msg: "Method Not Allowed",
      });
    }

    const data = req.body;

    // Payload validation
    if (
      !data?.msg_type ||
      !data?.content?.text
    ) {
      return res.status(400).json({
        code: 9499,
        msg: "Bad Request",
        data: {},
      });
    }

    const aaText: string = data.content.text;
    const title = "[aaPanel Alert]";

    // helper regex parser
    const extract = (regex: RegExp): string => {
      const match = aaText.match(regex);
      return match?.[1]?.trim() || "N/A";
    };

    const server = extract(/Server:(.*?)\n/);
    const ipAddress = extract(/IPAddress:(.*?)\n/);
    const sendingTime = extract(/SendingTime:(.*?)\n/);
    const loginMethod = extract(/Login method:(.*?)\n/);
    const loginAccount = extract(/Login account:(.*?)\n/);
    const loginIP = extract(/Login IP:(.*?)\n/);
    const location = extract(/Location[:：](.*?)\n/);
    const loginStatus = extract(/Login status:(.*?)\n/);

    // get webhook from environment
    const discordWebhook = process.env.DISCORD_WEBHOOK_URL;

    if (!discordWebhook) {
      return res.status(500).json({
        code: 500,
        msg: "Discord webhook not configured",
      });
    }

    const discordPayload = {
      embeds: [
        {
          title,
          description: aaText,
          timestamp: new Date().toISOString(),
          color: 0xf04747,
          fields: [
            {
              name: "Server",
              value: server,
              inline: true,
            },
            {
              name: "IP Address",
              value: ipAddress,
              inline: true,
            },
            {
              name: "Sending Time",
              value: sendingTime,
              inline: true,
            },
            {
              name: "Login Method",
              value: loginMethod,
              inline: true,
            },
            {
              name: "Login Account",
              value: loginAccount,
              inline: true,
            },
            {
              name: "Login IP",
              value: loginIP,
              inline: true,
            },
            {
              name: "Location",
              value: location,
              inline: true,
            },
            {
              name: "Login Status",
              value: loginStatus,
              inline: true,
            },
          ],
        },
      ],
    };

    // send to Discord
    const discordResponse = await fetch(discordWebhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordPayload),
    });

    if (!discordResponse.ok) {
      const text = await discordResponse.text();

      return res.status(500).json({
        StatusCode: 0,
        StatusMessage: "relay to Discord failed",
        code: 1,
        data: {},
        msg: text,
      });
    }

    return res.status(200).json({
      StatusCode: 0,
      StatusMessage: "relay to Discord success",
      code: 0,
      data: {},
      msg: "success",
    });
  } catch (error: any) {
    return res.status(500).json({
      code: 500,
      msg: error.message || "Internal Server Error",
    });
  }
}
