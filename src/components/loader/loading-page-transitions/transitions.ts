const loadingScreen = document.querySelector(".loading-screen");
const loadingScreenSpinner = document.querySelector(".loading-screen-spinner");

export const fadeIn = () => {
  // console.log("fadeIn", window.location.pathname);

  loadingScreen?.classList.remove("opacity-100");
  loadingScreen?.classList.add("opacity-0");
};

export const fadeOut = () => {
  // console.log("fadeOut", window.location.pathname);

  loadingScreen?.classList.remove("opacity-0");
  loadingScreen?.classList.add("opacity-100");

  loadingScreenSpinner?.classList.add("hidden");
};
