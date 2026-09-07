// chat.js
// Widget chat minimal:
// - If /api/chat is available, sends user messages there (POST {message, history})
// - Otherwise uses a local rule-based responder
// - Customize FAQ and quick replies below

(() => {
  const chatRoot = document.getElementById('chat-root');
  const openBtn = document.getElementById('open-chat');
  const closeBtn = document.getElementById('close-chat');
  const chatBody = document.getElementById('chat-body');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');

  const PHONE = '+237656864505'; // change if needed
  const API_ENDPOINT = '/api/chat'; // server endpoint (optional)

  // Simple FAQ/responses (edit these)
  const FAQ = [
    {q: /prix|tarif|combien/i, a: "Le tarif standard est 250$ — livraison en 24h. Tu veux réserver ?"},
    {q: /whatsapp|contact|téléphone/i, a: `Contact direct via WhatsApp : ${PHONE} (clique sur le bouton WhatsApp).`},
    {q: /héberge|hébergement|domaine/i, a: "L'hébergement et le domaine ne sont pas inclus. Je fournis les fichiers prêts à déployer sur GitHub Pages ou Netlify."},
    {q: /exemple|portfolio|clients/i, a: "J'ai déjà aidé TAMLA, Nissa, Master Barbershop. Je peux faire des pages personnalisées pour chacun."},
    {q: /livraison|24h/i, a: "Oui, livraison garantie en 24 heures après validation du contenu."},
  ];

  // utility to append message
  function appendMessage(text, who = 'bot') {
    const wrapper = document.createElement('div');
    wrapper.className = `chat-message ${who}`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    wrapper.appendChild(bubble);
    chatBody.appendChild(wrapper);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // local responder
  function localRespond(message) {
    for (const item of FAQ) {
      if (item.q.test(message)) return item.a;
    }
    // default fallback with CTA to WhatsApp
    return `Désolé, je n'ai pas bien compris. Veux-tu discuter sur WhatsApp ? ${PHONE}`;
  }

  // try call server API
  async function callServer(message, history = []) {
    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message, history})
      });
      if (!res.ok) throw new Error('no-server');
      const data = await res.json();
      return data.reply || null;
    } catch (err) {
      return null;
    }
  }

  // handle submit
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    chatInput.value = '';
    appendMessage('...', 'bot'); // temporary typing indicator
    // collect history if needed (simple)
    const history = []; // can be extended to store messages
    const serverReply = await callServer(text, history);
    // remove typing indicator (last bot message '...')
    const bots = chatBody.querySelectorAll('.chat-message.bot');
    if (bots.length) {
      const lastBot = bots[bots.length - 1];
      if (lastBot && lastBot.textContent.trim() === '...') lastBot.remove();
    }
    if (serverReply) {
      appendMessage(serverReply, 'bot');
    } else {
      const local = localRespond(text);
      appendMessage(local, 'bot');
    }
  });

  // open/close handlers
  openBtn && openBtn.addEventListener('click', () => {
    chatRoot.classList.remove('hidden');
    chatInput.focus();
  });
  closeBtn && closeBtn.addEventListener('click', () => {
    chatRoot.classList.add('hidden');
  });

  // initial greeting
  function greet() {
    appendMessage("Salut 👋 Je suis le robot de Sites Pro. Pose-moi une question (prix, délai, contact).", 'bot');
  }

  // auto-open small toast once
  setTimeout(() => {
    greet();
  }, 600);

  // expose for testing
  window._SitesProChat = {appendMessage, localRespond};
})();
