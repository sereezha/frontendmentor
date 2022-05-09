const headerNav = document.querySelector(".js-header-nav");
const menuButton = document.querySelector(".js-menu-button");
const menuButtonLine = document.querySelectorAll(".js-menu-button-line");

const CLASSES = {
  menuButtonActive: "menu-button--active",
  headerNavActive: "header-nav--active",
  headerNavHidden: "header-nav--hidden",
  noAnimation: "no-animation",
  noScroll: "no-scroll",
};

let headerNavTransitionEndTimer;

const headerNavTransitionEnd = () => {
  headerNavTransitionEndTimer = setTimeout(() => {
    headerNav.classList.add(CLASSES.headerNavHidden);
  }, 100);
};

const showHeaderNav = () => {
  menuButton.setAttribute("aria-expanded", true);
  menuButton.classList.add(CLASSES.menuButtonActive);
  headerNav.classList.add(CLASSES.headerNavActive);
  headerNav.classList.remove(CLASSES.headerNavHidden);
  headerNav.removeEventListener("transitionend", headerNavTransitionEnd);
  document.body.classList.add(CLASSES.noScroll);
  headerNavTransitionEndTimer = null;
};

const hideHeaderNav = () => {
  menuButton.setAttribute("aria-expanded", false);
  menuButton.classList.remove(CLASSES.menuButtonActive);
  headerNav.classList.remove(CLASSES.headerNavActive);
  document.body.classList.remove(CLASSES.noScroll);
  headerNav.addEventListener("transitionend", headerNavTransitionEnd);
};

const handleMenuButtonClick = () => {
  const isActive = menuButton.classList.contains(CLASSES.menuButtonActive);

  menuButtonLine.forEach((item) => item.classList.remove(CLASSES.noAnimation));

  if (isActive) {
    hideHeaderNav();
  } else {
    showHeaderNav();
  }
};

menuButton.addEventListener("click", handleMenuButtonClick);
