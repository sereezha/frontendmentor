// FETCH USER

const API_URL = "https://api.github.com";
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const STATE_CLASSES = {
  contactEmpty: "profile__contact--empty",
  bioEmpty: "profile__bio--empty",
  searchNoResultsHidden: "search__no-results--hidden",
  profileNoResultsHidden: "profile__no-results--hidden",
  profileHidden: "profile--hidden",
};

const formatDate = (date) => {
  const completeDate = new Date(date);
  const year = completeDate.getFullYear();
  const day = completeDate.getDate();
  const month = MONTHS[completeDate.getMonth()];
  const fullDate = `${day} ${month} ${year}`;

  return fullDate;
};

const avatar = document.querySelector(".js-profile-avatar");
const profileName = document.querySelector(".js-profile-name");
const profileUsername = document.querySelector(".js-profile-username");
const profileJoinDate = document.querySelector(".js-profile-join-date");
const profileBio = document.querySelector(".js-profile-bio");

const renderStats = (stats) => {
  stats.forEach(({ id, value }) => {
    const profileStat = document.querySelector(`[data-stat=${id}]`);
    profileStat.innerHTML = value;
  });
};

const renderContacts = (contacts) => {
  contacts.forEach(({ id, value, href }) => {
    const profileContact = document.querySelector(`[data-contact=${id}]`);
    const parent = profileContact.closest(".profile__contact");

    if (value) {
      profileContact.innerHTML = value;
      profileContact.href = href;
      parent.classList.remove(STATE_CLASSES.contactEmpty);
    } else {
      profileContact.innerHTML = "Not Available";
      parent.classList.add(STATE_CLASSES.contactEmpty);
    }
  });
};

const renderBio = (bio) => {
  profileBio.innerHTML = bio || "This profile has no bio";
  if (!bio) {
    profileBio.classList.add(STATE_CLASSES.bioEmpty);
    return;
  }
  profileBio.classList.remove(STATE_CLASSES.bioEmpty);
};

const renderUsername = (username) => {
  profileUsername.innerHTML = `@${username}`;
};

const renderAvatar = ({ avatarUrl, name }) => {
  avatar.src = avatarUrl;
  avatar.alt = `Avatar of ${name}`;
};

const renderJoinDate = (date) => {
  profileJoinDate.innerHTML = date;
};

const renderMainInfo = ({ name, joinDate, username }) => {
  profileName.innerHTML = name;
  renderJoinDate(joinDate);
  renderUsername(username);
};

const createMainInfoData = ({ name, created_at, login }) => ({
  name,
  joinDate: `Joined ${formatDate(created_at)}`,
  username: login,
});

const createAvatarData = ({ avatar_url, name }) => ({
  avatarUrl: avatar_url,
  name,
});

const createStatsData = ({ public_repos, followers, following }) => [
  {
    id: "repos",
    value: public_repos,
  },
  {
    id: "followers",
    value: followers,
  },
  {
    id: "following",
    value: following,
  },
];

const createContactsData = ({ location, twitter_username, blog, company }) => [
  { id: "location", value: location },
  {
    id: "twitter",
    value: twitter_username,
    href: `https://twitter.com/${twitter_username}`,
  },
  { id: "blog", value: blog, href: blog },
  { id: "company", value: company, href: `https://github.com/${company}` },
];

const renderProfile = (data) => {
  const {
    avatar_url,
    name,
    login,
    created_at,
    bio,
    public_repos,
    followers,
    following,
    location,
    twitter_username,
    blog,
    company,
  } = data;

  const contactsData = createContactsData({
    location,
    twitter_username,
    blog,
    company,
  });
  const statsData = createStatsData({ public_repos, followers, following });
  const avatarData = createAvatarData({ avatar_url, name });
  const mainInfoData = createMainInfoData({ name, created_at, login });

  renderMainInfo(mainInfoData);
  renderAvatar(avatarData);
  renderBio(bio);
  renderStats(statsData);
  renderContacts(contactsData);
};

const searchNoResultsEl = document.querySelector(".js-search-no-results");
const profileNoResultsEl = document.querySelector(".js-profile-no-results");
const profileEl = document.querySelector(".js-profile");

const handleNoResultsVisibility = (shouldShow) => {
  if (shouldShow) {
    searchNoResultsEl.classList.remove(STATE_CLASSES.searchNoResultsHidden);
  } else {
    searchNoResultsEl.classList.add(STATE_CLASSES.searchNoResultsHidden);
  }
};

const handleShowError = () => {
  handleNoResultsVisibility(true);
  profileEl.classList.add(STATE_CLASSES.profileHidden);
  profileNoResultsEl.classList.remove(STATE_CLASSES.profileNoResultsHidden);
};

const handleHideError = () => {
  profileEl.classList.remove(STATE_CLASSES.profileHidden);
  profileNoResultsEl.classList.add(STATE_CLASSES.profileNoResultsHidden);
};

const fetchUser = async (username, apiURL = API_URL) => {
  const fullUrl = `${apiURL}/users/${username}`;
  const res = await fetch(fullUrl);

  if (!res.ok) {
    handleShowError();
    return;
  }

  const data = await res.json();

  renderProfile(data);
  handleHideError();
};

const searchForm = document.querySelector(".js-search-form");
const searchInput = searchForm.querySelector(".js-search-input");
const searchButton = searchForm.querySelector(".js-search-button");

const handleSearchInput = () => {
  const isNoResultsTextVisible = !searchNoResultsEl.classList.contains(
    STATE_CLASSES.searchNoResultsHidden
  );

  if (isNoResultsTextVisible) {
    handleNoResultsVisibility(false)
  }
};

searchInput.addEventListener("input", handleSearchInput);

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const { value: username } = searchInput;
  fetchUser(username);
});

// TOGGLE THEME

const LOCAL_STORAGE_KEY = "theme-preference";
const THEMES = {
  light: "light",
  dark: "dark",
};

const { body } = document;
const toggleButtonText = document.querySelector(".js-theme-toggle-button-text");

const getThemeLabel = (value) => (value === THEMES.light ? "Dark" : "Light");

const setThemeOnBody = (theme) => {
  body.setAttribute("data-theme", theme);
};

const updateToggleButton = () => {
  toggleButtonText.innerHTML = getThemeLabel(theme.value);
};

const getColorThemePreference = (storageKey) => {
  const theme = localStorage.getItem(storageKey);
  if (theme) return theme;

  const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (isDarkTheme) return THEMES.dark;

  return THEMES.light;
};

const setPreference = (storageKey, value) => {
  localStorage.setItem(storageKey, value);
  setThemeOnBody(value);
};

const handleThemeToggle = () => {
  theme.value = theme.value === THEMES.light ? THEMES.dark : THEMES.light;
  setPreference(LOCAL_STORAGE_KEY, theme.value);
  updateToggleButton();
};

const setThemeOnLoad = (value) => {
  setThemeOnBody(value);
  updateToggleButton();
};

const theme = {
  value: getColorThemePreference(LOCAL_STORAGE_KEY),
};
const themeToggleButton = document.querySelector(".js-theme-toggle-button");
themeToggleButton.addEventListener("click", handleThemeToggle);
setThemeOnLoad(theme.value);
