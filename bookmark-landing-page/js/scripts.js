// BEGIN Menu nav toggle

const nav = document.querySelector(".js-nav");
const closeMenuButton = document.querySelector(".js-close-menu-button");
const showMenuButton = document.querySelector(".js-open-menu-button");
const { body } = document;

const CLASSES = {
  navActive: "nav-mobile--active",
  noScroll: "no-scroll",
};

const showNav = () => {
  nav.classList.add(CLASSES.navActive);
  body.classList.add(CLASSES.noScroll);
  closeMenuButton.setAttribute("aria-expanded", true);
  showMenuButton.setAttribute("aria-expanded", true);
};

const hideNav = () => {
  nav.classList.remove(CLASSES.navActive);
  body.classList.remove(CLASSES.noScroll);
  closeMenuButton.setAttribute("aria-expanded", false);
  showMenuButton.setAttribute("aria-expanded", false);
};

closeMenuButton.addEventListener("click", hideNav);
showMenuButton.addEventListener("click", showNav);

// END Menu nav toggle

// BEGIN Accordion

const ACCORDION_CLASSES = {
  itemActive: "accordion-item--active",
  container: "js-accordion-container",
  item: "js-accordion-item",
  header: "js-accordion-header",
  content: "js-accordion-content",
};

const MODES = {
  one: "one",
  multiple: "multiple",
};

const accordionContainer = document.querySelector(
  `.${ACCORDION_CLASSES.container}`
);
const accordionItems = document.querySelectorAll(`.${ACCORDION_CLASSES.item}`);
const accordionHeaders = document.querySelectorAll(
  `.${ACCORDION_CLASSES.header}`
);
const isOnlyOneExpanded =
  accordionContainer.getAttribute("data-mode") === MODES.one;

let lastExpanded = null;

const showAccordionContent = (item, header, content) => {
  header.setAttribute("aria-expanded", true);
  content.setAttribute("aria-hidden", false);
  item.classList.add(ACCORDION_CLASSES.itemActive);
};

const hideAccordionContent = (item, header, content) => {
  header.setAttribute("aria-expanded", false);
  content.setAttribute("aria-hidden", true);
  item.classList.remove(ACCORDION_CLASSES.itemActive);
};

const handleAccordionHeaderClick = (event) => {
  const header = event.currentTarget;
  const parent = header.closest(`.${ACCORDION_CLASSES.item}`);
  const content = parent.querySelector(`.${ACCORDION_CLASSES.content}`);

  const isCollapsed = header.getAttribute("aria-expanded") === "false" || false;

  if (isOnlyOneExpanded && lastExpanded) {
    const content = lastExpanded.querySelector(`.${ACCORDION_CLASSES.content}`);
    const header = lastExpanded.querySelector(`.${ACCORDION_CLASSES.header}`);
    hideAccordionContent(lastExpanded, header, content);
  }

  if (isCollapsed) {
    showAccordionContent(parent, header, content);
    lastExpanded = parent;
  } else {
    hideAccordionContent(parent, header, content);
    lastExpanded = null;
  }
};

const ACCORDION_KEY_CODES = {
  enter: 13,
  space: 32,
};

const handleAccordionHeaderKeyDown = (event) => {
  event.preventDefault();
  const shouldTrigger = Object.values(ACCORDION_KEY_CODES).includes(
    event.keyCode
  );
  if (shouldTrigger) {
    handleAccordionHeaderClick(event);
  }
};

accordionHeaders.forEach((item) => {
  item.addEventListener("click", handleAccordionHeaderClick);
  item.addEventListener("keydown", handleAccordionHeaderKeyDown);
});

// END Accordion

// BEGIN Tabs

const TABS_CLASSES = {
  tabTriggerActive: "tab-list__trigger--active",
  panelActive: "tabs-panels__item--active",
};
const tabs = document.querySelector(".js-tabs");
const tabsTriggers = document.querySelectorAll(".js-tabs-trigger");
const tabPanels = document.querySelectorAll(".js-tabs-panel");
const initiallySelectedTab = tabs.querySelector(
  `.${TABS_CLASSES.tabTriggerActive}`
);
let prevTabId = initiallySelectedTab.getAttribute("id");

const showTab = (tab, tabContent) => {
  tab.setAttribute("tabindex", 0);
  tab.focus();
  tab.setAttribute("aria-selected", true);
  tab.classList.add(TABS_CLASSES.tabTriggerActive);
  tabContent.classList.add(TABS_CLASSES.panelActive);
};

const hideTab = (tab, tabContent) => {
  tab.setAttribute("tabindex", -1);
  tab.setAttribute("aria-selected", false);
  tab.classList.remove(TABS_CLASSES.tabTriggerActive);
  tabContent.classList.remove(TABS_CLASSES.panelActive);
};

const handleTabsTriggerClick = (event) => {
  const tab = event.currentTarget;
  const tabId = tab.getAttribute("id");
  if (prevTabId === tabId) return;

  const tabContent = tabs.querySelector(`[data-tab-id=${tabId}]`);
  const prevTab = tabs.querySelector(`[id=${prevTabId}]`);
  const prevTabContent = tabs.querySelector(`[data-tab-id=${prevTabId}]`);
  hideTab(prevTab, prevTabContent);
  showTab(tab, tabContent);
  prevTabId = tabId;
};

tabsTriggers.forEach((trigger) => {
  trigger.addEventListener("click", handleTabsTriggerClick);
});

const KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};

const moveTabFocus = ({ tab, nextTab }) => {
  const tabId = tab.getAttribute("id");
  const tabContent = tabs.querySelector(`[data-tab-id=${tabId}]`);
  const nextTabId = nextTab.getAttribute("id");
  const nextTabContent = tabs.querySelector(`[data-tab-id=${nextTabId}]`);
  hideTab(tab, tabContent);
  showTab(nextTab, nextTabContent);
  prevTabId = nextTabId;
};

tabsTriggers.forEach((trigger) => {
  trigger.addEventListener("keydown", ({ keyCode }) => {
    const { nextElementSibling, previousElementSibling } = trigger;
    if (keyCode === KEYS.right) {
      let nextTab = nextElementSibling;
      if (!nextTab) nextTab = tabsTriggers[0];

      moveTabFocus({
        tab: trigger,
        nextTab,
      });
      return;
    }

    if (keyCode === KEYS.left) {
      let nextTab = previousElementSibling;
      if (!nextTab) nextTab = tabsTriggers[tabsTriggers.length - 1];

      moveTabFocus({
        tab: trigger,
        nextTab,
      });
      return;
    }
  });
});

// END Tabs

// BEGIN Form

const FORM_CLASSES = {
  formInvalid: "cta-form--invalid",
  formSuccess: "cta-form--success",
};

const VALIDATION_TEXTS = {
  invalid: "Whoops, make sure it’s an email",
  success: "Thanks for subscribing!",
};

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const isEmail = (value) => EMAIL_REGEX.test(value);

const form = document.querySelector(".js-cta-form");
const input = document.querySelector(".js-cta-input");
const validationInfo = document.querySelector(".js-cta-form-validation-info");
let timeout;

const handleFormSuccess = () => {
  clearTimeout(timeout);
  form.classList.add(FORM_CLASSES.formSuccess);
  validationInfo.innerText = VALIDATION_TEXTS.success;
  input.value = "";
  setTimeout(() => {
    form.classList.remove(FORM_CLASSES.formSuccess);
  }, 1500);
};

const hideError = () => {
  form.classList.remove(FORM_CLASSES.formInvalid);
  input.removeAttribute("aria-describedby");
  input.setAttribute("aria-invalid", false);
};

const handleFormError = () => {
  form.classList.add(FORM_CLASSES.formInvalid);
  input.setAttribute("aria-describedby", "input-validation-message");
  input.setAttribute("aria-invalid", true);
  validationInfo.innerText = VALIDATION_TEXTS.invalid;
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  const { value } = input;
  if (isEmail(value)) {
    handleFormSuccess();
  } else {
    handleFormError();
  }
};

const handleInput = () => {
  hideError();
};

form.addEventListener("submit", handleFormSubmit);
input.addEventListener("input", handleInput);

// END Form
