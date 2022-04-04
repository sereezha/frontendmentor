const number = document.querySelector(".js-advice-number");
const text = document.querySelector(".js-advice-text");
const button = document.querySelector(".js-advice-button");

const fetchAdvice = async () => {
  const response = await fetch("https://api.adviceslip.com/advice");
  const { slip: data } = await response.json();
  number.innerHTML = data.id;
  text.innerHTML = data.advice;
};

button.addEventListener("click", fetchAdvice);

fetchAdvice();
