// @ts-ignore - no types for beta version of locomotive 5 scroll yet, ignore ts error
import LocomotiveScroll from "locomotive-scroll";
import isMobileDevice from "../scripts/isMobileDevice";
const isDev = import.meta.env.DEV;

let locomotiveScroll: any;

const initSmoothScroll = () => {
  // Skip if scroll is already instantiated
  if (locomotiveScroll) return locomotiveScroll;

  // Do not initialize smooth scroll on mobile devices (scroll is handled natively for better performance)
  if (isMobileDevice()) return null;

  const mainContentContainer = document.querySelector(
    ".main-content",
  ) as HTMLElement;

  locomotiveScroll = new LocomotiveScroll({
    lenisOptions: {
      wrapper: mainContentContainer, // Specify which element is scrollable
    },
    // scrollCallback: onScroll, // Callback function on scroll event
  });

  if (isDev) console.log("Smooth scroll initialized", locomotiveScroll);

  return locomotiveScroll;
};

export default initSmoothScroll;
