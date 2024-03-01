// public/js/youtubePage.js

let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtubePlayer', {
    height: '360',
    width: '640',
    videoId: 'dQw4w9WgXcQ', // Replace with your actual YouTube video ID
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  // You can add additional functionality when the player is ready
}

function onPlayerStateChange(event) {
  // You can handle player state changes (playing, paused, etc.)
}
