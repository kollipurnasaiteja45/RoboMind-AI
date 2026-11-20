
import "./dashboard.css";

// ======================================================
// ROBOMIND AI — MAIN USER DASHBOARD
// Dashboard opens ONLY after login and explicit selection
// ======================================================

const recentRobots = [];
const recentComponents = [];

const popularComponents = [
  "Flight Controller",
  "Brushless Motor",
  "ESC",
  "LiPo Battery",
  "GPS Module",
  "Servo Motor",
  "Arduino",
  "DC Motor"
];

let dashboardInitialized = false;

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function isUserAuthenticated() {
  return document.body.classList.contains("robomind-authenticated");
}

function getRobotCards() {
  return [...document.querySelectorAll("#app .robot-card")];
}

function getRobotCount() {
  return getRobotCards().length;
}

function getComponentCount() {
  return document.querySelectorAll("#app .search-card").length;
}

function getRobotCard(robotName) {
  return getRobotCards().find(
    (card) => card.querySelector("h3")?.textContent.trim() === robotName
  );
}

// ======================================================
// NAVIGATION
// ======================================================

function setActiveSidebarLink(hash) {
  document.querySelectorAll(".dashboard-nav-link").forEach((link) => {
    const active = link.getAttribute("href") === hash;

    link.classList.toggle("active", active);

    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function closeDashboardSidebar() {
  const sidebar = document.querySelector("#dashboardSidebar");
  const backdrop = document.querySelector("#dashboardSidebarBackdrop");
  const toggle = document.querySelector("#dashboardMenuToggle");

  sidebar?.classList.remove("is-open");
  backdrop?.classList.remove("is-visible");
  toggle?.setAttribute("aria-expanded", "false");
}

function setPageFromHash() {
  const dashboard = document.querySelector("#dashboard");
  const main = document.querySelector("#app main");
  const header = document.querySelector("#app .header");
  const footer = document.querySelector("#app .footer");

  if (!dashboard || !main) return;

  let hash = window.location.hash;

  // Never allow a logged-out visitor to open the dashboard.
  if (hash === "#dashboard" && !isUserAuthenticated()) {
    dashboard.style.display = "none";
    main.style.display = "";
    if (header) header.style.display = "";
    if (footer) footer.style.display = "";

    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search + "#home"
    );

    setActiveSidebarLink("");
    return;
  }

  // IMPORTANT:
  // An empty hash is NOT converted into #dashboard.
  const isDashboard = hash === "#dashboard" && isUserAuthenticated();

  dashboard.style.display = isDashboard ? "flex" : "none";
  main.style.display = isDashboard ? "none" : "";

  if (header) {
    header.style.display = isDashboard ? "none" : "";
  }

  if (footer) {
    footer.style.display = isDashboard ? "none" : "";
  }

  setActiveSidebarLink(isDashboard ? "#dashboard" : hash);

  document.querySelectorAll("#app .header nav a").forEach((link) => {
    const active = link.getAttribute("href") === hash;

    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  closeDashboardSidebar();

  if (isDashboard) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  if (hash && hash !== "#home") {
    const targetId = hash.slice(1);
    const target = document.getElementById(targetId);

    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    }
  }
}

window.addEventListener("hashchange", setPageFromHash);

// ======================================================
// RECENT ACTIVITY
// ======================================================

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

function renderRecentRobots() {
  const container = document.querySelector("#dashboardRecentRobots");
  if (!container) return;

  if (recentRobots.length === 0) {
    container.innerHTML = `
      <div class="dashboard-empty">
        <span class="dashboard-empty-icon">🤖</span>
        <p>Robots you explore will appear here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = recentRobots.map((robotName) => {
    const robotCard = getRobotCard(robotName);
    const emoji = robotCard?.querySelector(".robot-emoji")?.textContent || "🤖";

    return `
      <button class="dashboard-recent-item"
        type="button"
        data-robot-name="${escapeHTML(robotName)}">
        <span class="dashboard-recent-icon">${escapeHTML(emoji)}</span>
        <span class="dashboard-recent-name">${escapeHTML(robotName)}</span>
        <span class="dashboard-arrow" aria-hidden="true">↗</span>
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
        <span class="dashboard-empty-icon">⚙️</span>
        <p>Components you view will appear here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = recentComponents.map((componentName) => `
    <button class="dashboard-recent-item"
      type="button"
      data-component-name="${escapeHTML(componentName)}">
      <span class="dashboard-recent-icon">⚙️</span>
      <span class="dashboard-recent-name">${escapeHTML(componentName)}</span>
      <span class="dashboard-arrow" aria-hidden="true">↗</span>
    </button>
  `).join("");
}

// ======================================================
// DASHBOARD STATISTICS
// ======================================================

function renderDashboardStats() {
  const robotCount = document.querySelector("#dashboardRobotCount");
  const componentCount = document.querySelector("#dashboardComponentCount");
  const robotRecentCount = document.querySelector("#dashboardRobotRecentCount");
  const componentRecentCount = document.querySelector("#dashboardComponentRecentCount");

  if (robotCount) robotCount.textContent = getRobotCount();
  if (componentCount) componentCount.textContent = getComponentCount();
  if (robotRecentCount) robotRecentCount.textContent = recentRobots.length;
  if (componentRecentCount) componentRecentCount.textContent = recentComponents.length;
}

function refreshDashboard() {
  renderDashboardStats();
  renderRecentRobots();
  renderRecentComponents();
}

// ======================================================
// OPEN ROBOT
// ======================================================

function openRobot(robotName) {
  const robotCard = getRobotCard(robotName);

  if (!robotCard) {
    console.warn("RoboMind: Robot not found:", robotName);
    return;
  }

  if (window.location.hash !== "#explore") {
    window.location.hash = "#explore";
  } else {
    setPageFromHash();
  }

  requestAnimationFrame(() => robotCard.click());
}

// ======================================================
// OPEN COMPONENT
// ======================================================

function openComponent(componentName) {
  if (!componentName) return;

  const componentButton = [
    ...document.querySelectorAll("#app .component-button")
  ].find((button) => button.dataset.component === componentName);

  if (componentButton) {
    if (window.location.hash !== "#explore") {
      window.location.hash = "#explore";
    } else {
      setPageFromHash();
    }

    requestAnimationFrame(() => componentButton.click());
    return;
  }

  const searchInput = document.querySelector("#searchInput");

  if (!searchInput) {
    console.warn("RoboMind: Component search input was not found.");
    return;
  }

  if (window.location.hash !== "#component-search") {
    window.location.hash = "#component-search";
  } else {
    setPageFromHash();
  }

  requestAnimationFrame(() => {
    searchInput.value = componentName;
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

// ======================================================
// DASHBOARD HTML
// ======================================================

function createDashboard() {
  const app = document.querySelector("#app");
  const header = document.querySelector("#app .header");
  const main = document.querySelector("#app main");

  if (!app || !header || !main) return;
  if (document.querySelector("#dashboard")) return;

  const dashboard = document.createElement("section");

  dashboard.id = "dashboard";
  dashboard.className = "dashboard-section";
  dashboard.style.display = "none";

  dashboard.innerHTML = `
    <aside class="dashboard-sidebar" id="dashboardSidebar">

      <a class="dashboard-brand" href="#dashboard"
        aria-label="RoboMind AI Dashboard">
        <span class="dashboard-brand-mark">R</span>
        <span class="dashboard-brand-copy">
          <strong>RoboMind<span> AI</span></strong>
          <small>ROBOTICS WORKSPACE</small>
        </span>
      </a>

      <div class="dashboard-sidebar-label">WORKSPACE</div>

      <nav class="dashboard-sidebar-nav" aria-label="Dashboard navigation">
        <a class="dashboard-nav-link" href="#dashboard">
          <span class="dashboard-nav-icon">▦</span>
          <span>Overview</span>
        </a>

        <a class="dashboard-nav-link" href="#explore">
          <span class="dashboard-nav-icon">⌘</span>
          <span>Robot Explorer</span>
        </a>

        <a class="dashboard-nav-link" href="#component-search">
          <span class="dashboard-nav-icon">◈</span>
          <span>Component Gallery</span>
        </a>
      </nav>

      <div class="dashboard-sidebar-bottom">
        <div class="dashboard-sidebar-note">
          <span class="dashboard-note-icon">✦</span>
          <strong>Keep exploring</strong>
          <p>Discover how robotics systems work, one component at a time.</p>
          <a href="#explore">Start learning <span>→</span></a>
        </div>

        <div class="dashboard-sidebar-footer">
          <span class="dashboard-online-dot"></span>
          Robotics learning workspace
        </div>
      </div>
    </aside>

    <div class="dashboard-main">

      <header class="dashboard-topbar">
        <div class="dashboard-topbar-left">
          <button class="dashboard-menu-toggle"
            id="dashboardMenuToggle"
            type="button"
            aria-label="Toggle dashboard menu"
            aria-expanded="false">☰</button>

          <div>
            <span class="dashboard-breadcrumb">WORKSPACE / OVERVIEW</span>
            <h1>Dashboard</h1>
          </div>
        </div>

        <div class="dashboard-topbar-right">
          <span class="dashboard-status-pill">
            <span class="dashboard-online-dot"></span>
            System ready
          </span>
          <div class="dashboard-avatar" aria-label="RoboMind user">RM</div>
        </div>
      </header>

      <div class="dashboard-content">

        <section class="dashboard-welcome">
          <div class="dashboard-welcome-content">
            <span class="dashboard-eyebrow">
              <span class="dashboard-eyebrow-line"></span>
              YOUR ROBOTICS WORKSPACE
            </span>

            <h2>Explore ideas.<br><span>Build intelligence.</span></h2>

            <p>
              Discover robotic systems, understand electronic components,
              and build your knowledge of modern robotics technology.
            </p>

            <div class="dashboard-actions">
              <a href="#explore" class="dashboard-primary-button">
                Explore robots <span>→</span>
              </a>
              <a href="#component-search" class="dashboard-secondary-button">
                Browse components
              </a>
            </div>
          </div>

          <div class="dashboard-hero-art" aria-hidden="true">
            <div class="dashboard-hero-ring ring-a"></div>
            <div class="dashboard-hero-ring ring-b"></div>
            <div class="dashboard-hero-core">🤖</div>
            <span class="dashboard-hero-chip chip-a">AI</span>
            <span class="dashboard-hero-chip chip-b">⚙</span>
            <span class="dashboard-hero-chip chip-c">⌁</span>
          </div>

          <div class="dashboard-hero-index">01 <span>/ EXPLORE</span></div>
        </section>

        <section class="dashboard-overview-section"
          aria-label="Workspace statistics">
          <div class="dashboard-section-title">
            <div>
              <span class="dashboard-kicker">AT A GLANCE</span>
              <h2>Your workspace</h2>
            </div>
            <span class="dashboard-section-caption">LIVE CONTENT COUNTS</span>
          </div>

          <div class="dashboard-stats">
            <article class="dashboard-stat-card">
              <span class="dashboard-stat-icon stat-blue">🤖</span>
              <div class="dashboard-stat-copy">
                <span>Total robots</span>
                <strong id="dashboardRobotCount">0</strong>
                <small>Available robot models</small>
              </div>
              <span class="dashboard-stat-index">01</span>
            </article>

            <article class="dashboard-stat-card">
              <span class="dashboard-stat-icon stat-ivory">⚙️</span>
              <div class="dashboard-stat-copy">
                <span>Total components</span>
                <strong id="dashboardComponentCount">0</strong>
                <small>In the component library</small>
              </div>
              <span class="dashboard-stat-index">02</span>
            </article>

            <article class="dashboard-stat-card">
              <span class="dashboard-stat-icon stat-ivory">↗</span>
              <div class="dashboard-stat-copy">
                <span>Robots explored</span>
                <strong id="dashboardRobotRecentCount">0</strong>
                <small>Your recent robot activity</small>
              </div>
              <span class="dashboard-stat-index">03</span>
            </article>

            <article class="dashboard-stat-card">
              <span class="dashboard-stat-icon stat-ivory">◈</span>
              <div class="dashboard-stat-copy">
                <span>Components viewed</span>
                <strong id="dashboardComponentRecentCount">0</strong>
                <small>Your recent component activity</small>
              </div>
              <span class="dashboard-stat-index">04</span>
            </article>
          </div>
        </section>

        <section class="dashboard-overview-section">
          <div class="dashboard-section-title">
            <div>
              <span class="dashboard-kicker">DISCOVER</span>
              <h2>Explore your tools</h2>
              <p>Jump straight into a learning area.</p>
            </div>
            <span class="dashboard-section-caption">QUICK ACCESS</span>
          </div>

          <div class="dashboard-quick-grid">
            <a href="#explore" class="dashboard-quick-card">
              <span class="dashboard-quick-top">
                <span>01 / ROBOTS</span><span>↗</span>
              </span>
              <span class="dashboard-quick-icon">🤖</span>
              <h3>Robot Explorer</h3>
              <p>Explore robot types and understand the components used in each system.</p>
              <span class="dashboard-card-link">Open explorer <b>→</b></span>
            </a>

            <a href="#component-search" class="dashboard-quick-card">
              <span class="dashboard-quick-top">
                <span>02 / COMPONENTS</span><span>↗</span>
              </span>
              <span class="dashboard-quick-icon">⚙️</span>
              <h3>Component Gallery</h3>
              <p>Browse electronic components, their functions, specifications and applications.</p>
              <span class="dashboard-card-link">Open gallery <b>→</b></span>
            </a>
          </div>
        </section>

        <section class="dashboard-overview-section">
          <div class="dashboard-section-title">
            <div>
              <span class="dashboard-kicker">YOUR ACTIVITY</span>
              <h2>Pick up where you left off</h2>
              <p>Your latest explorations in this session.</p>
            </div>
          </div>

          <div class="dashboard-activity-grid">
            <article class="dashboard-content-panel">
              <div class="dashboard-panel-heading">
                <div>
                  <span class="dashboard-panel-index">01</span>
                  <h3>Recently explored robots</h3>
                </div>
                <a href="#explore">View all ↗</a>
              </div>
              <div id="dashboardRecentRobots" class="dashboard-recent-list"></div>
            </article>

            <article class="dashboard-content-panel">
              <div class="dashboard-panel-heading">
                <div>
                  <span class="dashboard-panel-index">02</span>
                  <h3>Recently viewed components</h3>
                </div>
                <a href="#component-search">View all ↗</a>
              </div>
              <div id="dashboardRecentComponents" class="dashboard-recent-list"></div>
            </article>
          </div>
        </section>

        <section class="dashboard-overview-section">
          <div class="dashboard-section-title">
            <div>
              <span class="dashboard-kicker">POPULAR PICKS</span>
              <h2>Start with a component</h2>
              <p>Explore frequently used robotics components.</p>
            </div>
          </div>

          <div class="dashboard-popular-list">
            ${popularComponents.map((component) => `
              <button type="button"
                class="dashboard-popular-chip"
                data-popular-component="${escapeHTML(component)}">
                <span class="dashboard-popular-symbol">◈</span>
                ${escapeHTML(component)}
                <span class="dashboard-chip-arrow">↗</span>
              </button>
            `).join("")}
          </div>
        </section>

        <footer class="dashboard-footer">
          <span>
            ROBOMIND AI
            <span class="dashboard-footer-dot">•</span>
            LEARN. EXPLORE. INNOVATE.
          </span>
          <a href="#dashboard">Back to top ↑</a>
        </footer>

      </div>
    </div>

    <div class="dashboard-sidebar-backdrop"
      id="dashboardSidebarBackdrop"></div>
  `;

  header.after(dashboard);

  // Add a Dashboard link to the existing application navigation.
  const nav = header.querySelector("nav");
  const homeLink = nav?.querySelector('a[href="#home"]');

  if (nav && !nav.querySelector('a[href="#dashboard"]')) {
    const dashboardLink = document.createElement("a");
    dashboardLink.href = "#dashboard";
    dashboardLink.textContent = "Dashboard";

    if (homeLink) {
      homeLink.after(dashboardLink);
    } else {
      nav.prepend(dashboardLink);
    }
  }

  bindDashboardControls();
  refreshDashboard();

  // Do not set the URL hash here.
  // The user must explicitly choose Dashboard.
  setPageFromHash();

  dashboardInitialized = true;

  console.info("RoboMind AI Dashboard initialized.");
}

// ======================================================
// MOBILE SIDEBAR CONTROLS
// ======================================================

function bindDashboardControls() {
  const toggle = document.querySelector("#dashboardMenuToggle");
  const sidebar = document.querySelector("#dashboardSidebar");
  const backdrop = document.querySelector("#dashboardSidebarBackdrop");

  if (!toggle || !sidebar || !backdrop) return;

  toggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");

    backdrop.classList.toggle("is-visible", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  backdrop.addEventListener("click", closeDashboardSidebar);

  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDashboardSidebar);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDashboardSidebar();
  });
}

// ======================================================
// GLOBAL CLICK EVENTS
// ======================================================

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const robotCard = event.target.closest(".robot-card");

  if (robotCard) {
    const robotName = robotCard.querySelector("h3")?.textContent.trim();

    if (robotName) {
      addRecentItem(recentRobots, robotName);
      renderRecentRobots();
      renderDashboardStats();
    }
  }

  const componentButton = event.target.closest(".component-button");
  const searchCard = event.target.closest(".search-card");

  if (componentButton || searchCard) {
    const componentName = componentButton
      ? componentButton.dataset.component
      : searchCard?.dataset.component;

    if (componentName) {
      addRecentItem(recentComponents, componentName);
      renderRecentComponents();
      renderDashboardStats();
    }
  }

  const recentRobotButton = event.target.closest("[data-robot-name]");

  if (recentRobotButton) {
    openRobot(recentRobotButton.dataset.robotName);
    return;
  }

  const recentComponentButton = event.target.closest("[data-component-name]");

  if (recentComponentButton) {
    openComponent(recentComponentButton.dataset.componentName);
    return;
  }

  const popularButton = event.target.closest("[data-popular-component]");

  if (popularButton) {
    openComponent(popularButton.dataset.popularComponent);
  }
});

// ======================================================
// REFRESH AFTER ADMIN UPDATES
// ======================================================

window.addEventListener("robomind:data-updated", refreshDashboard);

// ======================================================
// INITIALIZATION
// ======================================================

function initializeDashboard() {
  if (dashboardInitialized) return;

  const app = document.querySelector("#app");
  const header = document.querySelector("#app .header");
  const main = document.querySelector("#app main");

  if (!app || !header || !main) return;

  // Wait for the robot cards created by main.js.
  if (getRobotCards().length === 0) return;

  createDashboard();
}

const dashboardObserver = new MutationObserver(() => {
  initializeDashboard();

  if (dashboardInitialized) {
    dashboardObserver.disconnect();
  }
});

dashboardObserver.observe(document.body, {
  childList: true,
  subtree: true
});

initializeDashboard();

console.info("RoboMind AI dashboard module loaded.");
