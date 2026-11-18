
import "./dashboard.css";

const recentRobots = [];
const recentComponents = [];

const popularComponents = [
  "Flight Controller",
  "Brushless Motor",
  "Arduino",
  "ESP32",
  "Ultrasonic Sensor",
  "LiDAR Sensor"
];

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
}

// --------------------------------------------------
// PAGE NAVIGATION
// --------------------------------------------------

function setPageFromHash() {
  const dashboard = document.querySelector("#dashboard");
  const main = document.querySelector("#app main");

  if (!dashboard || !main) return;

  const isDashboard = window.location.hash === "#dashboard";

  if (isDashboard) {
    dashboard.style.display = "block";
    main.style.display = "none";
  } else {
    dashboard.style.display = "none";
    main.style.display = "";
  }

  document.querySelectorAll(".header nav a").forEach((link) => {
    const isActive =
      link.getAttribute("href") === window.location.hash ||
      (!window.location.hash && link.getAttribute("href") === "#home");

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  // Scroll to the selected section after changing pages.
  if (!isDashboard && window.location.hash) {
    const target = document.querySelector(window.location.hash);

    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    }
  } else if (isDashboard) {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}

window.addEventListener("hashchange", setPageFromHash);

// --------------------------------------------------
// RECENT ACTIVITY
// --------------------------------------------------

function addRecentItem(list, value) {
  if (!value) return;

  const existingIndex = list.indexOf(value);

  if (existingIndex !== -1) {
    list.splice(existingIndex, 1);
  }

  list.unshift(value);

  if (list.length > 4) {
    list.pop();
  }
}

function getRobotCount() {
  return document.querySelectorAll(".robot-card").length;
}

function getComponentCount() {
  return document.querySelectorAll(".search-card").length;
}

function renderRecentRobots() {
  const container = document.querySelector("#dashboardRecentRobots");

  if (!container) return;

  if (recentRobots.length === 0) {
    container.innerHTML = `
      <div class="dashboard-empty">
        <span>🤖</span>
        <p>Your recently explored robots will appear here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = recentRobots.map((robotName) => {
    const robotCard = [...document.querySelectorAll(".robot-card")]
      .find((card) =>
        card.querySelector("h3")?.textContent.trim() === robotName
      );

    const emoji =
      robotCard?.querySelector(".robot-emoji")?.textContent || "🤖";

    return `
      <button
        class="dashboard-recent-item"
        type="button"
        data-robot-name="${escapeHTML(robotName)}"
      >
        <span class="dashboard-recent-icon">${escapeHTML(emoji)}</span>
        <span>${escapeHTML(robotName)}</span>
        <span class="dashboard-arrow">→</span>
      </button>
    `;
  }).join("");
}

function renderRecentComponents() {
  const container = document.querySelector("#dashboardRecentComponents");

  if (!container) return;

  if (recentComponents.length === 0) {
    container.innerHTML = `
      <div class="dashboard-empty">
        <span>🔧</span>
        <p>Your recently viewed components will appear here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = recentComponents.map((componentName) => `
    <button
      class="dashboard-recent-item"
      type="button"
      data-component-name="${escapeHTML(componentName)}"
    >
      <span class="dashboard-recent-icon">⚙️</span>
      <span>${escapeHTML(componentName)}</span>
      <span class="dashboard-arrow">→</span>
    </button>
  `).join("");
}

function renderDashboardStats() {
  const robotCount = document.querySelector("#dashboardRobotCount");
  const componentCount = document.querySelector("#dashboardComponentCount");

  if (robotCount) {
    robotCount.textContent = getRobotCount();
  }

  if (componentCount) {
    componentCount.textContent = getComponentCount();
  }
}

function updateRecentCounts() {
  const robotRecentCount = document.querySelector(
    "#dashboardRobotRecentCount"
  );

  const componentRecentCount = document.querySelector(
    "#dashboardComponentRecentCount"
  );

  if (robotRecentCount) {
    robotRecentCount.textContent = recentRobots.length;
  }

  if (componentRecentCount) {
    componentRecentCount.textContent = recentComponents.length;
  }
}

// --------------------------------------------------
// CREATE DASHBOARD PAGE
// --------------------------------------------------

function createDashboard() {
  const header = document.querySelector(".header");
  const main = document.querySelector("#app main");

  if (
    !header ||
    !main ||
    document.querySelector("#dashboard")
  ) {
    return;
  }

  const dashboard = document.createElement("section");

  dashboard.id = "dashboard";
  dashboard.className = "dashboard-section";

  dashboard.innerHTML = `
    <div class="dashboard-container">

      <div class="dashboard-welcome">
        <div class="dashboard-welcome-content">

          <span class="dashboard-label">
            <span class="dashboard-status-dot"></span>
            ROBOMIND AI WORKSPACE
          </span>

          <h1>Welcome to Your Robotics Dashboard</h1>

          <p>
            Explore robotic systems, discover electronic components
            and expand your understanding of robotics technology.
          </p>

          <div class="dashboard-actions">
            <a href="#explore" class="dashboard-primary-button">
              Explore Robots <span>→</span>
            </a>

            <a href="#component-search" class="dashboard-secondary-button">
              Browse Components
            </a>
          </div>

        </div>

        <div class="dashboard-decoration" aria-hidden="true">
          <div class="dashboard-orbit orbit-one"></div>
          <div class="dashboard-orbit orbit-two"></div>
          <div class="dashboard-robot-symbol">🤖</div>
          <span class="dashboard-floating-icon floating-one">⚙️</span>
          <span class="dashboard-floating-icon floating-two">🛰️</span>
          <span class="dashboard-floating-icon floating-three">🔋</span>
        </div>
      </div>

      <div class="dashboard-stats">

        <div class="dashboard-stat-card">
          <div class="dashboard-stat-icon">🤖</div>
          <div>
            <p>Total Robots</p>
            <h2 id="dashboardRobotCount">0</h2>
            <span>Available robot models</span>
          </div>
        </div>

        <div class="dashboard-stat-card">
          <div class="dashboard-stat-icon">⚙️</div>
          <div>
            <p>Total Components</p>
            <h2 id="dashboardComponentCount">0</h2>
            <span>Explore the component library</span>
          </div>
        </div>

        <div class="dashboard-stat-card">
          <div class="dashboard-stat-icon">🔍</div>
          <div>
            <p>Recently Explored</p>
            <h2 id="dashboardRobotRecentCount">0</h2>
            <span>Robots you've visited</span>
          </div>
        </div>

        <div class="dashboard-stat-card">
          <div class="dashboard-stat-icon">📘</div>
          <div>
            <p>Components Viewed</p>
            <h2 id="dashboardComponentRecentCount">0</h2>
            <span>Components you've explored</span>
          </div>
        </div>

      </div>

      <div class="dashboard-section-heading">
        <div>
          <span class="dashboard-label">QUICK ACCESS</span>
          <h2>Explore RoboMind AI</h2>
          <p>Go directly to the tools and learning areas.</p>
        </div>
      </div>

      <div class="dashboard-quick-grid">

        <a href="#explore" class="dashboard-quick-card">
          <span class="dashboard-quick-icon">🤖</span>
          <h3>Robot Explorer</h3>
          <p>Discover different robots and their components.</p>
          <span class="dashboard-card-link">Explore robots →</span>
        </a>

        <a href="#component-search" class="dashboard-quick-card">
          <span class="dashboard-quick-icon">⚙️</span>
          <h3>Component Gallery</h3>
          <p>Search and learn about electronic components.</p>
          <span class="dashboard-card-link">Browse gallery →</span>
        </a>

        <a href="#component-search" class="dashboard-quick-card">
          <span class="dashboard-quick-icon">🔎</span>
          <h3>Component Search</h3>
          <p>Find components by name, category or application.</p>
          <span class="dashboard-card-link">Search components →</span>
        </a>

        <a href="#explore" class="dashboard-quick-card">
          <span class="dashboard-quick-icon">📚</span>
          <h3>Learning Workspace</h3>
          <p>Understand how robotic systems and components work.</p>
          <span class="dashboard-card-link">Start learning →</span>
        </a>

      </div>

      <div class="dashboard-two-column">

        <div class="dashboard-content-panel">
          <div class="dashboard-panel-heading">
            <div>
              <span class="dashboard-label">YOUR ACTIVITY</span>
              <h2>Recently Explored Robots</h2>
            </div>
            <a href="#explore">View all →</a>
          </div>

          <div
            id="dashboardRecentRobots"
            class="dashboard-recent-list"
          ></div>
        </div>

        <div class="dashboard-content-panel">
          <div class="dashboard-panel-heading">
            <div>
              <span class="dashboard-label">YOUR ACTIVITY</span>
              <h2>Recently Viewed Components</h2>
            </div>
            <a href="#component-search">View all →</a>
          </div>

          <div
            id="dashboardRecentComponents"
            class="dashboard-recent-list"
          ></div>
        </div>

      </div>

      <div class="dashboard-content-panel dashboard-popular-panel">
        <div class="dashboard-panel-heading">
          <div>
            <span class="dashboard-label">POPULAR COMPONENTS</span>
            <h2>Start Exploring Components</h2>
            <p>Quickly find some important robotics components.</p>
          </div>
        </div>

        <div class="dashboard-popular-list">
          ${popularComponents.map((component) => `
            <button
              type="button"
              class="dashboard-popular-chip"
              data-popular-component="${escapeHTML(component)}"
            >
              <span>⚙️</span>
              ${escapeHTML(component)}
              <span class="dashboard-chip-arrow">↗</span>
            </button>
          `).join("")}
        </div>
      </div>

      <div class="dashboard-bottom-banner">
        <div>
          <span class="dashboard-label">YOUR ROBOTICS JOURNEY</span>
          <h2>Learn. Explore. Innovate.</h2>
          <p>
            Build your robotics knowledge one component at a time.
          </p>
        </div>

        <a href="#explore" class="dashboard-primary-button">
          Get Started <span>→</span>
        </a>
      </div>

    </div>
  `;

  // Insert Dashboard separately from the existing Home page.
  header.after(dashboard);

  // Add Dashboard immediately after Home in the navigation.
  const nav = header.querySelector("nav");
  const homeLink = nav?.querySelector('a[href="#home"]');

  if (
    nav &&
    !nav.querySelector('a[href="#dashboard"]')
  ) {
    const dashboardLink = document.createElement("a");

    dashboardLink.href = "#dashboard";
    dashboardLink.textContent = "Dashboard";

    if (homeLink) {
      homeLink.after(dashboardLink);
    } else {
      nav.prepend(dashboardLink);
    }
  }

  renderDashboardStats();
  renderRecentRobots();
  renderRecentComponents();
  updateRecentCounts();

  // Set the correct page on first load.
  setPageFromHash();
}

// --------------------------------------------------
// OPEN ROBOTS AND COMPONENTS
// --------------------------------------------------

function openRobot(robotName) {
  const robotCard = [...document.querySelectorAll(".robot-card")]
    .find((card) =>
      card.querySelector("h3")?.textContent.trim() === robotName
    );

  if (!robotCard) return;

  // Return to Home before opening the robot.
  if (window.location.hash !== "#explore") {
    window.location.hash = "#explore";
  } else {
    setPageFromHash();
  }

  robotCard.click();
}

function openComponent(componentName) {
  const componentButton = [...document.querySelectorAll(".component-button")]
    .find((button) =>
      button.dataset.component === componentName
    );

  if (componentButton) {
    if (window.location.hash !== "#explore") {
      window.location.hash = "#explore";
    } else {
      setPageFromHash();
    }

    componentButton.click();
    return;
  }

  const searchInput = document.querySelector("#searchInput");

  if (searchInput) {
    if (window.location.hash !== "#component-search") {
      window.location.hash = "#component-search";
    } else {
      setPageFromHash();
    }

    searchInput.value = componentName;

    searchInput.dispatchEvent(
      new Event("input", { bubbles: true })
    );
  }
}

// --------------------------------------------------
// CLICK EVENTS
// --------------------------------------------------

document.addEventListener("click", (event) => {
  const robotCard = event.target.closest(".robot-card");

  if (robotCard) {
    const robotName =
      robotCard.querySelector("h3")?.textContent.trim();

    if (robotName) {
      addRecentItem(recentRobots, robotName);
      renderRecentRobots();
      updateRecentCounts();
    }
  }

  const componentButton = event.target.closest(".component-button");
  const searchCard = event.target.closest(".search-card");

  if (componentButton || searchCard) {
    const componentName = componentButton
      ? componentButton.dataset.component
      : searchCard.dataset.component;

    if (componentName) {
      addRecentItem(recentComponents, componentName);
      renderRecentComponents();
      updateRecentCounts();
    }
  }

  const recentRobotButton =
    event.target.closest("[data-robot-name]");

  if (recentRobotButton) {
    openRobot(recentRobotButton.dataset.robotName);
  }

  const recentComponentButton =
    event.target.closest("[data-component-name]");

  if (recentComponentButton) {
    openComponent(recentComponentButton.dataset.componentName);
  }

  const popularButton =
    event.target.closest("[data-popular-component]");

  if (popularButton) {
    openComponent(popularButton.dataset.popularComponent);
  }
});

// --------------------------------------------------
// WAIT FOR THE MAIN APPLICATION
// --------------------------------------------------

const dashboardObserver = new MutationObserver(() => {
  const app = document.querySelector("#app");
  const header = document.querySelector(".header");
  const main = document.querySelector("#app main");
  const robotCards = document.querySelectorAll(".robot-card");
  const searchResults = document.querySelector("#searchResults");

  if (
    app &&
    header &&
    main &&
    robotCards.length > 0 &&
    searchResults &&
    !document.querySelector("#dashboard")
  ) {
    createDashboard();
  }

  if (document.querySelector("#dashboard")) {
    dashboardObserver.disconnect();
  }
});

dashboardObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// Also check immediately in case the main application
// has already rendered.
createDashboard();
