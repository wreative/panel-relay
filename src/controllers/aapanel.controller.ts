import { env } from "../config/env.js";
import { extract } from "../utils/extract.js";
import { sendDiscordWebhook } from "../services/discord.service.js";
import { AaPanelPayload } from "../types/aapanel.js";

export async function handleAaPanel(
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

  const aaText = body.content.text;

  const discordPayload = {
    embeds: [
      {
        title: "[aaPanel Alert]",
        description: aaText,
        timestamp: new Date().toISOString(),
        color: 0xf04747,
        fields: [
          {
            name: "Server",
            value: extract(
              aaText,
              /Server:(.*?)\n/
            ),
            inline: true,
          },
          {
            name: "IP Address",
            value: extract(
              aaText,
              /IPAddress:(.*?)\n/
            ),
            inline: true,
          },
          {
            name: "Login Status",
            value: extract(
              aaText,
              /Login status:(.*?)\n/
            ),
            inline: true,
          },
        ],
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
