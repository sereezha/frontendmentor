// SHORTENER
const formEl = document.querySelector(".js-shortener-form");
const inputEl = formEl.querySelector(".js-shortener-input");
const submitButtonEl = formEl.querySelector(".js-shortener-button");
const errorTextEl = formEl.querySelector(".js-shortener-error-text");
const shortenerResultsEl = document.querySelector(".js-shortener-results-list");

const ERROR_TEXTS = {
  emptyLink: "Please add a link",
  wrongURL: "Please enter a valid URL. Example: http://www.google.com",
};

const CLASSES = {
  buttonCopied: "shortener-results__button--copied",
};

let copyLinkTimeout;

const addCopyStateToCopyButton = (buttonEl) => {
  buttonEl.innerHTML = "Copied!";
  buttonEl.classList.add(CLASSES.buttonCopied);
};

const removeCopyStateFromCopyButton = (buttonEl) => {
  buttonEl.innerHTML = "Copy";
  buttonEl.classList.remove(CLASSES.buttonCopied);
};

const handleSuccessCopy = (buttonEl) => () => {
  if (copyLinkTimeout) clearTimeout(copyLinkTimeout);
  addCopyStateToCopyButton(buttonEl);
  copyLinkTimeout = setTimeout(() => {
    removeCopyStateFromCopyButton(buttonEl);
  }, 2000);
};

const handleFailCopy = (err) => {
  console.log(err);
};

const fallbackCopyTextToClipboard = (text) => {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    const msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
};

const copyTextToClipboard = (text, successCallback, failCallback) => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }

  navigator.clipboard.writeText(text).then(successCallback, failCallback);
};

const handleCopyButtonClick = (event) => {
  const button = event.currentTarget;
  const linkEl = button.previousElementSibling;
  const url = linkEl.innerHTML;
  copyTextToClipboard(url, handleSuccessCopy(button), handleFailCopy);
};

const renderCreatedShortenedUrl = (data) => {
  const { url, shortenedURL } = data;
  const item = `
  <li class="shortener-results__item">
    <div class="shortener-results__left">
      <a target="_blank" rel="noreferrer noopener" class="shortener-results__url" href="${shortenedURL}">
        ${url}
      </a>
    </div>
    <div class="shortener-results__right">
      <a
        class="shortener-results__url shortener-results__url--shortened js-shortened-link"
        href="${shortenedURL}"
      >
        ${shortenedURL}
      </a>
      <button
        class="shortener-results__button button button--primary button--small js-copy-button"
        data-id="${shortenedURL}"
        onclick="handleCopyButtonClick(event)"
      >
        Copy
      </button>
    </div>
  </li>
  `;

  shortenerResultsEl.insertAdjacentHTML("afterbegin", item);
};

const showError = (text) => {
  errorTextEl.innerHTML = text;
  formEl.classList.add("shortener-form--error");
};

const hideError = () => {
  formEl.classList.remove("shortener-form--error");
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  hideError();

  const inputValue = inputEl.value;

  if (!inputValue) {
    showError(ERROR_TEXTS.emptyLink);
    return;
  }

  shortenURL(inputValue);
};

const handleClearInputValue = () => {
  inputEl.value = "";
};

const shortenURL = async (url) => {
  const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
  const data = await res.json();

  if (!data.ok) {
    showError(ERROR_TEXTS.wrongURL);
    return;
  }

  handleClearInputValue();
  renderCreatedShortenedUrl({ url, shortenedURL: data.result.full_short_link });
};

const initListeners = () => {
  formEl.addEventListener("submit", handleFormSubmit);
  inputEl.addEventListener("input", hideError);
};

initListeners();

// TOGGLE MENU

const menuButton = document.querySelector(".js-menu-button");
const mobileNavigation = document.querySelector(".js-mobile-navigation");

const hideNav = () => {
  menuButton.setAttribute("aria-expanded", false);
  mobileNavigation.setAttribute("data-visible", false);
};

const showNav = () => {
  menuButton.setAttribute("aria-expanded", true);
  mobileNavigation.setAttribute("data-visible", true);
};

const navVisibilityMap = {
  true: hideNav,
  false: showNav,
};

const handleMenuButtonClick = () => {
  const isNavVisible = mobileNavigation.getAttribute("data-visible");

  navVisibilityMap[isNavVisible]();
};

menuButton.addEventListener("click", handleMenuButtonClick);
