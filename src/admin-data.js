
// ==========================================
// ROBOMIND AI — ADMIN DATA MANAGEMENT
// Connects Admin Dashboard to the main app
// ==========================================

const STORAGE_KEY = "robomind_content_v1";

let imageDatabase = null;

// ==========================================
// 1. GET EXISTING APPLICATION DATA
// ==========================================

function getRobots() {
  return window.roboMindRobots || [];
}

function getComponentInfo() {
  return window.roboMindComponentInfo || {};
}

function getComponentImages() {
  return window.roboMindComponentImages || {};
}

// ==========================================
// 2. SAVE AND RESTORE DATA
// ==========================================

function saveContent() {
  try {
    const content = {
      robots: getRobots(),
      componentInfo: getComponentInfo(),
      componentImages: getComponentImages()
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(content)
    );

    return true;
  } catch (error) {
    console.error("Could not save RoboMind data:", error);
    return false;
  }
}

function restoreContent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    const content = JSON.parse(saved);

    if (
      !content ||
      !Array.isArray(content.robots) ||
      !content.componentInfo ||
      typeof content.componentInfo !== "object"
    ) {
      console.warn("Saved RoboMind data has an invalid format.");
      return;
    }

    const robots = getRobots();
    const componentInfo = getComponentInfo();
    const componentImages = getComponentImages();

    // Restore robots without replacing the original array.
    robots.splice(0, robots.length, ...content.robots);

    // Restore component information.
    Object.keys(componentInfo).forEach((name) => {
      delete componentInfo[name];
    });

    Object.assign(componentInfo, content.componentInfo);

    // Restore component images.
    Object.keys(componentImages).forEach((name) => {
      delete componentImages[name];
    });

    Object.assign(
      componentImages,
      content.componentImages || {}
    );

  } catch (error) {
    console.error("Could not restore RoboMind data:", error);
  }
}

// ==========================================
// 3. ESCAPE HTML
// ==========================================

function escapeHTML(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return entities[character];
    }
  );
}

// ==========================================
// 4. RENDER ROBOT CARDS
// ==========================================

function refreshRobotCards() {
  const robotList = document.getElementById("robotList");

  if (!robotList) return;

  robotList.innerHTML = "";

  getRobots().forEach((robot) => {
    const card = document.createElement("button");

    card.type = "button";
    card.className = "robot-card";
    card.dataset.robot = robot.id;

    const imageHTML = robot.image
      ? `
        <div class="admin-robot-image">
          <img
            src="${escapeHTML(robot.image)}"
            alt="${escapeHTML(robot.name)}"
            loading="lazy"
          >
        </div>
      `
      : "";

    card.innerHTML = `
      ${imageHTML}

      <span class="robot-emoji">
        ${escapeHTML(robot.emoji || "🤖")}
      </span>

      <h3>${escapeHTML(robot.name)}</h3>

      <p>${escapeHTML(robot.description)}</p>

      <span class="card-link">
        Explore Components →
      </span>
    `;

    robotList.appendChild(card);
  });
}

// ==========================================
// 5. RENDER COMPONENT GALLERY
// ==========================================

function refreshComponentGallery() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const searchResults = document.getElementById("searchResults");
  const resultCount = document.getElementById("resultCount");

  if (
    !searchInput ||
    !categoryFilter ||
    !searchResults ||
    !resultCount
  ) {
    return;
  }

  const componentInfo = getComponentInfo();
  const componentImages = getComponentImages();

  const searchText = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  const components = Object.entries(componentInfo).map(
    ([name, info]) => ({
      name,
      ...info
    })
  );

  const categories = [
    ...new Set(
      components.map((component) => component.category)
    )
  ].sort();

  // Update category options.
  const previousCategory = categoryFilter.value;

  categoryFilter.innerHTML = `
    <option value="All">All Categories</option>
    ${categories.map((category) => `
      <option value="${escapeHTML(category)}">
        ${escapeHTML(category)}
      </option>
    `).join("")}
  `;

  categoryFilter.value = categories.includes(previousCategory)
    ? previousCategory
    : "All";

  const activeCategory = categoryFilter.value;

  const filteredComponents = components.filter((component) => {
    const matchesSearch =
      component.name.toLowerCase().includes(searchText) ||
      String(component.category || "").toLowerCase().includes(searchText) ||
      String(component.description || "").toLowerCase().includes(searchText) ||
      String(component.applications || "").toLowerCase().includes(searchText);

    const matchesCategory =
      activeCategory === "All" ||
      component.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  resultCount.textContent =
    `${filteredComponents.length} component(s) found`;

  searchResults.innerHTML = "";

  if (filteredComponents.length === 0) {
    searchResults.innerHTML = `
      <div class="no-results">
        <span>🔎</span>
        <h3>No Components Found</h3>
        <p>
          Try another component name or select a different category.
        </p>
      </div>
    `;

    return;
  }

  filteredComponents.forEach((component) => {
    const card = document.createElement("button");

    card.type = "button";
    card.className = "search-card";
    card.dataset.component = component.name;

    const image = componentImages[component.name];

    card.innerHTML = `
      ${
        image
          ? `
            <div class="card-artwork">
              <img
                class="component-art"
                src="${escapeHTML(image)}"
                alt="${escapeHTML(component.name)}"
                loading="lazy"
              >
            </div>
          `
          : ""
      }

      <div class="search-card-content">

        <h3>${escapeHTML(component.name)}</h3>

        <span class="category-tag">
          ${escapeHTML(component.category)}
        </span>

        <p>${escapeHTML(component.description)}</p>

        <span class="card-link">
          View Details →
        </span>

      </div>
    `;

    searchResults.appendChild(card);
  });
}

// ==========================================
// 6. REFRESH ENTIRE APPLICATION
// ==========================================

function refreshApplication() {
  refreshRobotCards();

  refreshComponentGallery();

  const activeRobot = getRobots().find(
    (robot) =>
      robot.id === document.querySelector(".robot-card.active")?.dataset.robot
  );

  if (activeRobot) {
    const card = document.querySelector(
      `.robot-card[data-robot="${activeRobot.id}"]`
    );

    card?.click();
  } else if (getRobots().length > 0) {
    document
      .querySelector(`.robot-card[data-robot="${getRobots()[0].id}"]`)
      ?.click();
  }

  window.dispatchEvent(
    new CustomEvent("robomind:data-updated")
  );
}

// ==========================================
// 7. ROBOT MANAGEMENT
// ==========================================

function addRobot(robotData) {
  const robots = getRobots();

  const name = String(robotData.name || "").trim();

  if (!name) {
    throw new Error("Robot name is required.");
  }

  const id = String(
    robotData.id ||
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  );

  if (robots.some((robot) => robot.id === id)) {
    throw new Error("A robot with this ID already exists.");
  }

  robots.push({
    id,
    name,
    emoji: robotData.emoji || "🤖",
    description: robotData.description || "",
    components: Array.isArray(robotData.components)
      ? [...new Set(robotData.components)]
      : [],
    ...(robotData.image ? { image: robotData.image } : {})
  });

  saveContent();
  refreshApplication();

  return id;
}

function updateRobot(robotId, updates) {
  const robot = getRobots().find(
    (item) => item.id === robotId
  );

  if (!robot) {
    throw new Error("Robot not found.");
  }

  if (updates.name !== undefined) {
    const name = String(updates.name).trim();

    if (!name) {
      throw new Error("Robot name cannot be empty.");
    }

    robot.name = name;
  }

  if (updates.description !== undefined) {
    robot.description = String(updates.description);
  }

  if (updates.emoji !== undefined) {
    robot.emoji = String(updates.emoji);
  }

  if (updates.components !== undefined) {
    if (!Array.isArray(updates.components)) {
      throw new Error("Robot components must be a list.");
    }

    robot.components = [...new Set(updates.components)];
  }

  if (updates.image !== undefined) {
    robot.image = updates.image;
  }

  saveContent();
  refreshApplication();
}

function deleteRobot(robotId) {
  const robots = getRobots();

  const index = robots.findIndex(
    (robot) => robot.id === robotId
  );

  if (index === -1) {
    throw new Error("Robot not found.");
  }

  robots.splice(index, 1);

  saveContent();
  refreshApplication();
}

// ==========================================
// 8. COMPONENT MANAGEMENT
// ==========================================

function addComponent(name, info, image = "") {
  const componentName = String(name || "").trim();

  if (!componentName) {
    throw new Error("Component name is required.");
  }

  const componentInfo = getComponentInfo();

  if (componentInfo[componentName]) {
    throw new Error("This component already exists.");
  }

  componentInfo[componentName] = {
    category: String(info.category || "Other"),
    description: String(info.description || ""),
    working: String(info.working || ""),
    specifications: String(info.specifications || ""),
    applications: String(info.applications || "")
  };

  if (image) {
    getComponentImages()[componentName] = image;
  }

  saveContent();
  refreshApplication();
}

function updateComponent(name, updates) {
  const componentInfo = getComponentInfo();
  const info = componentInfo[name];

  if (!info) {
    throw new Error("Component not found.");
  }

  const allowedFields = [
    "category",
    "description",
    "working",
    "specifications",
    "applications"
  ];

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      info[field] = String(updates[field]);
    }
  });

  if (updates.image !== undefined) {
    if (updates.image) {
      getComponentImages()[name] = updates.image;
    } else {
      delete getComponentImages()[name];
    }
  }

  saveContent();
  refreshApplication();
}

function deleteComponent(name) {
  const componentInfo = getComponentInfo();

  if (!componentInfo[name]) {
    throw new Error("Component not found.");
  }

  delete componentInfo[name];
  delete getComponentImages()[name];

  // Remove this component from every robot.
  getRobots().forEach((robot) => {
    robot.components = robot.components.filter(
      (component) => component !== name
    );
  });

  saveContent();
  refreshApplication();
}

// ==========================================
// 9. IMAGE DATABASE — INDEXEDDB
// ==========================================

function openImageDatabase() {
  if (imageDatabase) {
    return Promise.resolve(imageDatabase);
  }

  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not supported by this browser."));
      return;
    }

    const request = indexedDB.open("RoboMindImages", 1);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains("images")) {
        database.createObjectStore("images");
      }
    };

    request.onsuccess = () => {
      imageDatabase = request.result;
      resolve(imageDatabase);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function saveUploadedImage(imageId, file) {
  if (!(file instanceof Blob)) {
    throw new Error("Please select a valid image file.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are supported.");
  }

  if (file.size > 3 * 1024 * 1024) {
    throw new Error("Please choose an image smaller than 3 MB.");
  }

  const database = await openImageDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      "images",
      "readwrite"
    );

    transaction.objectStore("images").put(file, imageId);

    transaction.oncomplete = () => resolve(imageId);
    transaction.onerror = () => reject(transaction.error);
  });
}

async function getUploadedImage(imageId) {
  const database = await openImageDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      "images",
      "readonly"
    );

    const request = transaction
      .objectStore("images")
      .get(imageId);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => reject(request.error);
  });
}

async function deleteUploadedImage(imageId) {
  const database = await openImageDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      "images",
      "readwrite"
    );

    transaction.objectStore("images").delete(imageId);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// ==========================================
// 10. INITIALIZE
// ==========================================

restoreContent();

// Make the management functions available
// to the Admin Dashboard module.

window.roboMindAdminData = {
  getRobots,
  getComponentInfo,
  getComponentImages,

  saveContent,
  refreshApplication,

  addRobot,
  updateRobot,
  deleteRobot,

  addComponent,
  updateComponent,
  deleteComponent,

  saveUploadedImage,
  getUploadedImage,
  deleteUploadedImage
};

console.log("RoboMind Admin Data module initialized.");
