import { env } from "../config/env.js";
import { sendDiscordWebhook } from "../services/discord.service.js";

import type { AaPanelPayload } from "../types/aapanel.js";

function extract(
  text: string,
  patterns: RegExp[]
): string {
  for (const regex of patterns) {
    const match = text.match(regex);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return "N/A";
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/\r/g, "")
    .trim();
}

export async function relayAaPanel(
  body: AaPanelPayload
) {
  if (
    !body?.msg_type ||
    !body?.content?.text
  ) {
    return {
      status: 400,
      payload: {
        code: 9499,
        msg: "Bad Request",
      },
    };
  }

  const aaText = cleanText(
    body.content.text
  );

  const server = extract(aaText, [
    /Server:(.*)/i,
    /🖥️\s*Server:(.*)/i,
  ]);

  const ip = extract(aaText, [
    /IP(?:Address)?:(.*)/i,
    /🌐\s*IP:(.*)/i,
  ]);

  const loginMethod = extract(aaText, [
    /Login method:(.*)/i,
  ]);

  const loginAccount = extract(aaText, [
    /Login account:(.*)/i,
  ]);

  const loginIp = extract(aaText, [
    /Login IP:(.*)/i,
  ]);

  const location = extract(aaText, [
    /Location[:：](.*)/i,
  ]);

  const loginStatus = extract(aaText, [
    /Login status:(.*)/i,
  ]);

  const isSuccess =
    loginStatus
      .toLowerCase()
      .includes("success");

  const discordPayload = {
    embeds: [
      {
        title: isSuccess
          ? "✅ aaPanel Login Success"
          : "🚨 aaPanel Login Alert",

        color: isSuccess
          ? 0x57f287
          : 0xed4245,

        timestamp: new Date().toISOString(),

        fields: [
          {
            name: "🖥️ Server",
            value: server,
            inline: true,
          },
          {
            name: "🌐 IP Address",
            value: ip,
            inline: true,
          },
          {
            name: "🔐 Login Method",
            value: loginMethod,
            inline: true,
          },
          {
            name: "👤 Login Account",
            value: loginAccount,
            inline: true,
          },
          {
            name: "📡 Login IP",
            value: loginIp,
            inline: true,
          },
          {
            name: "📍 Location",
            value: location,
            inline: true,
          },
          {
            name: "📋 Status",
            value: loginStatus,
            inline: false,
          },
        ],

        footer: {
          text: "Panel Relay • Security Monitoring",
        },
      },
    ],
  };

  await sendDiscordWebhook(
    env.discordWebhook,
    discordPayload
  );

  return {
    status: 200,
    payload: {
      success: true,
    },
  };
}