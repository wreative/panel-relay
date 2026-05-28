export const env = {
  port: Number(process.env.PORT || 3000),
  discordWebhook: process.env.DISCORD_WEBHOOK_URL || "",
};
