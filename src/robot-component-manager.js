
import "./auth.css";

// ==========================================
// ROBOMIND AI — ROBOT COMPONENT MANAGER
// Add, search, assign and remove components
// ==========================================

const MANAGER_STYLE_ID = "robot-component-manager-styles";

function getAdminData() {
  return window.roboMindAdminData || null;
}

function getRobots() {
  return getAdminData()?.getRobots() || [];
}

function getComponents() {
  return getAdminData()?.getComponentInfo() || {};
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
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

// ==========================================
// TOAST
// ==========================================

function showManagerToast(message) {
  let toast = document.querySelector(".robomind-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "robomind-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(showManagerToast.timer);

  showManagerToast.timer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2600);
}

// ==========================================
// STYLES
// ==========================================

function addManagerStyles() {
  if (document.getElementById(MANAGER_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = MANAGER_STYLE_ID;

  style.textContent = `
    .robot-assignment-panel {
      background: #ffffff;
      border: 1px solid #dedbd4;
      border-radius: 14px;
      padding: 24px;
      margin: 20px 0;
    }

    .robot-assignment-heading {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    .robot-assignment-heading h3 {
      margin: 5px 0;
      color: #171717;
      font-size: 21px;
    }

    .robot-assignment-heading p {
      margin: 5px 0;
      color: #777672;
      font-size: 13px;
    }

    .robot-assignment-count {
      color: #304ffe;
      font-size: 13px;
      font-weight: 700;
    }

    .robot-assignment-search,
    .robot-new-component-form input,
    .robot-new-component-form textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 14px;
      border: 1px solid #dedbd4;
      border-radius: 8px;
      background: #faf9f6;
      color: #171717;
      font: inherit;
      outline: none;
    }

    .robot-assignment-search {
      margin-bottom: 16px;
    }

    .robot-assignment-search:focus,
    .robot-new-component-form input:focus,
    .robot-new-component-form textarea:focus {
      border-color: #304ffe;
    }

    .robot-assignment-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 10px;
      max-height: 360px;
      overflow-y: auto;
      padding: 2px;
    }

    .robot-assignment-item {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 13px;
      border: 1px solid #dedbd4;
      border-radius: 9px;
      background: #ffffff;
      cursor: pointer;
    }

    .robot-assignment-item:hover {
      border-color: #304ffe;
      background: #f7f8ff;
    }

    .robot-assignment-item:has(input:checked) {
      border-color: #304ffe;
      background: #f1f3ff;
    }

    .robot-assignment-item input {
      width: 17px;
      height: 17px;
      accent-color: #304ffe;
      flex-shrink: 0;
      cursor: pointer;
    }

    .robot-assignment-item span {
      color: #171717;
      font-size: 13px;
      font-weight: 600;
    }

    .robot-assignment-empty {
      grid-column: 1 / -1;
      color: #777672;
      padding: 20px;
      text-align: center;
    }

    .robot-assignment-actions {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 20px;
    }

    .robot-assignment-actions button,
    .robot-assignment-manage {
      border: 0;
      border-radius: 8px;
      padding: 12px 17px;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .robot-assignment-save,
    .robot-new-component-save {
      background: #304ffe;
      color: #ffffff;
    }

    .robot-assignment-save:hover,
    .robot-new-component-save:hover {
      background: #203bd2;
    }

    .robot-assignment-cancel {
      background: #f0eee9;
      color: #171717;
    }

    .robot-assignment-manage {
      background: #f1f3ff;
      color: #304ffe;
      border: 1px solid #dce1ff;
      padding: 9px 12px;
    }

    .robot-assignment-manage:hover {
      background: #e7eaff;
    }

    .robot-add-component-toggle {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      margin: 0 0 18px;
      padding: 11px 15px;
      border: 1px solid #dce1ff;
      border-radius: 8px;
      background: #f1f3ff;
      color: #304ffe;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .robot-add-component-toggle:hover {
      background: #e7eaff;
    }

    .robot-new-component-form {
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid #dedbd4;
      border-radius: 10px;
      background: #faf9f6;
    }

    .robot-new-component-form h4 {
      margin: 0 0 18px;
      font-size: 17px;
      color: #171717;
    }

    .robot-new-component-form label {
      display: block;
      margin: 14px 0 7px;
      color: #171717;
      font-size: 13px;
      font-weight: 700;
    }

    .robot-new-component-form textarea {
      min-height: 80px;
      resize: vertical;
    }

    .robot-new-component-form .robot-new-component-save {
      margin-top: 17px;
      padding: 12px 18px;
      border: 0;
      border-radius: 8px;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .robot-new-component-cancel {
      margin: 17px 0 0 8px;
      padding: 12px 18px;
      border: 0;
      border-radius: 8px;
      background: #f0eee9;
      color: #171717;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .robot-assignment-panel button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;

  document.head.appendChild(style);
}

// ==========================================
// ASSIGNMENT PANEL
// ==========================================

function showRobotComponentManager(robotId) {
  const robot = getRobots().find((item) => item.id === robotId);

  if (!robot) {
    showManagerToast("Robot not found.");
    return;
  }

  const content = document.getElementById("admin-content");

  if (!content) return;

  let panel = document.getElementById("robot-assignment-panel");

  if (!panel) {
    panel = document.createElement("section");
    panel.id = "robot-assignment-panel";
    panel.className = "robot-assignment-panel";

    const grid = content.querySelector(".admin-content-grid");

    if (grid) {
      grid.parentNode.insertBefore(panel, grid);
    } else {
      content.appendChild(panel);
    }
  }

  renderAssignmentPanel(panel, robotId);
}

// ==========================================
// RENDER ASSIGNMENT PANEL
// ==========================================

function renderAssignmentPanel(panel, robotId) {
  const robot = getRobots().find((item) => item.id === robotId);

  if (!robot) return;

  const components = Object.keys(getComponents()).sort((a, b) =>
    a.localeCompare(b)
  );

  const assigned = new Set(robot.components || []);

  panel.innerHTML = `
    <div class="robot-assignment-heading">
      <div>
        <span class="auth-eyebrow">COMPONENT ASSIGNMENT</span>
        <h3>${escapeHTML(robot.name)}</h3>
        <p>Add new components or update this robot's existing assignments.</p>
      </div>

      <span class="robot-assignment-count" id="assignment-count">
        ${assigned.size} assigned
      </span>
    </div>

    <button
      type="button"
      class="robot-add-component-toggle"
      id="show-new-component-form"
    >
      + Add New Component
    </button>

    <div id="new-component-form-container"></div>

    <input
      type="search"
      id="assignment-search"
      class="robot-assignment-search"
      placeholder="Search components..."
      aria-label="Search components"
    >

    <div class="robot-assignment-list" id="assignment-list">
      ${
        components.length
          ? components.map((name) => `
            <label
              class="robot-assignment-item"
              data-component-name="${escapeHTML(name.toLowerCase())}"
            >
              <input
                type="checkbox"
                value="${escapeHTML(name)}"
                ${assigned.has(name) ? "checked" : ""}
              >
              <span>${escapeHTML(name)}</span>
            </label>
          `).join("")
          : `
            <p class="robot-assignment-empty">
              No components available. Add your first component above.
            </p>
          `
      }
    </div>

    <div class="robot-assignment-actions">
      <button
        type="button"
        class="robot-assignment-cancel"
        id="cancel-robot-assignment"
      >
        Cancel
      </button>

      <button
        type="button"
        class="robot-assignment-save"
        id="save-robot-assignment"
      >
        Save Assignments
      </button>
    </div>
  `;

  setupAssignmentEvents(panel, robotId);
}

// ==========================================
// ASSIGNMENT EVENTS
// ==========================================

function setupAssignmentEvents(panel, robotId) {
  const search = panel.querySelector("#assignment-search");
  const list = panel.querySelector("#assignment-list");
  const count = panel.querySelector("#assignment-count");

  function updateCount() {
    const selected = list.querySelectorAll(
      "input[type='checkbox']:checked"
    );

    count.textContent = `${selected.length} assigned`;
  }

  list.addEventListener("change", updateCount);

  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();

    list.querySelectorAll(".robot-assignment-item").forEach((item) => {
      const name = item.dataset.componentName || "";
      item.hidden = !name.includes(query);
    });
  });

  panel.querySelector("#show-new-component-form")
    .addEventListener("click", () => {
      showNewComponentForm(panel, robotId);
    });

  panel.querySelector("#cancel-robot-assignment")
    .addEventListener("click", () => {
      panel.remove();
    });

  panel.querySelector("#save-robot-assignment")
    .addEventListener("click", () => {
      saveRobotAssignments(panel, robotId);
    });
}

// ==========================================
// ADD NEW COMPONENT FORM
// ==========================================

function showNewComponentForm(panel, robotId) {
  const container = panel.querySelector(
    "#new-component-form-container"
  );

  if (!container) return;

  container.innerHTML = `
    <form class="robot-new-component-form" id="new-component-form">

      <h4>Create New Electronic Component</h4>

      <label for="new-component-name">Component Name *</label>
      <input
        id="new-component-name"
        name="name"
        type="text"
        placeholder="Example: LiDAR Sensor"
        required
      >

      <label for="new-component-category">Category *</label>
      <input
        id="new-component-category"
        name="category"
        type="text"
        placeholder="Example: Sensors"
        required
      >

      <label for="new-component-description">Description</label>
      <textarea
        id="new-component-description"
        name="description"
        placeholder="Describe this component..."
      ></textarea>

      <label for="new-component-working">Working Principle</label>
      <textarea
        id="new-component-working"
        name="working"
        placeholder="Explain how this component works..."
      ></textarea>

      <label for="new-component-specifications">Specifications</label>
      <textarea
        id="new-component-specifications"
        name="specifications"
        placeholder="Enter technical specifications..."
      ></textarea>

      <label for="new-component-applications">Applications</label>
      <textarea
        id="new-component-applications"
        name="applications"
        placeholder="Where is this component used?"
      ></textarea>

      <label for="new-component-image">Image URL (optional)</label>
      <input
        id="new-component-image"
        name="image"
        type="url"
        placeholder="https://example.com/component.jpg"
      >

      <button
        type="submit"
        class="robot-new-component-save"
      >
        Create and Assign Component
      </button>

      <button
        type="button"
        class="robot-new-component-cancel"
        id="cancel-new-component"
      >
        Cancel
      </button>

    </form>
  `;

  const form = container.querySelector("#new-component-form");

  container.querySelector("#cancel-new-component")
    .addEventListener("click", () => {
      container.innerHTML = "";
    });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Creating...";

    try {
      const formData = new FormData(form);

      const name = String(formData.get("name") || "").trim();

      const info = {
        category: String(formData.get("category") || "").trim(),
        description: String(formData.get("description") || "").trim(),
        working: String(formData.get("working") || "").trim(),
        specifications: String(formData.get("specifications") || "").trim(),
        applications: String(formData.get("applications") || "").trim()
      };

      const image = String(formData.get("image") || "").trim();

      if (!name || !info.category) {
        throw new Error("Component name and category are required.");
      }

      const api = getAdminData();

      if (!api?.addComponent) {
        throw new Error("Component management is unavailable.");
      }

      // Create the component in the application database.
      api.addComponent(name, info, image);

      // Assign the new component to the selected robot.
      const robot = getRobots().find(
        (item) => item.id === robotId
      );

      if (!robot) {
        throw new Error("Component created, but robot was not found.");
      }

      const updatedAssignments = [
        ...(robot.components || []),
        name
      ];

      api.updateRobot(robotId, {
        components: updatedAssignments
      });

      showManagerToast(
        `${name} created and assigned to ${robot.name}.`
      );

      // Refresh the assignment list with the new component selected.
      renderAssignmentPanel(panel, robotId);

    } catch (error) {
      console.error("Component creation failed:", error);

      showManagerToast(
        error.message || "Could not create component."
      );

      submitButton.disabled = false;
      submitButton.textContent = "Create and Assign Component";
    }
  });
}

// ==========================================
// SAVE ROBOT ASSIGNMENTS
// ==========================================

function saveRobotAssignments(panel, robotId) {
  const saveButton = panel.querySelector("#save-robot-assignment");

  try {
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    const list = panel.querySelector("#assignment-list");

    const selectedComponents = [
      ...list.querySelectorAll("input[type='checkbox']:checked")
    ].map((input) => input.value);

    getAdminData().updateRobot(robotId, {
      components: selectedComponents
    });

    const robot = getRobots().find(
      (item) => item.id === robotId
    );

    showManagerToast(
      `${selectedComponents.length} components saved for ${robot?.name || "robot"}.`
    );

    panel.remove();

    // Update the component count on the robot card.
    updateRobotCardCount(robotId);

  } catch (error) {
    console.error("Assignment save failed:", error);

    showManagerToast(
      error.message || "Could not save assignments."
    );

    saveButton.disabled = false;
    saveButton.textContent = "Save Assignments";
  }
}

// ==========================================
// UPDATE ROBOT CARD COUNT
// ==========================================

function updateRobotCardCount(robotId) {
  const adminScreen = document.getElementById("admin-screen");

  if (!adminScreen) return;

  const card = [...adminScreen.querySelectorAll(".admin-content-card")]
    .find((item) => {
      return item.querySelector(
        `[data-manage-robot-components="${CSS.escape(robotId)}"]`
      );
    });

  if (!card) return;

  const robot = getRobots().find(
    (item) => item.id === robotId
  );

  const label = card.querySelector(".admin-content-label");

  if (label && robot) {
    label.textContent =
      `${(robot.components || []).length} COMPONENTS`;
  }
}

// ==========================================
// ADD MANAGE BUTTONS TO ROBOT CARDS
// ==========================================

function addManageButtons() {
  const adminScreen = document.getElementById("admin-screen");

  if (!adminScreen) return;

  const cards = adminScreen.querySelectorAll(".admin-content-card");

  cards.forEach((card) => {
    const editButton = card.querySelector("[data-edit-robot]");

    if (!editButton) return;

    const robotId = editButton.dataset.editRobot;
    const actions = card.querySelector(".admin-content-actions");

    if (
      !actions ||
      actions.querySelector("[data-manage-robot-components]")
    ) {
      return;
    }

    const button = document.createElement("button");

    button.type = "button";
    button.className = "robot-assignment-manage";
    button.textContent = "Manage Components";
    button.dataset.manageRobotComponents = robotId;

    actions.insertBefore(button, editButton);
  });
}

// ==========================================
// EVENT HANDLING
// ==========================================

document.addEventListener("click", (event) => {
  const button = event.target.closest(
    "[data-manage-robot-components]"
  );

  if (!button) return;

  const adminScreen = document.getElementById("admin-screen");

  if (!adminScreen || !adminScreen.contains(button)) return;

  showRobotComponentManager(
    button.dataset.manageRobotComponents
  );
});

// ==========================================
// OBSERVE ADMIN DASHBOARD
// ==========================================

function initializeRobotComponentManager() {
  addManagerStyles();

  const observer = new MutationObserver(() => {
    if (
      document.getElementById("admin-screen") &&
      document.querySelector(".admin-content-grid")
    ) {
      addManageButtons();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  addManageButtons();
}

initializeRobotComponentManager();

console.log("RoboMind AI component manager initialized.");
