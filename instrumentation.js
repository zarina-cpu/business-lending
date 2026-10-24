export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startTelegramPolling } = await import("./lib/telegram-bot");
    startTelegramPolling();
  }
}
