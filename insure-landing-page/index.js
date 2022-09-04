const hamburger = document.querySelector(".hamburger");
const hamburgerOpen = document.querySelector(".hamburger-open");
const hamburgerClose = document.querySelector(".hamburger-close");
const nav = document.querySelector(".header-nav");
const ATTRIBUTES = {
  visible: "data-visible",
};

hamburger.addEventListener("click", function () {
  const isNavVisible = hamburger.getAttribute("aria-expanded") === "true";

  if (isNavVisible) {
    nav.setAttribute(ATTRIBUTES.visible, false);
    hamburger.setAttribute("aria-expanded", false);
    hamburgerOpen.setAttribute(ATTRIBUTES.visible, true);
    hamburgerClose.setAttribute(ATTRIBUTES.visible, false);
    document.body.setAttribute("data-lock-scroll", false);
  } else {
    nav.setAttribute(ATTRIBUTES.visible, true);
    hamburger.setAttribute("aria-expanded", true);
    hamburgerOpen.setAttribute(ATTRIBUTES.visible, false);
    hamburgerClose.setAttribute(ATTRIBUTES.visible, true);
    document.body.setAttribute("data-lock-scroll", true);
  }
});
