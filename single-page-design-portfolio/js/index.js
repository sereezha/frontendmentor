document.addEventListener("DOMContentLoaded", function () {
  const splide = new Splide(".splide", {
    type: "loop",
    perMove: 1,
    focus: "center",
    width: "144rem",
    mediaQuery: "min",
    perPage: 1,
    padding: "10%",
    gap: "1.5rem",
    breakpoints: {
      768: {
        perPage: 2,
        gap: "3rem",
      },
      1440: {
        perPage: 3,
        gap: "3rem",
        padding: 0
      },
    },
  });
  splide.mount();
});
