const jobs = [
  {
    id: 1,
    company: "Photosnap",
    logo: "./images/photosnap.svg",
    new: true,
    featured: true,
    position: "Senior Frontend Developer",
    role: "Frontend",
    level: "Senior",
    postedAt: "1d ago",
    contract: "Full Time",
    location: "USA Only",
    languages: ["HTML", "CSS", "JavaScript"],
    tools: [],
  },
  {
    id: 2,
    company: "Manage",
    logo: "./images/manage.svg",
    new: true,
    featured: true,
    position: "Fullstack Developer",
    role: "Fullstack",
    level: "Midweight",
    postedAt: "1d ago",
    contract: "Part Time",
    location: "Remote",
    languages: ["Python"],
    tools: ["React"],
  },
  {
    id: 3,
    company: "Account",
    logo: "./images/account.svg",
    new: true,
    featured: false,
    position: "Junior Frontend Developer",
    role: "Frontend",
    level: "Junior",
    postedAt: "2d ago",
    contract: "Part Time",
    location: "USA Only",
    languages: ["JavaScript"],
    tools: ["React", "Sass"],
  },
  {
    id: 4,
    company: "MyHome",
    logo: "./images/myhome.svg",
    new: false,
    featured: false,
    position: "Junior Frontend Developer",
    role: "Frontend",
    level: "Junior",
    postedAt: "5d ago",
    contract: "Contract",
    location: "USA Only",
    languages: ["CSS", "JavaScript"],
    tools: [],
  },
  {
    id: 5,
    company: "Loop Studios",
    logo: "./images/loop-studios.svg",
    new: false,
    featured: false,
    position: "Software Engineer",
    role: "Fullstack",
    level: "Midweight",
    postedAt: "1w ago",
    contract: "Full Time",
    location: "Worldwide",
    languages: ["JavaScript"],
    tools: ["Ruby", "Sass"],
  },
  {
    id: 6,
    company: "FaceIt",
    logo: "./images/faceit.svg",
    new: false,
    featured: false,
    position: "Junior Backend Developer",
    role: "Backend",
    level: "Junior",
    postedAt: "2w ago",
    contract: "Full Time",
    location: "UK Only",
    languages: ["Ruby"],
    tools: ["RoR"],
  },
  {
    id: 7,
    company: "Shortly",
    logo: "./images/shortly.svg",
    new: false,
    featured: false,
    position: "Junior Developer",
    role: "Frontend",
    level: "Junior",
    postedAt: "2w ago",
    contract: "Full Time",
    location: "Worldwide",
    languages: ["HTML", "JavaScript"],
    tools: ["Sass"],
  },
  {
    id: 8,
    company: "Insure",
    logo: "./images/insure.svg",
    new: false,
    featured: false,
    position: "Junior Frontend Developer",
    role: "Frontend",
    level: "Junior",
    postedAt: "2w ago",
    contract: "Full Time",
    location: "USA Only",
    languages: ["JavaScript"],
    tools: ["Vue", "Sass"],
  },
  {
    id: 9,
    company: "Eyecam Co.",
    logo: "./images/eyecam-co.svg",
    new: false,
    featured: false,
    position: "Full Stack Engineer",
    role: "Fullstack",
    level: "Midweight",
    postedAt: "3w ago",
    contract: "Full Time",
    location: "Worldwide",
    languages: ["JavaScript", "Python"],
    tools: ["Django"],
  },
  {
    id: 10,
    company: "The Air Filter Company",
    logo: "./images/the-air-filter-company.svg",
    new: false,
    featured: false,
    position: "Front-end Dev",
    role: "Frontend",
    level: "Junior",
    postedAt: "1mo ago",
    contract: "Part Time",
    location: "Worldwide",
    languages: ["JavaScript"],
    tools: ["React", "Sass"],
  },
];

const tagsContainer = document.querySelector(".tags-container");
const clearTagsButton = document.querySelector(".js-clear-tags-button");
const filterTagsList = document.querySelector(".js-filter-tags-list");

const CLASSES = {
  tagsContainerHidden: "tags-container--hidden",
};
let filteredJobs = [...jobs];
let filters = [];

const updateJobsList = (jobsList) => {
  jobsListContainer.innerHTML = JobsList(jobsList);
};

const getJobTags = ({ tools, languages, role, level }) => [
  ...tools,
  ...languages,
  role,
  level,
];

const filterJobs = (jobs, filters) => {
  return jobs.filter(({ tools, languages, role, level }) => {
    const jobTags = getJobTags({ tools, languages, role, level });
    return filters.every((item) => jobTags.includes(item));
  });
};

const getElementDataId = (el, id = "id") => el.dataset[id];

const handleClearButtonClick = () => {
  tagsContainer.classList.add(CLASSES.tagsContainerHidden);
  filterTagsList.innerHTML = "";
  filters = [];
  filteredJobs = jobs;
  updateJobsList(filteredJobs);
};

clearTagsButton.addEventListener("click", handleClearButtonClick);

const handleRemoveTag = (event) => {
  const element = event.currentTarget;
  const parent = element.closest(".js-tags-list-item");
  const id = getElementDataId(parent);
  filters = filters.filter((item) => item !== id);
  if (!filters.length) {
    tagsContainer.classList.add(CLASSES.tagsContainerHidden);
    filteredJobs = jobs;
  } else {
    filteredJobs = filterJobs(jobs, filters);
  }
  parent.remove();
  updateJobsList(filteredJobs);
};

const removeItemsByIds = (selector, filteredJobs) => {
  const items = [...document.querySelectorAll(selector)];
  items.forEach((item) => {
    const id = parseInt(getElementDataId(item));
    const hasIdInArr = filteredJobs.some((job) => job.id === id);
    if (!hasIdInArr) item.remove();
  });
};

const handleAddTag = (event) => {
  const id = getElementDataId(event.currentTarget);
  if (filters.includes(id)) return;
  filters.push(id);
  filteredJobs = filterJobs(jobs, filters);
  tagsContainer.classList.remove(CLASSES.tagsContainerHidden);
  filterTagsList.insertAdjacentHTML("beforeend", FilterTag(id));
  removeItemsByIds(".js-jobs-list-item", filteredJobs);
};

const FilterTag = (id) => {
  return `
  <li class="tags-list__item js-tags-list-item" data-id=${id}>
  <div class="tag-container">
    <span class="tag">${id}</span>
    <button
      type="button"
      class="tag__remove-button button js-tag-remove-button"
      aria-label="Tag remove button"
      onclick="handleRemoveTag(event)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        aria-hidden="true"
      >
        <path
          fill="#FFF"
          fill-rule="evenodd"
          d="M11.314 0l2.121 2.121-4.596 4.596 4.596 4.597-2.121 2.121-4.597-4.596-4.596 4.596L0 11.314l4.596-4.597L0 2.121 2.121 0l4.596 4.596L11.314 0z"
        />
      </svg>
    </button>
  </div>
</li>
  `;
};

const JobsList = (jobsList) => {
  return `
  <ul class="jobs-list js-jobs-list">
    ${jobsList.map(JobsItem).join("")}
  </ul>
  `;
};

const JobsItem = (job) => {
  const {
    id,
    company,
    logo,
    new: isNew,
    featured,
    position,
    role,
    level,
    postedAt,
    contract,
    location,
    languages,
    tools,
  } = job;

  const featuredClass = featured ? "card--featured" : "";
  const tags = getJobTags({ tools, languages, role, level });
  return `
  <li class="jobs-list__item js-jobs-list-item job card ${featuredClass}" data-id="${id}">
    <div class="job__content">
      <div class="job__avatar">
        <img
          src="${logo}"
          alt="Logo of ${company} company"
        />
      </div>
      <div class="job__about">
        <div class="job__about-top">
          <p class="job__company">${company}</p>
          ${
            isNew || featured
              ? `<ul class="job__badges badges-list">
            ${isNew ? '<li class="badges-list__item badge">New!</li>' : ""}
            ${
              featured
                ? '<li class="badges-list__item badge badge--featured">Featured</li>'
                : ""
            }
          </ul>`
              : ""
          }
        </div>
        <p class="job__position">${position}</p>
        <div class="job__short-info">
          <div class="job__short-info-item">${postedAt}</div>
          <div class="job__short-info-item">${contract}</div>
          <div class="job__short-info-item">${location}</div>
        </div>
      </div>
    </div>
    ${
      !!tags.length
        ? `
      <ul class="job__tags tags-list">
      ${tags.map(JobsItemTag).join("")}
      </ul>
      `
        : ""
    }
  </li>
  `;
};

const JobsItemTag = (tag) => {
  return `
    <li class="tags-list__item">
      <button
        data-id="${tag}"
        class="tag-container tag-container--clickable js-clickable-tag"
        type="button"
        onclick={handleAddTag(event)}
      >
        <span class="tag">${tag}</span>
      </button>
    </li>
    `;
};

const jobsListContainer = document.querySelector("#jobs-list-container");
updateJobsList(filteredJobs);
