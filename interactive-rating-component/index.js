const CLASSES = {
  ratingNumberSelected: "card__rating-number--selected",
  cardMain: "card--main",
  cardCompletion: "card--completion",
};

const KEYS = {
  left: 37,
  right: 39,
};

const card = document.querySelector(".js-card");
const cardContent = document.querySelector(".js-card-content");
const submitButton = document.querySelector(".js-submit-button");
const ratingNumbers = document.querySelectorAll(".js-rating-number");

let prevSelectedRatingNumber;

const handleSelectRatingNumber = (ratingNumber) => {
  ratingNumber.classList.add(CLASSES.ratingNumberSelected);
  ratingNumber.setAttribute("tabindex", 0);
  ratingNumber.setAttribute("aria-selected", true);
  ratingNumber.focus();
};

const handleRemoveRatingNumber = (ratingNumber) => {
  ratingNumber.classList.remove(CLASSES.ratingNumberSelected);
  ratingNumber.setAttribute("tabindex", -1);
  ratingNumber.setAttribute("aria-selected", false);
};

const moveRatingNumberFocus = ({ number, nextNumber }) => {
  handleRemoveRatingNumber(number);
  handleSelectRatingNumber(nextNumber);
  prevSelectedRatingNumber = nextNumber;
};

ratingNumbers.forEach(function (ratingNumber) {
  ratingNumber.addEventListener("keydown", ({ keyCode }) => {
    const { nextElementSibling, previousElementSibling } = ratingNumber;
    if (keyCode === KEYS.right) {
      let nextNumber = nextElementSibling;
      if (!nextNumber) nextNumber = ratingNumbers[0];

      moveRatingNumberFocus({
        number: ratingNumber,
        nextNumber,
      });
      return;
    }

    if (keyCode === KEYS.left) {
      let nextNumber = previousElementSibling;
      if (!nextNumber) nextNumber = ratingNumbers[ratingNumbers.length - 1];

      moveRatingNumberFocus({
        number: ratingNumber,
        nextNumber,
      });
      return;
    }
  });

  ratingNumber.addEventListener("click", function () {
    if (prevSelectedRatingNumber) {
      handleRemoveRatingNumber(prevSelectedRatingNumber);
    }
    handleSelectRatingNumber(ratingNumber);
    prevSelectedRatingNumber = ratingNumber;
  });
});

submitButton.addEventListener("click", function () {
  const selectedRatingNumberElement = document.querySelector(
    `.${CLASSES.ratingNumberSelected}`
  );

  if (!selectedRatingNumberElement) {
    alert("Please leave a feedback");
    return;
  }

  const value = parseInt(
    selectedRatingNumberElement.getAttribute("data-value")
  );

  card.classList.remove(CLASSES.cardMain);
  card.classList.add(CLASSES.cardCompletion);

  cardContent.innerHTML = `
  <div class="card__image">
    <img
      src="./images/illustration-thank-you.svg"
      alt=""
      width="162"
      height="108"
      aria-hidden="true"
    />
  </div>
  <div class="card__selected-stat">
    You selected <span class="js-selected-amount">${value}</span> out of 5
  </div>
  <h1 class="card__title">Thank you!</h1>
  <p class="card__description">
    We appreciate you taking the time to give a rating. If you ever need
    more support, don’t hesitate to get in touch!
  </p>
          `;
});
