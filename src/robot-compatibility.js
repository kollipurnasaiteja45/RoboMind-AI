
import "./robot-compatibility.css";

// ==========================================
// ROBOMIND AI - ROBOT COMPATIBILITY CHECKER
// ==========================================

const robots = window.roboMindRobots || [];
const componentInfo = window.roboMindComponentInfo || {};

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

function initializeCompatibilityChecker() {
  const gallery = document.querySelector("#component-search");

  if (!gallery) {
    console.error("Component Gallery section was not found.");
    return;
  }

  if (document.querySelector("#robot-compatibility")) return;

  const robotOptions = robots.map((robot) => `
    <option value="${escapeHTML(robot.id)}">
      ${escapeHTML(robot.name)}
    </option>
  `).join("");

  const categories = [
    ...new Set(
      Object.values(componentInfo)
        .map((component) => component.category)
        .filter(Boolean)
    )
  ].sort();

  const categoryOptions = categories.map((category) => `
    <option value="${escapeHTML(category)}">
      ${escapeHTML(category)}
    </option>
  `).join("");

  const section = document.createElement("section");

  section.className = "section compatibility-section";
  section.id = "robot-compatibility";

  section.innerHTML = `
    <div class="compatibility-container">

      <div class="compatibility-heading">
        <span class="compatibility-label">SMART ROBOTICS TOOL</span>
        <h2>Robot Compatibility Checker</h2>
        <p>
          Check whether a component is already included in a robot's
          component list and explore its technical information.
        </p>
      </div>

      <div class="compatibility-card">

        <div class="compatibility-card-heading">
          <div class="compatibility-icon">⚙️</div>
          <div>
            <h3>Check Component</h3>
            <p>Select a robot and a component to begin.</p>
          </div>
        </div>

        <div class="compatibility-form">

          <div class="compatibility-field">
            <label for="compatRobot">Select Robot</label>
            <select id="compatRobot">
              <option value="">Choose a robot</option>
              ${robotOptions}
            </select>
          </div>

          <div class="compatibility-field">
            <label for="compatCategory">Component Category</label>
            <select id="compatCategory">
              <option value="">Choose a category</option>
              ${categoryOptions}
            </select>
          </div>

          <div class="compatibility-field">
            <label for="compatComponent">Select Component</label>
            <select id="compatComponent" disabled>
              <option value="">Choose a component</option>
            </select>
          </div>

          <button type="button" id="checkCompatibilityBtn"
            class="compatibility-button">
            Check Compatibility
            <span>→</span>
          </button>

        </div>

        <div id="compatibilityResult"
          class="compatibility-result"
          aria-live="polite">
          <div class="compatibility-empty">
            <span>🔍</span>
            <h3>Ready to check?</h3>
            <p>
              Select a robot, category and component to see the result.
            </p>
          </div>
        </div>

      </div>

      <div class="compatibility-note">
        <span>ⓘ</span>
        <p>
          <strong>Important:</strong> This checker compares components
          against the component lists stored in RoboMind AI. It does not
          certify physical or electrical compatibility. Always verify
          voltage, current, interfaces, dimensions, drivers and
          manufacturer specifications before selecting hardware.
        </p>
      </div>

    </div>
  `;

  gallery.insertAdjacentElement("afterend", section);

  // ==========================================
  // NAVIGATION LINK
  // ==========================================

  const nav = document.querySelector(".header nav");

  if (nav && !nav.querySelector('[href="#robot-compatibility"]')) {
    const navLink = document.createElement("a");

    navLink.href = "#robot-compatibility";
    navLink.textContent = "Compatibility";

    nav.appendChild(navLink);
  }

  // ==========================================
  // ELEMENTS
  // ==========================================

  const robotSelect = document.querySelector("#compatRobot");
  const categorySelect = document.querySelector("#compatCategory");
  const componentSelect = document.querySelector("#compatComponent");
  const checkButton = document.querySelector("#checkCompatibilityBtn");
  const resultPanel = document.querySelector("#compatibilityResult");

  // ==========================================
  // COMPONENT DROPDOWN
  // ==========================================

  function updateComponents() {
    const selectedCategory = categorySelect.value;

    const matchingComponents = Object.keys(componentInfo)
      .filter((name) => {
        return componentInfo[name].category === selectedCategory;
      })
      .sort();

    componentSelect.innerHTML = `
      <option value="">Choose a component</option>
      ${matchingComponents.map((name) => `
        <option value="${escapeHTML(name)}">
          ${escapeHTML(name)}
        </option>
      `).join("")}
    `;

    componentSelect.disabled = matchingComponents.length === 0;

    resultPanel.innerHTML = `
      <div class="compatibility-empty">
        <span>🔍</span>
        <h3>Ready to check?</h3>
        <p>Select a component and click Check Compatibility.</p>
      </div>
    `;
  }

  categorySelect.addEventListener("change", updateComponents);

  // ==========================================
  // COMPATIBILITY CHECK
  // ==========================================

  function checkCompatibility() {
    const robotId = robotSelect.value;
    const category = categorySelect.value;
    const componentName = componentSelect.value;

    if (!robotId || !category || !componentName) {
      resultPanel.innerHTML = `
        <div class="compatibility-validation">
          Please select a robot, category and component first.
        </div>
      `;
      return;
    }

    const selectedRobot = robots.find(
      (robot) => robot.id === robotId
    );

    const selectedComponent = componentInfo[componentName];

    if (!selectedRobot || !selectedComponent) {
      resultPanel.innerHTML = `
        <div class="compatibility-validation">
          Unable to find the selected robot or component.
        </div>
      `;
      return;
    }

    const isListed = selectedRobot.components.some(
      (name) => name.toLowerCase() === componentName.toLowerCase()
    );

    const statusClass = isListed ? "status-listed" : "status-not-listed";
    const statusTitle = isListed
      ? "Already listed in this robot"
      : "Not currently listed for this robot";

    const statusDescription = isListed
      ? `${componentName} is included in the component list for ${selectedRobot.name}.`
      : `${componentName} is not currently included in the component list for ${selectedRobot.name}.`;

    const applications = Array.isArray(selectedComponent.applications)
      ? selectedComponent.applications.join(", ")
      : selectedComponent.applications || "Not available";

    resultPanel.innerHTML = `
      <div class="compatibility-result-content">

        <div class="compatibility-status ${statusClass}">
          <span class="status-icon">${isListed ? "✓" : "!"}</span>
          <div>
            <h3>${statusTitle}</h3>
            <p>${escapeHTML(statusDescription)}</p>
          </div>
        </div>

        <div class="compatibility-details">
          <div class="compatibility-detail-header">
            <div>
              <span>COMPONENT INFORMATION</span>
              <h3>${escapeHTML(componentName)}</h3>
            </div>
            <span class="component-category">
              ${escapeHTML(selectedComponent.category || "Component")}
            </span>
          </div>

          <div class="compatibility-detail-grid">

            <div class="compatibility-detail-item">
              <span>Selected Robot</span>
              <strong>${escapeHTML(selectedRobot.name)}</strong>
            </div>

            <div class="compatibility-detail-item">
              <span>Component Category</span>
              <strong>${escapeHTML(selectedComponent.category || "N/A")}</strong>
            </div>

          </div>

          <div class="compatibility-description">
            <h4>Description</h4>
            <p>${escapeHTML(selectedComponent.description || "No description available.")}</p>
          </div>

          <div class="compatibility-description">
            <h4>Applications</h4>
            <p>${escapeHTML(applications)}</p>
          </div>

          <button type="button" class="view-component-button"
            id="viewCompatibilityComponent">
            View in Component Gallery →
          </button>

        </div>

      </div>
    `;

    const viewButton = document.querySelector("#viewCompatibilityComponent");

    viewButton.addEventListener("click", () => {
      const searchInput = document.querySelector("#searchInput");

      if (searchInput) {
        searchInput.value = componentName;
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      }

      document.querySelector("#component-search")?.scrollIntoView({
        behavior: "smooth"
      });
    });
  }

  checkButton.addEventListener("click", checkCompatibility);

  console.log("Robot Compatibility Checker loaded successfully.");
}

// ==========================================
// INITIALIZE
// ==========================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCompatibilityChecker);
} else {
  initializeCompatibilityChecker();
}
