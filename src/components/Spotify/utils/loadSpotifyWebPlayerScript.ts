const loadSpotifyScript = (callback?: () => void) => {
  const existingScript = document.getElementById('spotify');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.id = 'spotify';
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
  }
  if (existingScript && callback) callback();
};

export default loadSpotifyScript;

