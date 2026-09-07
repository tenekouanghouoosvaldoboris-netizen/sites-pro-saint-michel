// server.js (optionnel) - Node/Express proxy to OpenAI
// Use this if you want AI responses (requires OPENAI_API_KEY in .env).
// Do NOT put your API key in client-side code.

require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // or native fetch in Node 18+
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/chat', async (req, res) => {
  const {message, history} = req.body || {};
  if (!OPENAI_API_KEY) return res.status(500).json({error: 'OPENAI_API_KEY not set on server.'});
  if (!message) return res.status(400).json({error: 'No message provided.'});

  try {
    // Minimal ChatCompletion request to OpenAI
    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        {role: 'system', content: 'Tu es un assistant pour un créateur de sites locaux nommé "Sites Pro Saint-Michel". Répond court, propose le bouton WhatsApp, et propose d\'envoyer le message au +237656864505.'},
        ...(history || []),
        {role: 'user', content: message}
      ],
      max_tokens: 300,
      temperature: 0.7
    };

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return res.status(500).json({error: 'OpenAI error', detail: txt});
    }
    const data = await resp.json();
    const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    res.json({reply});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
