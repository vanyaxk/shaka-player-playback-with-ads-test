import shaka from "shaka-player/dist/shaka-player.ui.js";

const exampleManifestUri =
  "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd";

function initApp() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (!shaka.Player.isBrowserSupported()) {
    // This browser does not have the minimum set of APIs we need.
    console.error("Browser not supported!");
    return;
  }
}

// this function initializes the player and adds the event listeners
async function initPlayer() {
  const video = document.getElementById("video");
  const container = document.getElementById("container");
  const player = new shaka.Player(video);

  /* we will need this in other functions 
  so we assign it to the window object */
  window.player = player;

  const ui = new shaka.ui.Overlay(player, container, video);
  const controls = ui.getControls();
  controls.addEventListener("error", console.error);

  player.addEventListener("error", console.error);

  /* Initiates the client-side ad manager
   and attaches it to the player */
  const adManager = player.getAdManager();
  const adContainer = video.ui.getControls().getClientSideAdContainer();
  adManager.initClientSide(adContainer, video);
  runSampleAd();
  try {
    await player.load(exampleManifestUri);
  } catch (error) {
    console.error(error);
  }
}

function runSampleAd() {
  // the script we added to index.html adds the google object to the window
  const google = window.google;
  const adUrl =
    "https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=";
  console.log(google.ima);
  const adsRequest = new google.ima.AdsRequest();
  adsRequest.adTagUrl = adUrl;

  const adManager = player.getAdManager();
  adManager.requestClientSideAds(adsRequest);
}

document.addEventListener("DOMContentLoaded", initApp);
document.addEventListener("shaka-ui-loaded", initPlayer);
