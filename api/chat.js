export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Metodo non consentito." });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Chiave API non configurata sul server." });
    return;
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Nessun messaggio ricevuto." });
    return;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1024,
        system:
          "Sei l'assistente virtuale di aidoAcademy, la piattaforma di formazione di AIDO (Associazione Italiana Donatori Organi, Tessuti e Cellule). Rispondi sempre in italiano, in modo cordiale e chiaro, aiutando volontari e dirigenti a orientarsi tra i corsi disponibili (governance associativa, RUNTS, privacy/GDPR, comunicazione, leadership, fundraising, progettazione, donazione di organi, stili di vita). Se ti viene chiesto qualcosa che esula dalla piattaforma o dai temi AIDO, rispondi comunque con cortesia ma invita l'utente a contattare la segreteria AIDO per informazioni specifiche non disponibili qui.",
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data?.error?.message || "Errore dal servizio AI." });
      return;
    }

    const textBlock = Array.isArray(data.content) ? data.content.find((c) => c.type === "text") : null;
    const reply = textBlock?.text || "";    res.status(200).json({ reply });
  } catch {
    res.status(502).json({ error: "Errore di comunicazione con il servizio AI." });
  }
}
