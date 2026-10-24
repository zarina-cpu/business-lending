export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && !process.env.VERCEL) {
    const { startTelegramPolling } = await import("./lib/telegram-bot");
    startTelegramPolling();
  }
}
