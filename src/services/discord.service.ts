export async function sendDiscordWebhook(
  webhook: string,
  payload: unknown
) {
  const response = await fetch(webhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      await response.text()
    );
  }
}
