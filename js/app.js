const ENABLE_APP_ENTRY = true;

let currentPage = 0;

const entryScreen = document.getElementById("entryScreen");
const entryTap = document.getElementById("entryTap");
const storyScreen = document.getElementById("storyScreen");
const pageIcon = document.getElementById("pageIcon");
const pageBody = document.getElementById("pageBody");
const storyProgress = document.getElementById("storyProgress");
const tapLeft = document.getElementById("tapLeft");
const tapRight = document.getElementById("tapRight");
const closeBtn = document.querySelector(".close-btn");

function restartScreenAnimation() {
  storyScreen.classList.remove("screen--animated");
  void storyScreen.offsetWidth;
  storyScreen.classList.add("screen--animated");
}

function renderPage(index) {
  const page = pages[index];
  if (!page) return;

  renderSharedHeader(page);
  renderTheme(page);
  renderBody(page);
  renderProgress(index);
}

function renderSharedHeader(page) {
  pageIcon.src = page.icon || "imgs/1F_icon.png";
  pageIcon.alt = "page icon";
}

function renderTheme(page) {
  storyScreen.className = "screen";

  if (page.theme) {
    storyScreen.classList.add(`page-theme--${page.theme}`);
  }

  if (page.theme === "default") {
    storyScreen.style.setProperty(
      "--page-bg-image",
      page.bgImage ? `url("${page.bgImage}")` : "none"
    );
    storyScreen.style.setProperty(
      "--page-bg-color",
      page.bgColor || "#3385e3"
    );
    restartScreenAnimation();
    return;
  }

  if (
    page.theme === "round-mvp" ||
    page.theme === "xp-round" ||
    page.theme === "badges-earned" ||
    page.theme === "prediction-status" ||
    page.theme === "share-recap"
  ) {
    storyScreen.style.removeProperty("--page-bg-image");
    storyScreen.style.setProperty(
      "--page-bg-color",
      page.bgColor || "#d4d4d4"
    );
    restartScreenAnimation();
    return;
  }

  storyScreen.style.removeProperty("--page-bg-image");
  storyScreen.style.removeProperty("--page-bg-color");
  storyScreen.classList.remove("screen--animated");
}

function renderBody(page) {
  if (page.theme === "round-recap") {
    pageBody.innerHTML = getRoundRecapMarkup(page);
    return;
  }

  if (page.theme === "round-mvp") {
    pageBody.innerHTML = getRoundMvpMarkup(page);
    return;
  }

  if (page.theme === "xp-round") {
    pageBody.innerHTML = getXpRoundMarkup(page);
    return;
  }

  if (page.theme === "badges-earned") {
    pageBody.innerHTML = getBadgesEarnedMarkup(page);
    return;
  }

  if (page.theme === "prediction-status") {
    pageBody.innerHTML = getPredictionStatusMarkup(page);
    return;
  }

  if (page.theme === "share-recap") {
    pageBody.innerHTML = getShareRecapMarkup(page);
    return;
  }

  pageBody.innerHTML = getDefaultPageMarkup(page);
}

function getRoundRecapMarkup(page) {
  const avatarsMarkup = (page.crowdAvatars || [])
    .map((avatar, index) => `<img src="${avatar}" alt="fan ${index + 1}">`)
    .join("");

  const peopleBlock = avatarsMarkup
    ? `
      <div class="page-round-recap__people">
        ${avatarsMarkup}
      </div>
    `
    : "";

  return `
    <div class="page-round-recap">
      <img src="imgs/page-1/element-1.png" class="page1-shape page1-shape--red" alt="">
      <img src="imgs/page-1/element-3.png" class="page1-shape page1-shape--blue-spikes" alt="">
      <img src="imgs/page-1/element-2.png" class="page1-shape page1-shape--green-spikes" alt="">

      <div class="page-round-recap__user">
        <div class="page-round-recap__user-avatar">
          <img src="${page.user.avatar}" alt="${page.user.name}">
        </div>
        <div class="page-round-recap__user-name">${page.user.name}</div>
      </div>

      <p class="page-round-recap__intro">${page.intro}</p>
      <h1 class="page-round-recap__title">${page.title}</h1>
      <p class="page-round-recap__round">${page.roundLabel}</p>
      <p class="page-round-recap__subtext">${page.subtext}</p>

      ${peopleBlock}

      <div class="page-round-recap__footer">
        <img src="${page.footerLogo}" alt="World Cup badge" class="page-round-recap__badge">
      </div>
    </div>
  `;
}

function getDefaultPageMarkup(page) {
  const topBlock = page.user
    ? `
      <div class="page-default__user">
        <div class="page-default__avatar">
          <img src="${page.user.avatar}" alt="${page.user.name}">
        </div>
        <div class="page-default__username">${page.user.name}</div>
      </div>
    `
    : `
      <div class="page-default__country">
        <img class="page-default__flag" src="${page.flag}" alt="${page.country} flag">
        <span>${page.country}</span>
      </div>
    `;

  const scoreGroupClass =
    page.showBadges === false
      ? "page-default__score-group page-default__score-group--solo"
      : "page-default__score-group";

  const badgesMarkup =
    page.showBadges === false
      ? ""
      : `
        <div class="page-default__badges">
          <div class="page-default__badge page-default__badge--yellow">${page.yellow}</div>
          <div class="page-default__badge page-default__badge--red">${page.red}</div>
        </div>
      `;

  const decorMarkup = page.decorImage
    ? `
      <img
        src="${page.decorImage}"
        class="page-default__decor page-default__decor--left-spikes"
        alt=""
      >
    `
    : "";

  return `
    <div class="page-default">
      ${decorMarkup}
      ${topBlock}

      <h1 class="page-default__title">${page.title}</h1>

      <div class="${scoreGroupClass}">
        <div class="page-default__score">${page.score}</div>
        ${badgesMarkup}
      </div>

      <p class="page-default__players">${page.players}</p>
    </div>
  `;
}

function getRoundMvpMarkup(page) {
  return `
    <div class="page-round-mvp">
      <div class="page-round-mvp__country">
        <img class="page-round-mvp__flag" src="${page.flag}" alt="${page.country} flag">
        <span>${page.country}</span>
      </div>

      <h1 class="page-round-mvp__title">${page.title}</h1>

      <img src="${page.playerImage}" class="page-round-mvp__player" alt="${page.verticalName}">
      <img src="${page.bottomSpikes}" class="page-round-mvp__spikes" alt="">
      <div class="page-round-mvp__vertical-name">${page.verticalName}</div>
    </div>
  `;
}

function getXpRoundMarkup(page) {
  return `
    <div class="page-xp-round">
      <div class="page-xp-round__user">
        <div class="page-xp-round__avatar">
          <img src="${page.user.avatar}" alt="${page.user.name}">
        </div>
        <div class="page-xp-round__username">${page.user.name}</div>
      </div>

      <h1 class="page-xp-round__title">${page.title}</h1>

      <img src="${page.spikesImage}" class="page-xp-round__spikes" alt="">
      <img src="${page.characterImage}" class="page-xp-round__character" alt="${page.user.name}">
      <img src="${page.badgeImage}" class="page-xp-round__badge" alt="">

      <p class="page-xp-round__bottom-text">${page.bottomText}</p>
    </div>
  `;
}

function getBadgesEarnedMarkup(page) {
  return `
    <div class="page-badges-earned">
      <div class="page-badges-earned__user">
        <div class="page-badges-earned__avatar">
          <img src="${page.user.avatar}" alt="${page.user.name}">
        </div>
        <div class="page-badges-earned__username">${page.user.name}</div>
      </div>

      <h1 class="page-badges-earned__title">${page.title}</h1>

      <img src="${page.spikesImage}" class="page-badges-earned__spikes" alt="">

      <div class="page-badges-earned__grid">
        <div class="page-badges-earned__item page-badges-earned__item--left">
          <img
            src="${page.badgeLeftImage}"
            class="page-badges-earned__badge page-badges-earned__badge--left"
            alt="${page.badgeLeftTitle}"
          >
          <div class="page-badges-earned__label">
            <strong>${page.badgeLeftTitle}</strong><br>
            ${page.badgeLeftText}
          </div>
        </div>

        <div class="page-badges-earned__item page-badges-earned__item--right">
          <img
            src="${page.badgeRightImage}"
            class="page-badges-earned__badge page-badges-earned__badge--right"
            alt="${page.badgeRightTitle}"
          >
          <div class="page-badges-earned__label">
            <strong>${page.badgeRightTitle}</strong><br>
            ${page.badgeRightText}
          </div>
        </div>

        <div class="page-badges-earned__item page-badges-earned__item--bottom">
          <img
            src="${page.badgeBottomImage}"
            class="page-badges-earned__badge page-badges-earned__badge--bottom"
            alt="${page.badgeBottomTitle}"
          >
          <div class="page-badges-earned__label">
            <strong>${page.badgeBottomTitle}</strong><br>
            ${page.badgeBottomText}
          </div>
        </div>
      </div>
    </div>
  `;
}

function getPredictionStatusMarkup(page) {
  return `
    <div class="page-prediction-status">
      <img src="${page.decorImage}" class="page-prediction-status__decor" alt="">

      <div class="page-prediction-status__user">
        <div class="page-prediction-status__avatar">
          <img src="${page.user.avatar}" alt="${page.user.name}">
        </div>
        <div class="page-prediction-status__username">${page.user.name}</div>
      </div>

      <h1 class="page-prediction-status__title">${page.title}</h1>

      <p class="page-prediction-status__metric-label">${page.metricLabel}</p>

      <div class="page-prediction-status__main-metric">
        <span class="page-prediction-status__main-value">${page.mainValue}</span>
        <span class="page-prediction-status__main-suffix">${page.mainSuffix}</span>
      </div>

      <div class="page-prediction-status__stats">
        <div class="page-prediction-status__stat">
          <div class="page-prediction-status__stat-label">${page.stat1Label}</div>
          <div class="page-prediction-status__stat-value">${page.stat1Value}</div>
        </div>

        <div class="page-prediction-status__stat">
          <div class="page-prediction-status__stat-label">${page.stat2Label}</div>
          <div class="page-prediction-status__stat-value">${page.stat2Value}</div>
        </div>

        <div class="page-prediction-status__stat">
          <div class="page-prediction-status__stat-label">${page.stat3Label}</div>
          <div class="page-prediction-status__stat-value">${page.stat3Value}</div>
        </div>
      </div>
    </div>
  `;
}

function getShareRecapMarkup(page) {
  return `
    <div class="page-share-recap">
      <p class="page-share-recap__intro">${page.intro}</p>

      <img src="${page.backgroundDecor}" class="page-share-recap__decor" alt="">
      <img src="${page.cardImage}" class="page-share-recap__card" alt="Week recap card">

      <button class="page-share-recap__button" type="button">
        ${page.buttonLabel}
      </button>
    </div>
  `;
}

function renderProgress(activeIndex) {
  storyProgress.innerHTML = "";

  pages.forEach((_, index) => {
    const item = document.createElement("div");
    item.className = "story-progress__item";

    const fill = document.createElement("div");
    fill.className = "story-progress__fill";

    if (index < activeIndex) {
      item.classList.add("is-complete");
    }

    if (index === activeIndex) {
      item.classList.add("is-active");
    }

    item.appendChild(fill);
    storyProgress.appendChild(item);
  });
}

function goToPage(index) {
  if (index < 0 || index >= pages.length) return;
  currentPage = index;
  renderPage(currentPage);
}

function goNext() {
  if (currentPage < pages.length - 1) {
    goToPage(currentPage + 1);
  }
}

function goPrevious() {
  if (currentPage > 0) {
    goToPage(currentPage - 1);
  }
}

function showEntryScreen() {
  if (!entryScreen) {
    showStoryScreen();
    return;
  }

  entryScreen.classList.remove("is-hidden");
  storyScreen.classList.add("is-hidden");
}

function showStoryScreen() {
  if (entryScreen) {
    entryScreen.classList.add("is-hidden");
  }

  storyScreen.classList.remove("is-hidden");
  renderPage(currentPage);
}

function handleClose() {
  if (ENABLE_APP_ENTRY && entryScreen) {
    showEntryScreen();
    return;
  }

  storyScreen.classList.add("is-hidden");
}

tapRight.addEventListener("click", goNext);
tapLeft.addEventListener("click", goPrevious);

if (entryTap) {
  entryTap.addEventListener("click", showStoryScreen);
}

if (closeBtn) {
  closeBtn.addEventListener("click", handleClose);
}

if (ENABLE_APP_ENTRY && entryScreen) {
  showEntryScreen();
} else {
  showStoryScreen();
}