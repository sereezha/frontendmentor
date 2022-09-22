const burger = document.querySelector(".js-hamburger");
const nav = document.querySelector(".js-header-right");

burger.addEventListener("click", function () {
  const isNavVisible = burger.getAttribute("aria-expanded") === "true";

  if (isNavVisible) {
    burger.setAttribute("aria-expanded", false);
    burger.setAttribute("aria-label", "Open navigation");
    nav.removeAttribute("data-visible");
  } else {
    burger.setAttribute("aria-expanded", true);
    burger.setAttribute("aria-label", "Close navigation");
    nav.setAttribute("data-visible", "");
  }
});
