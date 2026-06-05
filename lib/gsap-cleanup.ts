import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Kill GSAP scroll triggers and remove orphaned pin-spacers that inflate page height. */
export function cleanupScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true));
  document.querySelectorAll(".pin-spacer").forEach((el) => el.remove());
  ScrollTrigger.clearScrollMemory();
  ScrollTrigger.refresh(true);
}
