// joke.js
// Récupère une blague depuis JokeAPI et l'affiche.
// Si JokeAPI échoue, essaie icanhazdadjoke en fallback.

(() => {
  const newJokeBtn = document.getElementById('new-joke');
  const copyBtn = document.getElementById('copy-btn');
  const shareBtn = document.getElementById('share-btn');
  const jokeTextEl = document.getElementById('joke-text');
  const jokeMetaEl = document.getElementById('joke-meta');
  const statusEl = document.getElementById('status');

  // API endpoints
  const JOKEAPI_URL = 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,sexist,political,racist,religious,explicit';
  const ICANHAZ_URL = 'https://icanhazdadjoke.com/';

  let currentJoke = ''; // texte final affiché

  async function fetchJoke() {
    setLoading(true);
    status('Chargement...');
    try {
      const res = await fetch(JOKEAPI_URL);
      if (!res.ok) throw new Error('JokeAPI unreachable');
      const data = await res.json();
      const text = formatJokeApiResponse(data);
      showJoke(text, data.category || data.type || '');
      setLoading(false);
      status('Voici une nouvelle blague 🎉');
      return;
    } catch (err) {
      // fallback to icanhazdadjoke (needs Accept header)
      try {
        const res2 = await fetch(ICANHAZ_URL, { headers: { Accept: 'application/json' } });
        if (!res2.ok) throw new Error('Fallback failed');
        const j = await res2.json();
        showJoke(j.joke || 'Désolé, aucune blague disponible pour l’instant.');
        setLoading(false);
        status('Voici une blague (fallback).');
        return;
      } catch (err2) {
        showJoke('Impossible de récupérer une blague pour le moment. Essaie plus tard.');
        setLoading(false);
        status('Erreur : API indisponible.');
      }
    }
  }

  function formatJokeApiResponse(data) {
    // JokeAPI: can be type 'single' or 'twopart'
    if (!data) return '';
    if (data.type === 'single' && data.joke) return data.joke;
    if (data.type === 'twopart') return `${data.setup}\n\n${data.delivery}`;
    // If it has "joke" field in other formats:
    if (data.joke) return data.joke;
    // last resort:
    return JSON.stringify(data);
  }

  function showJoke(text, meta = '') {
    currentJoke = text;
    // preserve line breaks
    jokeTextEl.textContent = text;
    jokeMetaEl.textContent = meta ? `Catégorie: ${meta}` : '';
    copyBtn.disabled = false;
    shareBtn.disabled = false;
  }

  function setLoading(isLoading) {
    newJokeBtn.disabled = isLoading;
    if (isLoading) newJokeBtn.textContent = '...';
    else newJokeBtn.textContent = 'Nouvelle blague';
  }

  function status(msg) {
    statusEl.textContent = msg;
  }

  async function copyJoke() {
    if (!currentJoke) return;
    try {
      await navigator.clipboard.writeText(currentJoke);
      status('Blague copiée dans le presse-papiers ✅');
    } catch (err) {
      status('Impossible de copier automatiquement. Sélectionne et copie manuellement.');
    }
  }

  async function shareJoke() {
    if (!currentJoke) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Blague', text: currentJoke });
        status('Partagé ✅');
      } catch (err) {
        status('Partage annulé.');
      }
    } else {
      // Fallback : ouvrir Twitter avec le texte
      const tweet = encodeURIComponent(currentJoke);
      const twitter = `https://twitter.com/intent/tweet?text=${tweet}`;
      window.open(twitter, '_blank');
    }
  }

  // Events
  newJokeBtn.addEventListener('click', fetchJoke);
  copyBtn.addEventListener('click', copyJoke);
  shareBtn.addEventListener('click', shareJoke);

  // auto-load one joke on page load
  window.addEventListener('load', () => {
    fetchJoke();
  });

  // Expose for debugging
  window._JokeGen = { fetchJoke, copyJoke, shareJoke };
})();
