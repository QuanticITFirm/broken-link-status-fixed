export default async function handler(req, res) {
  const { link } = req.query;

  if (!link) {
    return res.status(400).json({ error: "Missing link parameter" });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch(link, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    return res.status(200).json({
      url: link,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
    });
  } catch (error) {
    return res.status(200).json({
      url: link,
      ok: false,
      status: "error",
      statusText: error.name === "AbortError" ? "Timeout" : "Fetch Failed",
    });
  }
}