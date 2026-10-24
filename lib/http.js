export async function readResponseJson(response) {
  const text = await response.text();
  if (!text) {
    throw new Error("Сервер не ответил. Обновите страницу и попробуйте ещё раз.");
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Сервер вернул ошибку. Попробуйте ещё раз через минуту.");
  }
}
