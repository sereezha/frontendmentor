const ipAddressEl = document.querySelector(".js-ip-address");
const locationEl = document.querySelector(".js-location");
const timezoneEl = document.querySelector(".js-timezone");
const ispEl = document.querySelector(".js-isp");
const form = document.querySelector(".js-search-form");
const formInput = form.querySelector(".js-search-input");
const formButton = form.querySelector(".js-search-button");
const formError = document.querySelector(".js-search-error");

const CLASSES = {
  searchErrorHidden: "search__error--hidden",
};

const REGEX = {
  ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  domain: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/,
  url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
};

const validateIP = (value) => REGEX.ip.test(value);
const validateDomain = (value) => REGEX.domain.test(value);
const validateURL = (value) => REGEX.url.test(value);

const showError = () => {
  formError.classList.remove(CLASSES.searchErrorHidden);
};

const hideError = () => {
  formError.classList.add(CLASSES.searchErrorHidden);
};

let prevInputValue = "";

const handleFormSubmit = (event) => {
  event.preventDefault();
  hideError();

  const inputValue = formInput.value;
  if (!inputValue || prevInputValue === inputValue) return;
  prevInputValue = inputValue;

  const isIp = validateIP(inputValue);
  const isDomain = validateDomain(inputValue);
  const isURL = validateURL(inputValue);

  if (isIp) {
    fetchLocation({ ipAddress: inputValue });
    return;
  }

  if (isURL) {
    const domain = new window.URL(inputValue);
    fetchLocation({ domain: domain.hostname });
    return;
  }

  if (isDomain) {
    fetchLocation({ domain: inputValue });
    return;
  }

  showError();
};

const renderInfo = (data) => {
  const { ip, location, timezone, isp } = data;
  const { city, country, postalCode } = location;
  ipAddressEl.innerHTML = ip;
  locationEl.innerHTML = `${city}, ${country} ${postalCode}`;
  timezoneEl.innerHTML = timezone;
  ispEl.innerHTML = isp;
};

const prepareDataToShow = ({ ip, location, isp }) => {
  const { timezone, ...restLocation } = location;
  return {
    ip,
    location: restLocation,
    timezone,
    isp,
  };
};

const API_KEY = "YGayHem9WZgDC6Pksmb3D1eo0ehoT";
const URL = `https://geo.ipify.org/api/v2/country,city?apiKey=at_${API_KEY}`;

const fetchLocation = async (params = {}, url = URL) => {
  const { domain = "", ipAddress = "" } = params;
  const res = await fetch(`${url}&domain=${domain}&ipAddress=${ipAddress}`);
  const data = await res.json();
  const preparedDataToShow = prepareDataToShow(data);

  renderInfo(preparedDataToShow);

  const {
    location: { lat, lng },
  } = data;

  const location = [lat, lng];
  setMapView(location);
};

const ZOOM_LEVEL = 13;
let map;
let marker;
const customMarkerIcon = L.icon({
  iconUrl: "./images/icon-location.svg",
  iconSize: [46, 56],
});

const setMapView = (location, zoomLevel = ZOOM_LEVEL) => {
  if (marker) {
    map.removeLayer(marker);
  }
  map.setView(location, zoomLevel);
  marker = L.marker(location, { icon: customMarkerIcon }).addTo(map);
};

const initMap = () => {
  map = L.map("map");

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    {
      maxZoom: 18,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
    }
  ).addTo(map);
};

const initListeners = () => {
  form.addEventListener("submit", handleFormSubmit);
  formInput.addEventListener("input", hideError);
};

const init = () => {
  initMap();
  fetchLocation();
  initListeners();
};

init();
