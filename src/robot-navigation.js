
import "./sidebar.css";

const robotNavigation = {
  activeComponents: [],
  activeRobotName: "",
  sidebarObserver: null,

  // ================================================
  // GET PAGE ELEMENTS
  // ================================================

  getElements() {
    return {
      robotList: document.querySelector("#robotList"),
      componentList: document.querySelector("#componentList"),
      searchInput: document.querySelector("#searchInput"),
      categoryFilter: document.querySelector("#categoryFilter"),
      searchResults: document.querySelector("#searchResults"),
      resultCount: document.querySelector("#resultCount"),
      searchSection: document.querySelector("#component-search"),
      infoPanel: document.querySelector("#componentInfoPanel"),
      header: document.querySelector(".header"),
      nav: document.querySelector(".header nav"),
    };
  },

  // ================================================
  // CREATE SIDEBAR
  // ================================================

  createSidebar() {
    const { header, nav } = this.getElements();

    if (!header || !nav) return;

    header.classList.add("sidebar");

    // Avoid creating the sidebar controls twice.
    if (header.querySelector(".sidebar-top")) return;

    const logo = header.querySelector(".logo");

    if (!logo) return;

    // Create the sidebar top area.
    const topArea = document.createElement("div");
    topArea.className = "sidebar-top";

    // Create the vertical three-dot button.
    const toggle = document.createElement("button");

    toggle.type = "button";
    toggle.className = "sidebar-toggle";

    toggle.setAttribute("aria-label", "Collapse sidebar");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("title", "Collapse sidebar");

    toggle.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;

    // Move the existing logo into the top area.
    topArea.appendChild(logo);
    topArea.appendChild(toggle);

    header.prepend(topArea);

    // Add an accessible label to the navigation.
    nav.setAttribute("aria-label", "Main navigation");

    // Start with an expanded sidebar.
    document.body.classList.remove("sidebar-collapsed");

    // Toggle sidebar.
    toggle.addEventListener("click", () => {
      this.toggleSidebar();
    });

    // Prepare navigation links.
    this.prepareNavigationLinks();

    // Watch for links added later by dashboard.js
    // or other feature modules.
    this.observeNavigation();

    // Update the selected navigation link.
    this.updateActiveNavigation();

    window.addEventListener("hashchange", () => {
      this.updateActiveNavigation();
    });
  },

  // ================================================
  // COLLAPSE / EXPAND SIDEBAR
  // ================================================

  toggleSidebar() {
    const toggle = document.querySelector(".sidebar-toggle");

    if (!toggle) return;

    const collapsed = document.body.classList.toggle(
      "sidebar-collapsed"
    );

    toggle.setAttribute("aria-expanded", String(!collapsed));

    toggle.setAttribute(
      "aria-label",
      collapsed ? "Expand sidebar" : "Collapse sidebar"
    );

    toggle.setAttribute(
      "title",
      collapsed ? "Expand sidebar" : "Collapse sidebar"
    );
  },

  // ================================================
  // PREPARE NAVIGATION LINKS
  // ================================================

  prepareNavigationLinks() {
    const { nav } = this.getElements();

    if (!nav) return;

    nav.querySelectorAll("a").forEach((link) => {
      const label = link.textContent.trim();

      if (!label) return;

      // Save the label for collapsed sidebar tooltips.
      link.dataset.label = label;

      // Avoid wrapping an existing label twice.
      if (link.querySelector("span")) return;

      const labelSpan = document.createElement("span");
      labelSpan.textContent = label;

      link.textContent = "";
      link.appendChild(labelSpan);
    });
  },

  // ================================================
  // OBSERVE DYNAMIC NAVIGATION LINKS
  // ================================================

  observeNavigation() {
    const { nav } = this.getElements();

    if (!nav || this.sidebarObserver) return;

    this.sidebarObserver = new MutationObserver(() => {
      this.prepareNavigationLinks();
      this.updateActiveNavigation();
    });

    this.sidebarObserver.observe(nav, {
      childList: true,
      subtree: true,
    });
  },

  // ================================================
  // ACTIVE NAVIGATION
  // ================================================

  updateActiveNavigation() {
    const { nav } = this.getElements();

    if (!nav) return;

    const currentHash = window.location.hash || "#home";

    nav.querySelectorAll("a").forEach((link) => {
      const isActive =
        link.getAttribute("href") === currentHash;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  },

  // ================================================
  // FILTER COMPONENT GALLERY
  // ================================================

  filterGallery() {
    const elements = this.getElements();

    if (!elements.searchResults) return;

    const cards =
      elements.searchResults.querySelectorAll(".search-card");

    let visibleCount = 0;

    cards.forEach((card) => {
      const matches = this.activeComponents.includes(
        card.dataset.component
      );

      card.hidden = !matches;

      if (matches) {
        visibleCount++;
      }
    });

    if (elements.resultCount) {
      elements.resultCount.textContent =
        `${visibleCount} components available for ${this.activeRobotName}`;
    }
  },

  // ================================================
  // OPEN ROBOT
  // ================================================

  openRobot(robotCard) {
    const elements = this.getElements();

    this.activeRobotName =
      robotCard.querySelector("h3")?.textContent ||
      "Selected Robot";

    this.activeComponents = Array.from(
      elements.componentList?.querySelectorAll(
        ".component-button"
      ) || []
    ).map((button) => button.dataset.component);

    if (!this.activeComponents.length) return;

    if (elements.searchInput) {
      elements.searchInput.value = "";

      elements.searchInput.dispatchEvent(
        new Event("input", { bubbles: true })
      );
    }

    if (elements.categoryFilter) {
      elements.categoryFilter.value = "All";

      elements.categoryFilter.dispatchEvent(
        new Event("change", { bubbles: true })
      );
    }

    requestAnimationFrame(() => {
      this.filterGallery();

      elements.searchSection?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  },

  // ================================================
  // SHOW COMPONENT DETAILS
  // ================================================

  showComponentDetails(componentName) {
    const elements = this.getElements();

    const componentButton = Array.from(
      elements.componentList?.querySelectorAll(
        ".component-button"
      ) || []
    ).find(
      (button) =>
        button.dataset.component === componentName
    );

    if (componentButton) {
      componentButton.click();

      elements.infoPanel?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  },

  // ================================================
  // INITIALIZE NAVIGATION
  // ================================================

  init() {
    // Build the sidebar.
    this.createSidebar();

    // Robot card clicks.
    document.addEventListener("click", (event) => {
      const robotCard = event.target.closest(".robot-card");

      if (robotCard) {
        requestAnimationFrame(() => {
          this.openRobot(robotCard);
        });
      }
    });

    // Component gallery clicks.
    document.addEventListener(
      "click",
      (event) => {
        const componentCard =
          event.target.closest(".search-card");

        if (!componentCard || !this.activeComponents.length) {
          return;
        }

        const componentName = componentCard.dataset.component;

        if (!this.activeComponents.includes(componentName)) {
          return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        this.showComponentDetails(componentName);
      },
      true
    );

    // Search input changes.
    const elements = this.getElements();

    elements.searchInput?.addEventListener("input", () => {
      if (!this.activeComponents.length) return;

      requestAnimationFrame(() => {
        this.filterGallery();
      });
    });

    // Category filter changes.
    elements.categoryFilter?.addEventListener("change", () => {
      if (!this.activeComponents.length) return;

      requestAnimationFrame(() => {
        this.filterGallery();
      });
    });
  },
};

// ================================================
// START APPLICATION NAVIGATION
// ================================================

robotNavigation.init();
