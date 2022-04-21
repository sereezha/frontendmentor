const currentOperandEl = document.querySelector(".js-current-operand");
const previousOperandEl = document.querySelector(".js-previous-operand");
const resetButton = document.querySelector(".js-reset-button");
const equalsButton = document.querySelector(".js-equals-button");
const deleteButton = document.querySelector(".js-delete-button");
const operators = document.querySelectorAll("[data-operator]");
const operands = document.querySelectorAll(".js-number-button");
const CANNOT_DIVIDE_BY_ZERO_TEXT = "You cannot divide by zero";

let currentOperand = "";
let previousOperand = 0;
let operation = "";

const handleReset = () => {
  currentOperandEl.innerHTML = "";
  previousOperandEl.innerHTML = "";
  currentOperand = "";
  previousOperand = "";
  operation = "";
};

const calculate = (number1, number2, operation) => {
  const calculateMap = {
    "+": () => number1 + number2,
    "-": () => number1 - number2,
    "*": () => number1 * number2,
    "/": () => {
      if (number2 === 0) return "";
      return number1 / number2;
    },
  };

  return calculateMap[operation]();
};

const updateCurrentOperandValue = (val) => {
  if (currentOperandEl.innerHTML === CANNOT_DIVIDE_BY_ZERO_TEXT) {
    currentOperandEl.innerHTML = "";
  }
  currentOperandEl.innerHTML += val;
  currentOperand += val;
};

const handleDeleteOperation = () => {
  const currentOperandValue = currentOperandEl.innerHTML;
  if (currentOperandValue === CANNOT_DIVIDE_BY_ZERO_TEXT) {
    handleReset();
    return;
  }
  const newValue = currentOperandValue.slice(0, -1);
  currentOperandEl.innerHTML = newValue;
  currentOperand = newValue || "";
};

const handleEqualOperation = () => {
  const result = calculate(
    previousOperand,
    parseFloat(currentOperand),
    operation
  );
  previousOperand = 0;
  currentOperand = result;
  previousOperandEl.innerHTML = "";
  currentOperandEl.innerHTML = !result ? CANNOT_DIVIDE_BY_ZERO_TEXT : result;
};

const handleOperatorClick = (currOperation) => {
  if (previousOperand && !currentOperand) {
    previousOperandEl.innerHTML = previousOperand + currOperation;
    operation = currOperation;
    return;
  }

  if (!previousOperand) {
    previousOperand = parseFloat(currentOperand);
    previousOperandEl.innerHTML = currentOperandEl.innerHTML + currOperation;
  } else {
    previousOperand = calculate(
      previousOperand,
      parseFloat(currentOperand),
      operation
    );
    previousOperandEl.innerHTML = previousOperand + currOperation;
  }

  currentOperandEl.innerHTML = "";
  currentOperand = "";
  operation = currOperation;
};

const handleOperandClick = (event) => {
  updateCurrentOperandValue(event.target.innerHTML);
};

const handleKeyUp = (event) => {
  switch (event.key) {
    case "Backspace":
      handleDeleteOperation();
      break;
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case ".":
      updateCurrentOperandValue(event.key);
      break;
    case "+":
    case "-":
    case "*":
    case "/":
    case "%":
      handleOperatorClick(event.key);
      break;
    case "=":
    case "Enter":
      if (previousOperand && currentOperand) {
        handleEqualOperation();
      }
      break;

    default:
      break;
  }
};

window.addEventListener("keyup", handleKeyUp);
resetButton.addEventListener("click", handleReset);
deleteButton.addEventListener("click", handleDeleteOperation);
equalsButton.addEventListener("click", handleEqualOperation);
operands.forEach((item) => {
  item.addEventListener("click", handleOperandClick);
});
operators.forEach((item) => {
  item.addEventListener("click", function (event) {
    const operator = event.target.dataset["operator"];
    handleOperatorClick(operator);
  });
});

// THEME TOGGLE

const LOCAL_STORAGE_KEY = "theme-preference";
const THEMES = {
  light: "light",
  dark: "dark",
  synthwave: "synthwave",
};

const themeToggleButtons = document.querySelectorAll(".js-theme-toggle-button");
const handleThemeToggle = (event) => {
  const theme = event.target.dataset["themeToggle"];
  setPreference(LOCAL_STORAGE_KEY, theme);
};

themeToggleButtons.forEach((item) => {
  item.addEventListener("click", handleThemeToggle);
});

const setPreference = (storageKey, value) => {
  localStorage.setItem(storageKey, value);
  document.body.setAttribute("data-theme", value);
};

const getColorPreferences = (storageKey) => {
  const theme = localStorage.getItem(storageKey);
  if (theme) return theme;

  const isDarkTheme = window.matchMedia("(preferes-color-theme: dark)").matches;

  if (isDarkTheme) return THEMES.dark;

  return THEMES.light;
};

const theme = {
  value: getColorPreferences(LOCAL_STORAGE_KEY),
};

const setThemeOnLoad = (value) => {
  document.body.setAttribute("data-theme", value);
};

setThemeOnLoad(theme.value);
