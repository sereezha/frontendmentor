const CLASSES = {
  ratingNumberSelected: "card__rating-number--selected",
  cardMain: "card--main",
  cardCompletion: "card--completion",
};

const card = document.querySelector(".js-card");
const cardContent = document.querySelector(".js-card-content");
const submitButton = document.querySelector(".js-submit-button");
const ratingNumbers = document.querySelectorAll(".js-rating-number");

let prevSelectedRatingNumber;

const handleSelectRatingNumber = (ratingNumber) => {
  ratingNumber.classList.add(CLASSES.ratingNumberSelected);
};

const handleRemoveRatingNumber = (ratingNumber) => {
  ratingNumber.classList.remove(CLASSES.ratingNumberSelected);
};

ratingNumbers.forEach(function (ratingNumber) {
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
