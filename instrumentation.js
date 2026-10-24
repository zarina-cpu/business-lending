export async function register() {
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.VERCEL || process.env.CI) return;
  const { startTelegramPolling } = await import("./lib/telegram-bot");
  startTelegramPolling();
}
