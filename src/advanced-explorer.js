
import "./advanced-explorer.css";

(() => {
  const robotList = document.querySelector("#robotList");
  const componentList = document.querySelector("#componentList");
  const componentPanel = document.querySelector("#componentInfoPanel");

  if (!robotList || !componentList || !componentPanel) return;

  const categoryIcons = {
    Sensor: "◉",
    Motor: "⚙",
    "Control System": "⌘",
    "Motor Controller": "▤",
    "Power Supply": "⚡",
    Navigation: "◎",
    "Electronic Module": "▦",
    Communication: "⌁",
  };

  const getCategory = (name) => {
    const data = window.roboMindComponentInfo?.[name];
    return data?.category || "Other";
  };

  const getImage = (name) => {
    return window.roboMindComponentImages?.[name] || "";
  };

  // Add a premium category summary to the explorer.
  function createSummary() {
    const panel = document.querySelector(".component-list-panel");

    if (!panel || document.querySelector("#advancedCategorySummary")) {
      return;
    }

    const summary = document.createElement("div");
    summary.id = "advancedCategorySummary";
    summary.className = "advanced-category-summary";

    const description = document.querySelector("#selectedRobotDescription");

    if (description) {
      description.insertAdjacentElement("afterend", summary);
    } else {
      panel.prepend(summary);
    }
  }

  function updateSummary() {
    createSummary();

    const summary = document.querySelector("#advancedCategorySummary");
    if (!summary) return;

    const buttons = [...componentList.querySelectorAll(".component-button")];

    const counts = {};

    buttons.forEach((button) => {
      const category = button.dataset.category || "Other";
      counts[category] = (counts[category] || 0) + 1;
    });

    const categories = Object.entries(counts);

    summary.innerHTML = `
      <div class="advanced-summary-heading">
        <span>PROJECT BREAKDOWN</span>
        <strong>${buttons.length} Components</strong>
      </div>

      <div class="advanced-category-grid">
        ${categories.map(([category, count]) => `
          <div class="advanced-category-card">
            <span class="advanced-category-icon">
              ${categoryIcons[category] || "◇"}
            </span>
            <div>
              <strong>${count}</strong>
              <small>${category}</small>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // Upgrade the existing component buttons without changing their
  // click behavior or data attributes.
  function upgradeComponentCards() {
    const buttons = componentList.querySelectorAll(".component-button");

    buttons.forEach((button) => {
      if (button.dataset.advanced === "true") return;

      const name = button.dataset.component;
      if (!name) return;

      const category = getCategory(name);
      const image = getImage(name);

      button.dataset.category = category;
      button.dataset.advanced = "true";

      button.classList.add("advanced-component-card");

      button.innerHTML = `
        <span class="advanced-component-image">
          ${image
            ? `<img src="${image}" alt="${name}" loading="lazy"
                onerror="this.style.display='none';this.parentElement.classList.add('no-image')">`
            : `<span class="advanced-image-placeholder">◇</span>`
          }
        </span>

        <span class="advanced-component-text">
          <strong>${name}</strong>
          <small>${category}</small>
        </span>

        <span class="advanced-component-arrow">→</span>
      `;
    });

    updateSummary();
  }

  // Improve the details panel after the original application
  // displays component information.
  function upgradeDetails() {
    const details = componentPanel.querySelector(".component-details");
    if (!details) return;

    details.classList.add("advanced-details");

    const image = details.querySelector(".details-artwork");

    if (image) {
      image.classList.add("advanced-details-image");
    }

    const heading = details.querySelector("h2");
    if (heading) {
      heading.classList.add("advanced-details-title");
    }

    details.querySelectorAll(".detail-item").forEach((item) => {
      item.classList.add("advanced-detail-card");
    });
  }

  // Watch the original application as it changes robot/component content.
  const explorerObserver = new MutationObserver(() => {
    upgradeComponentCards();
    upgradeDetails();
  });

  explorerObserver.observe(componentList, {
    childList: true,
    subtree: true,
  });

  const detailsObserver = new MutationObserver(() => {
    upgradeDetails();
  });

  detailsObserver.observe(componentPanel, {
    childList: true,
    subtree: true,
  });

  // When a robot is selected, upgrade its newly rendered components.
  robotList.addEventListener("click", () => {
    requestAnimationFrame(() => {
      upgradeComponentCards();
      upgradeDetails();
    });
  });

  // Keep category counts and selected styles synchronized.
  componentList.addEventListener("click", () => {
    requestAnimationFrame(upgradeDetails);
  });

  // Initial setup.
  upgradeComponentCards();
  upgradeDetails();
})();
