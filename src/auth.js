
import "./auth.css";
import "./robot-component-manager.js";

// ==========================================
// ROBOMIND AI — AUTHENTICATION & ADMIN
// ==========================================

const USERS_KEY = "robomind_demo_users";
const SESSION_KEY = "robomind_demo_session";

const ADMIN_EMAIL = "admin@robomind.ai";
const ADMIN_PASSWORD = "RoboAdmin123!";

const app = document.getElementById("app");

let authScreen = null;
let accountBar = null;
let adminScreen = null;
let activeAdminSection = "overview";

const imageURLCache = new Map();

// ==========================================
// ADMIN DATA API
// ==========================================

function getAdminData() {
  return window.roboMindAdminData || null;
}

function getRobots() {
  return getAdminData()?.getRobots() || [];
}

function getComponents() {
  return getAdminData()?.getComponentInfo() || {};
}

function getComponentImages() {
  return getAdminData()?.getComponentImages() || {};
}

// ==========================================
// STORAGE
// ==========================================

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function saveSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ==========================================
// HTML ESCAPING
// ==========================================

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
// IMAGE HELPERS
// ==========================================

// Image references beginning with "idb:" are stored in IndexedDB.
// Ordinary HTTP/HTTPS URLs continue to work.

function isStoredImage(reference) {
  return String(reference || "").startsWith("idb:");
}

function getImageKey(reference) {
  return String(reference || "").slice(4);
}

function imageMarkup(reference, alt, fallback = "🖼️") {
  if (!reference) {
    return `<span class="admin-image-fallback">${escapeHTML(fallback)}</span>`;
  }

  if (isStoredImage(reference)) {
    return `
      <img
        data-image-ref="${escapeHTML(reference)}"
        alt="${escapeHTML(alt)}"
        class="admin-uploaded-image"
      >
    `;
  }

  return `
    <img
      src="${escapeHTML(reference)}"
      alt="${escapeHTML(alt)}"
      class="admin-uploaded-image"
    >
  `;
}

async function hydrateAdminImages(root = adminScreen) {
  if (!root) return;

  const images = root.querySelectorAll("[data-image-ref]");

  for (const image of images) {
    const reference = image.dataset.imageRef;

    if (!reference || !isStoredImage(reference)) continue;

    const key = getImageKey(reference);

    try {
      let objectURL = imageURLCache.get(key);

      if (!objectURL) {
        const blob = await getAdminData().getUploadedImage(key);

        if (!blob) continue;

        objectURL = URL.createObjectURL(blob);
        imageURLCache.set(key, objectURL);
      }

      image.src = objectURL;
    } catch (error) {
      console.error("Could not load stored image:", error);
    }
  }
}

function validateImage(file) {
  if (!file) return "Please select an image.";

  if (!file.type.startsWith("image/")) {
    return "Please select a valid image file.";
  }

  if (file.size > 3 * 1024 * 1024) {
    return "Image size must be 3 MB or less.";
  }

  return null;
}

function setupImagePreview(input, preview, existingReference, fallback) {
  if (!input || !preview) return;

  if (existingReference) {
    preview.innerHTML = imageMarkup(
      existingReference,
      "Current image",
      fallback
    );

    hydrateAdminImages(preview);
  } else {
    preview.innerHTML = `
      <span class="admin-image-fallback">
        ${escapeHTML(fallback)}
      </span>
    `;
  }

  input.addEventListener("change", () => {
    const file = input.files?.[0];

    if (!file) return;

    const error = validateImage(file);

    if (error) {
      input.value = "";
      showToast(error);
      return;
    }

    const previewURL = URL.createObjectURL(file);

    preview.innerHTML = `
      <img
        src="${previewURL}"
        alt="Selected image preview"
        class="admin-uploaded-image"
      >
    `;
  });
}

async function saveImageUpload(file, key) {
  if (!file) return null;

  const error = validateImage(file);

  if (error) {
    throw new Error(error);
  }

  const api = getAdminData();

  if (!api?.saveUploadedImage) {
    throw new Error("Image storage is not available.");
  }

  await api.saveUploadedImage(key, file);

  return `idb:${key}`;
}

// ==========================================
// AUTH SCREEN
// ==========================================

function createAuthScreen() {
  authScreen = document.createElement("section");
  authScreen.className = "auth-screen";
  authScreen.id = "auth-screen";

  document.body.appendChild(authScreen);

  renderAuthForm("login");
}

function renderAuthForm(mode) {
  const isRegister = mode === "register";

  authScreen.innerHTML = `
    <div class="auth-layout">

      <section class="auth-intro">

        <div class="auth-brand">
          <span class="auth-brand-icon">R</span>
          <span>RoboMind <strong>AI</strong></span>
        </div>

        <div class="auth-intro-content">

          <span class="auth-eyebrow">THE WORLD OF ROBOTICS</span>

          <h1>
            Discover.<br>
            Learn.<br>
            <span>Build the Future.</span>
          </h1>

          <p>
            Explore robotics, understand electronic components,
            and develop your knowledge with RoboMind AI.
          </p>

          <div class="auth-feature-list">
            <div><span>01</span> Explore different robots</div>
            <div><span>02</span> Understand electronic components</div>
            <div><span>03</span> Learn robotics technology</div>
          </div>

        </div>

        <p class="auth-footer-note">
          © 2026 RoboMind AI · Robotics Learning Platform
        </p>

      </section>

      <section class="auth-form-side">

        <div class="auth-form-container">

          <div class="auth-mobile-brand">
            <span class="auth-brand-icon">R</span>
            <span>RoboMind <strong>AI</strong></span>
          </div>

          <span class="auth-eyebrow">
            ${isRegister ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}
          </span>

          <h2>
            ${isRegister ? "Join RoboMind AI" : "Sign in to your account"}
          </h2>

          <p class="auth-description">
            ${
              isRegister
                ? "Create an account to start exploring robotics."
                : "Enter your details to continue your learning journey."
            }
          </p>

          <div class="auth-tabs">

            <button
              type="button"
              class="auth-tab ${!isRegister ? "active" : ""}"
              data-mode="login"
            >Login</button>

            <button
              type="button"
              class="auth-tab ${isRegister ? "active" : ""}"
              data-mode="register"
            >Register</button>

          </div>

          <form id="auth-form" class="auth-form">

            ${
              isRegister
                ? `
                  <label for="auth-name">Full name</label>
                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    autocomplete="name"
                    required
                  >
                `
                : ""
            }

            <label for="auth-email">Email address</label>

            <input
              id="auth-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autocomplete="email"
              required
            >

            <label for="auth-password">Password</label>

            <input
              id="auth-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autocomplete="${isRegister ? "new-password" : "current-password"}"
              minlength="${isRegister ? "6" : "1"}"
              required
            >

            ${
              isRegister
                ? `
                  <label for="auth-confirm-password">Confirm password</label>
                  <input
                    id="auth-confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    minlength="6"
                    required
                  >
                `
                : ""
            }

            <p class="auth-message" id="auth-message" aria-live="polite"></p>

            <button type="submit" class="auth-submit">
              ${isRegister ? "Create Account" : "Login to RoboMind"}
              <span>→</span>
            </button>

          </form>

          <p class="auth-switch-text">
            ${
              isRegister
                ? "Already have an account?"
                : "Don't have an account?"
            }

            <button
              type="button"
              class="auth-switch-button"
              data-mode="${isRegister ? "login" : "register"}"
            >
              ${isRegister ? "Login here" : "Create account"}
            </button>
          </p>

        </div>

      </section>

    </div>
  `;

  authScreen.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      renderAuthForm(button.dataset.mode);
    });
  });

  document
    .getElementById("auth-form")
    .addEventListener("submit", handleAuthSubmit);
}

function showAuthMessage(message, type) {
  const element = document.getElementById("auth-message");

  if (!element) return;

  element.textContent = message;
  element.className = `auth-message ${type}`;
}

// ==========================================
// LOGIN AND REGISTRATION
// ==========================================

function handleAuthSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const email = String(formData.get("email")).trim().toLowerCase();
  const password = String(formData.get("password"));
  const name = String(formData.get("name") || "").trim();
  const confirmPassword = String(formData.get("confirmPassword") || "");

  const isRegister = Boolean(formData.get("name"));

  if (isRegister) {
    if (!name) {
      showAuthMessage("Please enter your name.", "error");
      return;
    }

    if (password.length < 6) {
      showAuthMessage("Password must contain at least 6 characters.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showAuthMessage("Passwords do not match.", "error");
      return;
    }

    if (email === ADMIN_EMAIL) {
      showAuthMessage("This email is reserved for the administrator.", "error");
      return;
    }

    const users = getUsers();

    if (users.some((user) => user.email === email)) {
      showAuthMessage("An account with this email already exists.", "error");
      return;
    }

    users.push({
      id: Date.now().toString(),
      name,
      email,
      password,
      role: "user",
      createdAt: new Date().toISOString()
    });

    saveUsers(users);

    showAuthMessage("Account created successfully! Please log in.", "success");

    setTimeout(() => renderAuthForm("login"), 900);

    return;
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const admin = {
      id: "robomind-admin",
      name: "Administrator",
      email: ADMIN_EMAIL,
      role: "admin"
    };

    saveSession(admin);
    showApp(admin);
    return;
  }

  const user = getUsers().find(
    (item) => item.email === email && item.password === password
  );

  if (!user) {
    showAuthMessage("Incorrect email or password. Please try again.", "error");
    return;
  }

  const loggedInUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: "user"
  };

  saveSession(loggedInUser);
  showApp(loggedInUser);
}

// ==========================================
// ACCOUNT BAR
// ==========================================

function createAccountBar(user) {
  accountBar?.remove();

  accountBar = document.createElement("div");
  accountBar.className = "account-bar";

  accountBar.innerHTML = `
    <div class="account-user">

      <div class="account-avatar">
        ${escapeHTML(user.name.charAt(0).toUpperCase())}
      </div>

      <div class="account-details">
        <strong>${escapeHTML(user.name)}</strong>
        <span>${user.role === "admin" ? "Administrator" : "User"}</span>
      </div>

    </div>

    ${
      user.role === "admin"
        ? `
          <button class="account-admin-button" id="open-admin" type="button">
            <span>▦</span> Admin Dashboard
          </button>
        `
        : ""
    }

    <button class="account-logout" id="logout-button" type="button">
      <span>↪</span> Logout
    </button>
  `;

  document.body.appendChild(accountBar);

  document.getElementById("logout-button").addEventListener("click", logout);

  document.getElementById("open-admin")
    ?.addEventListener("click", openAdminDashboard);
}

function showApp(user) {
  if (!user || !app) return;

  authScreen?.remove();
  authScreen = null;

  adminScreen?.remove();
  adminScreen = null;

  document.body.classList.add("robomind-authenticated");

  createAccountBar(user);

  showToast(
    user.role === "admin"
      ? "Welcome, Administrator."
      : `Welcome to RoboMind AI, ${user.name}.`
  );
}

function logout() {
  clearSession();

  accountBar?.remove();
  adminScreen?.remove();

  accountBar = null;
  adminScreen = null;

  document.body.classList.remove("robomind-authenticated");

  createAuthScreen();
}

// ==========================================
// ADMIN AUTHORIZATION
// ==========================================

function isAuthorizedAdmin() {
  const currentUser = getSession();

  return Boolean(
    currentUser &&
    currentUser.role === "admin" &&
    currentUser.email === ADMIN_EMAIL &&
    currentUser.id === "robomind-admin"
  );
}

// ==========================================
// ADMIN NAVIGATION
// ==========================================

const adminSections = [
  { id: "overview", label: "Overview", icon: "▦" },
  { id: "users", label: "Users", icon: "♙" },
  { id: "robots", label: "Robot Management", icon: "🤖" },
  { id: "components", label: "Component Management", icon: "⌘" },
  { id: "data", label: "Data Management", icon: "▤" }
];

function renderAdminNavigation() {
  return adminSections.map((section) => `
    <button
      class="admin-nav-item ${
        activeAdminSection === section.id ? "active" : ""
      }"
      type="button"
      data-admin-section="${section.id}"
    >
      <span>${section.icon}</span>
      ${section.label}
    </button>
  `).join("");
}

// ==========================================
// ADMIN DASHBOARD
// ==========================================

function openAdminDashboard() {
  if (!isAuthorizedAdmin()) {
    showToast("Access denied. Admin authorization required.");
    return;
  }

  if (!getAdminData()) {
    showToast("Admin data module is not loaded.");
    return;
  }

  activeAdminSection = "overview";

  adminScreen?.remove();

  adminScreen = document.createElement("section");
  adminScreen.className = "admin-screen";
  adminScreen.id = "admin-screen";

  adminScreen.innerHTML = `
    <div class="admin-layout">

      <aside class="admin-sidebar">

        <div class="admin-brand">
          <span class="auth-brand-icon">R</span>
          <span>RoboMind <strong>AI</strong></span>
        </div>

        <div class="admin-sidebar-label">ADMINISTRATION</div>

        <nav class="admin-navigation">
          ${renderAdminNavigation()}
        </nav>

        <div class="admin-sidebar-bottom">
          <span class="admin-status-dot"></span>
          Authorized Admin Session
        </div>

      </aside>

      <main class="admin-main">

        <header class="admin-header">

          <div>
            <span class="auth-eyebrow">CONTROL CENTER</span>
            <h1 id="admin-page-title">Overview</h1>
            <p id="admin-page-description">
              Manage and monitor your RoboMind AI platform.
            </p>
          </div>

          <button class="admin-back-button" id="close-admin" type="button">
            ← Back to RoboMind
          </button>

        </header>

        <div id="admin-content"></div>

      </main>

    </div>
  `;

  document.body.appendChild(adminScreen);

  document.getElementById("close-admin").addEventListener("click", () => {
    adminScreen?.remove();
    adminScreen = null;
  });

  renderAdminDashboard();
}

function renderAdminDashboard() {
  if (!isAuthorizedAdmin() || !adminScreen) return;

  adminScreen.querySelectorAll("[data-admin-section]").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.adminSection === activeAdminSection
    );
  });

  const titles = {
    overview: ["Overview", "Manage and monitor your RoboMind AI platform."],
    users: ["User Management", "View and manage registered demo accounts."],
    robots: ["Robot Management", "Add, edit and organize robotics learning content."],
    components: ["Component Management", "Manage electronic components and their information."],
    data: ["Data Management", "Review your current platform content."]
  };

  const [title, description] = titles[activeAdminSection] || titles.overview;

  document.getElementById("admin-page-title").textContent = title;
  document.getElementById("admin-page-description").textContent = description;

  const renderers = {
    overview: renderAdminOverview,
    users: renderAdminUsers,
    robots: renderRobotManagement,
    components: renderComponentManagement,
    data: renderDataManagement
  };

  document.getElementById("admin-content").innerHTML =
    (renderers[activeAdminSection] || renderAdminOverview)();

  hydrateAdminImages();
}

// ==========================================
// ADMIN OVERVIEW
// ==========================================

function renderAdminOverview() {
  const users = getUsers();
  const robots = getRobots();
  const components = getComponents();

  return `
    <section class="admin-welcome">

      <div>
        <span>ADMINISTRATOR</span>
        <h2>Welcome back!</h2>
        <p>Here is an overview of your robotics learning platform.</p>
      </div>

      <div class="admin-welcome-mark">R</div>

    </section>

    <section class="admin-stats">

      <article class="admin-stat-card">
        <span class="admin-stat-label">REGISTERED USERS</span>
        <strong>${users.length}</strong>
        <span class="admin-stat-note">Demo user accounts</span>
      </article>

      <article class="admin-stat-card">
        <span class="admin-stat-label">ROBOTS</span>
        <strong>${robots.length}</strong>
        <span class="admin-stat-note">Available robot entries</span>
      </article>

      <article class="admin-stat-card">
        <span class="admin-stat-label">COMPONENTS</span>
        <strong>${Object.keys(components).length}</strong>
        <span class="admin-stat-note">Available components</span>
      </article>

      <article class="admin-stat-card">
        <span class="admin-stat-label">ADMIN STATUS</span>
        <strong class="admin-online">Active</strong>
        <span class="admin-stat-note">Current admin session</span>
      </article>

    </section>

    <section class="admin-users-section">

      <div class="admin-section-heading">
        <div>
          <span class="auth-eyebrow">QUICK ACCESS</span>
          <h2>Platform Management</h2>
        </div>
      </div>

      <div class="admin-management-grid">

        <button class="admin-management-card" data-admin-section="robots">
          <span>🤖</span>
          <strong>Manage Robots</strong>
          <p>Add new robots and update existing entries.</p>
          <small>Open management →</small>
        </button>

        <button class="admin-management-card" data-admin-section="components">
          <span>⌘</span>
          <strong>Manage Components</strong>
          <p>Update component descriptions and categories.</p>
          <small>Open management →</small>
        </button>

        <button class="admin-management-card" data-admin-section="users">
          <span>♙</span>
          <strong>Manage Users</strong>
          <p>View registered accounts.</p>
          <small>Open management →</small>
        </button>

        <button class="admin-management-card" data-admin-section="data">
          <span>▤</span>
          <strong>Platform Data</strong>
          <p>Review the current content database.</p>
          <small>Open management →</small>
        </button>

      </div>

    </section>
  `;
}

// ==========================================
// USER MANAGEMENT
// ==========================================

function renderAdminUsers() {
  const users = getUsers();

  return `
    <section class="admin-users-section">

      <div class="admin-section-heading">
        <div>
          <span class="auth-eyebrow">ACCOUNT MANAGEMENT</span>
          <h2>Registered Users</h2>
        </div>

        <span class="admin-user-count">${users.length} users</span>
      </div>

      <div class="admin-table-wrap">

        <table class="admin-table">

          <thead>
            <tr>
              <th>USER</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>REGISTERED</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>

            ${
              users.length
                ? users.map((user) => `
                  <tr>
                    <td>
                      <div class="admin-table-user">
                        <span class="admin-table-avatar">
                          ${escapeHTML(user.name.charAt(0).toUpperCase())}
                        </span>
                        ${escapeHTML(user.name)}
                      </div>
                    </td>

                    <td>${escapeHTML(user.email)}</td>

                    <td><span class="admin-role">User</span></td>

                    <td>
                      ${
                        user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"
                      }
                    </td>

                    <td>
                      <button
                        class="admin-delete-button"
                        data-delete-user="${escapeHTML(user.id)}"
                        type="button"
                      >Remove</button>
                    </td>
                  </tr>
                `).join("")
                : `
                  <tr>
                    <td colspan="5" class="admin-empty">
                      No registered users yet.
                    </td>
                  </tr>
                `
            }

          </tbody>

        </table>

      </div>

      <p class="admin-demo-note">
        Demo dashboard: user records are stored in this browser only.
      </p>

    </section>
  `;
}

// ==========================================
// ROBOT MANAGEMENT
// ==========================================

function renderRobotManagement() {
  const robots = getRobots();

  return `
    <section class="admin-users-section">

      <div class="admin-section-heading">

        <div>
          <span class="auth-eyebrow">ROBOT DATABASE</span>
          <h2>Manage Robots</h2>
          <p>Currently ${robots.length} robot entries.</p>
        </div>

        <button class="admin-primary-button" id="show-add-robot" type="button">
          + Add Robot
        </button>

      </div>

      <div id="robot-form-container"></div>

      <div class="admin-content-grid">

        ${
          robots.length
            ? robots.map((robot) => `
              <article class="admin-content-card">

                <div class="admin-content-card-image">
                  ${imageMarkup(robot.image, robot.name, robot.emoji || "🤖")}
                </div>

                <div class="admin-content-card-body">

                  <span class="admin-content-label">
                    ${(robot.components || []).length} COMPONENTS
                  </span>

                  <h3>${escapeHTML(robot.name)}</h3>

                  <p>${escapeHTML(robot.description)}</p>

                  <div class="admin-content-actions">

                    <button
                      class="admin-edit-button"
                      data-edit-robot="${escapeHTML(robot.id)}"
                      type="button"
                    >Edit</button>

                    <button
                      class="admin-delete-button"
                      data-delete-robot="${escapeHTML(robot.id)}"
                      type="button"
                    >Delete</button>

                  </div>

                </div>

              </article>
            `).join("")
            : `<p class="admin-empty">No robots available.</p>`
        }

      </div>

    </section>
  `;
}

// ==========================================
// ROBOT FORM
// ==========================================

function showRobotForm(robotId = null) {
  const container = document.getElementById("robot-form-container");

  if (!container) return;

  const robot = robotId
    ? getRobots().find((item) => item.id === robotId)
    : null;

  if (robotId && !robot) {
    showToast("Robot not found.");
    return;
  }

  const components = Object.keys(getComponents());

  container.innerHTML = `
    <form class="admin-editor-form" id="robot-editor-form">

      <div class="admin-section-heading">
        <div>
          <span class="auth-eyebrow">ROBOT DETAILS</span>
          <h2>${robot ? "Edit Robot" : "Add New Robot"}</h2>
        </div>
      </div>

      <label for="robot-name">Robot Name</label>
      <input
        id="robot-name"
        name="name"
        type="text"
        value="${escapeHTML(robot?.name || "")}"
        placeholder="Example: Autonomous Car"
        required
      >

      <label for="robot-id">Robot ID</label>
      <input
        id="robot-id"
        name="id"
        type="text"
        value="${escapeHTML(robot?.id || "")}"
        placeholder="Example: autonomous-car"
        ${robot ? "readonly" : "required"}
      >

      <label for="robot-emoji">Robot Emoji</label>
      <input
        id="robot-emoji"
        name="emoji"
        type="text"
        value="${escapeHTML(robot?.emoji || "🤖")}"
        placeholder="🤖"
      >

      <label for="robot-description">Description</label>
      <textarea
        id="robot-description"
        name="description"
        rows="3"
        placeholder="Describe this robot..."
      >${escapeHTML(robot?.description || "")}</textarea>

      <label for="robot-image">Robot Image URL (optional)</label>
      <input
        id="robot-image"
        name="image"
        type="url"
        value="${escapeHTML(isStoredImage(robot?.image) ? "" : robot?.image || "")}"
        placeholder="https://example.com/robot.jpg"
      >

      <label for="robot-image-file">Upload Robot Image</label>
      <input
        id="robot-image-file"
        name="imageFile"
        type="file"
        accept="image/*"
      >

      <p class="admin-form-hint">
        Supported image files only. Maximum file size: 3 MB.
        Uploading a new image replaces the current image.
      </p>

      <div class="admin-image-preview" id="robot-image-preview">
        ${imageMarkup(robot?.image, "Current robot image", robot?.emoji || "🤖")}
      </div>

      <label for="robot-components">Select Components</label>

      <select id="robot-components" name="components" multiple>
        ${
          components.map((component) => `
            <option
              value="${escapeHTML(component)}"
              ${
                robot?.components?.includes(component)
                  ? "selected"
                  : ""
              }
            >${escapeHTML(component)}</option>
          `).join("")
        }
      </select>

      <p class="admin-form-hint">
        Hold Ctrl (Windows) or Command (Mac) to select multiple components.
      </p>

      <div class="admin-form-actions">

        <button class="admin-primary-button" type="submit">
          ${robot ? "Save Changes" : "Create Robot"}
        </button>

        <button
          class="admin-secondary-button"
          id="cancel-robot-form"
          type="button"
        >Cancel</button>

      </div>

    </form>
  `;

  const fileInput = container.querySelector("#robot-image-file");
  const preview = container.querySelector("#robot-image-preview");

  setupImagePreview(
    fileInput,
    preview,
    robot?.image,
    robot?.emoji || "🤖"
  );

  container.querySelector("#cancel-robot-form").addEventListener("click", () => {
    container.innerHTML = "";
  });

  container.querySelector("#robot-editor-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = event.currentTarget.querySelector('[type="submit"]');
    submitButton.disabled = true;

    try {
      const form = new FormData(event.currentTarget);
      const selectedComponents = [
        ...container.querySelector("#robot-components").selectedOptions
      ].map((option) => option.value);

      const data = {
        name: String(form.get("name")).trim(),
        emoji: String(form.get("emoji") || "🤖").trim(),
        description: String(form.get("description") || "").trim(),
        image: String(form.get("image") || "").trim(),
        components: selectedComponents
      };

      const file = fileInput.files?.[0];

      if (file) {
        const imageKey = `robot:${robot ? robot.id : String(form.get("id")).trim()}`;
        data.image = await saveImageUpload(file, imageKey);
      } else if (robot?.image && !data.image) {
        data.image = robot.image;
      }

      if (robot) {
        getAdminData().updateRobot(robot.id, data);
        showToast("Robot updated successfully.");
      } else {
        data.id = String(form.get("id")).trim();
        getAdminData().addRobot(data);
        showToast("Robot created successfully.");
      }

      renderAdminDashboard();

    } catch (error) {
      showToast(error.message || "Could not save robot.");
      submitButton.disabled = false;
    }
  });
}

// ==========================================
// COMPONENT MANAGEMENT
// ==========================================

function renderComponentManagement() {
  const components = getComponents();
  const entries = Object.entries(components);

  return `
    <section class="admin-users-section">

      <div class="admin-section-heading">

        <div>
          <span class="auth-eyebrow">COMPONENT DATABASE</span>
          <h2>Manage Components</h2>
          <p>Currently ${entries.length} components.</p>
        </div>

        <button class="admin-primary-button" id="show-add-component" type="button">
          + Add Component
        </button>

      </div>

      <div id="component-form-container"></div>

      <div class="admin-table-wrap">

        <table class="admin-table">

          <thead>
            <tr>
              <th>COMPONENT</th>
              <th>CATEGORY</th>
              <th>DESCRIPTION</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>

            ${
              entries.length
                ? entries.map(([name, info]) => `
                  <tr>

                    <td><strong>${escapeHTML(name)}</strong></td>

                    <td>
                      <span class="admin-role">
                        ${escapeHTML(info.category)}
                      </span>
                    </td>

                    <td>${escapeHTML(info.description)}</td>

                    <td>
                      <div class="admin-content-actions">

                        <button
                          class="admin-edit-button"
                          data-edit-component="${escapeHTML(name)}"
                          type="button"
                        >Edit</button>

                        <button
                          class="admin-delete-button"
                          data-delete-component="${escapeHTML(name)}"
                          type="button"
                        >Delete</button>

                      </div>
                    </td>

                  </tr>
                `).join("")
                : `
                  <tr>
                    <td colspan="4" class="admin-empty">
                      No components available.
                    </td>
                  </tr>
                `
            }

          </tbody>

        </table>

      </div>

    </section>
  `;
}

// ==========================================
// COMPONENT FORM
// ==========================================

function showComponentForm(componentName = null) {
  const container = document.getElementById("component-form-container");

  if (!container) return;

  const components = getComponents();
  const info = componentName ? components[componentName] : null;

  if (componentName && !info) {
    showToast("Component not found.");
    return;
  }

  const image = componentName
    ? getComponentImages()[componentName] || ""
    : "";

  container.innerHTML = `
    <form class="admin-editor-form" id="component-editor-form">

      <div class="admin-section-heading">
        <div>
          <span class="auth-eyebrow">COMPONENT DETAILS</span>
          <h2>${info ? "Edit Component" : "Add New Component"}</h2>
        </div>
      </div>

      <label for="component-name">Component Name</label>

      <input
        id="component-name"
        name="name"
        type="text"
        value="${escapeHTML(componentName || "")}"
        placeholder="Example: Ultrasonic Sensor"
        ${info ? "readonly" : "required"}
      >

      <label for="component-category">Category</label>
      <input
        id="component-category"
        name="category"
        type="text"
        value="${escapeHTML(info?.category || "")}"
        placeholder="Example: Sensors"
        required
      >

      <label for="component-description">Description</label>
      <textarea
        id="component-description"
        name="description"
        rows="3"
        placeholder="Describe the component..."
      >${escapeHTML(info?.description || "")}</textarea>

      <label for="component-working">Working Principle</label>
      <textarea
        id="component-working"
        name="working"
        rows="3"
        placeholder="Explain how it works..."
      >${escapeHTML(info?.working || "")}</textarea>

      <label for="component-specifications">Specifications</label>
      <textarea
        id="component-specifications"
        name="specifications"
        rows="3"
        placeholder="Enter component specifications..."
      >${escapeHTML(info?.specifications || "")}</textarea>

      <label for="component-applications">Applications</label>
      <textarea
        id="component-applications"
        name="applications"
        rows="3"
        placeholder="Enter real-world applications..."
      >${escapeHTML(info?.applications || "")}</textarea>

      <label for="component-image">Component Image URL (optional)</label>
      <input
        id="component-image"
        name="image"
        type="url"
        value="${escapeHTML(isStoredImage(image) ? "" : image)}"
        placeholder="https://example.com/component.jpg"
      >

      <label for="component-image-file">Upload Component Image</label>
      <input
        id="component-image-file"
        name="imageFile"
        type="file"
        accept="image/*"
      >

      <p class="admin-form-hint">
        Supported image files only. Maximum file size: 3 MB.
        Uploading a new image replaces the current image.
      </p>

      <div class="admin-image-preview" id="component-image-preview">
        ${imageMarkup(image, "Current component image", "🖼️")}
      </div>

      <div class="admin-form-actions">

        <button class="admin-primary-button" type="submit">
          ${info ? "Save Changes" : "Create Component"}
        </button>

        <button
          class="admin-secondary-button"
          id="cancel-component-form"
          type="button"
        >Cancel</button>

      </div>

    </form>
  `;

  const fileInput = container.querySelector("#component-image-file");
  const preview = container.querySelector("#component-image-preview");

  setupImagePreview(fileInput, preview, image, "🖼️");

  container.querySelector("#cancel-component-form").addEventListener("click", () => {
    container.innerHTML = "";
  });

  container.querySelector("#component-editor-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = event.currentTarget.querySelector('[type="submit"]');
    submitButton.disabled = true;

    try {
      const form = new FormData(event.currentTarget);
      const name = String(form.get("name")).trim();

      const data = {
        category: String(form.get("category")).trim(),
        description: String(form.get("description") || "").trim(),
        working: String(form.get("working") || "").trim(),
        specifications: String(form.get("specifications") || "").trim(),
        applications: String(form.get("applications") || "").trim(),
        image: String(form.get("image") || "").trim()
      };

      const file = fileInput.files?.[0];

      if (file) {
        const imageKey = `component:${name}`;
        data.image = await saveImageUpload(file, imageKey);
      } else if (image && !data.image) {
        data.image = image;
      }

      if (info) {
        getAdminData().updateComponent(name, data);
        showToast("Component updated successfully.");
      } else {
        getAdminData().addComponent(name, data, data.image);
        showToast("Component created successfully.");
      }

      renderAdminDashboard();

    } catch (error) {
      showToast(error.message || "Could not save component.");
      submitButton.disabled = false;
    }
  });
}

// ==========================================
// DATA MANAGEMENT
// ==========================================

function renderDataManagement() {
  const robots = getRobots();
  const components = getComponents();

  return `
    <section class="admin-users-section">

      <div class="admin-section-heading">
        <div>
          <span class="auth-eyebrow">PLATFORM DATABASE</span>
          <h2>Content Overview</h2>
          <p>Review the content currently stored in this browser.</p>
        </div>
      </div>

      <div class="admin-stats">

        <article class="admin-stat-card">
          <span class="admin-stat-label">TOTAL ROBOTS</span>
          <strong>${robots.length}</strong>
          <span class="admin-stat-note">Robot records</span>
        </article>

        <article class="admin-stat-card">
          <span class="admin-stat-label">TOTAL COMPONENTS</span>
          <strong>${Object.keys(components).length}</strong>
          <span class="admin-stat-note">Component records</span>
        </article>

        <article class="admin-stat-card">
          <span class="admin-stat-label">REGISTERED USERS</span>
          <strong>${getUsers().length}</strong>
          <span class="admin-stat-note">User records</span>
        </article>

      </div>

      <div class="admin-data-panel">

        <h3>Storage Information</h3>

        <p>
          Robot and component information is saved in browser local storage.
        </p>

        <p>
          Uploaded images are saved in IndexedDB.
        </p>

        <p>
          This demonstration does not use a remote database or server.
        </p>

        <button
          class="admin-secondary-button"
          id="refresh-admin-data"
          type="button"
        >Refresh Data</button>

      </div>

    </section>
  `;
}

// ==========================================
// ADMIN CLICK HANDLING
// ==========================================

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");

  if (!target || !adminScreen || !adminScreen.contains(target)) return;
  if (!isAuthorizedAdmin()) return;

  const sectionButton = target.closest("[data-admin-section]");

  if (sectionButton) {
    activeAdminSection = sectionButton.dataset.adminSection;
    renderAdminDashboard();
    return;
  }

  if (target.id === "show-add-robot") {
    showRobotForm();
    return;
  }

  if (target.dataset.editRobot) {
    showRobotForm(target.dataset.editRobot);
    return;
  }

  if (target.dataset.deleteRobot) {
    const robot = getRobots().find(
      (item) => item.id === target.dataset.deleteRobot
    );

    if (!window.confirm("Are you sure you want to delete this robot?")) return;

    try {
      getAdminData().deleteRobot(target.dataset.deleteRobot);

      if (isStoredImage(robot?.image)) {
        getAdminData().deleteUploadedImage(getImageKey(robot.image))
          .catch((error) => console.error("Image cleanup failed:", error));
      }

      showToast("Robot deleted.");
      renderAdminDashboard();

    } catch (error) {
      showToast(error.message || "Could not delete robot.");
    }

    return;
  }

  if (target.id === "show-add-component") {
    showComponentForm();
    return;
  }

  if (target.dataset.editComponent) {
    showComponentForm(target.dataset.editComponent);
    return;
  }

  if (target.dataset.deleteComponent) {
    const name = target.dataset.deleteComponent;
    const image = getComponentImages()[name];

    if (!window.confirm(
      "Delete this component? It will also be removed from robot assignments."
    )) return;

    try {
      getAdminData().deleteComponent(name);

      if (isStoredImage(image)) {
        getAdminData().deleteUploadedImage(getImageKey(image))
          .catch((error) => console.error("Image cleanup failed:", error));
      }

      showToast("Component deleted.");
      renderAdminDashboard();

    } catch (error) {
      showToast(error.message || "Could not delete component.");
    }

    return;
  }

  if (target.dataset.deleteUser) {
    removeUser(target.dataset.deleteUser);
    return;
  }

  if (target.id === "refresh-admin-data") {
    getAdminData().refreshApplication();
    renderAdminDashboard();
    showToast("Data refreshed.");
  }
});

// ==========================================
// REMOVE USER
// ==========================================

function removeUser(userId) {
  if (!isAuthorizedAdmin()) {
    showToast("Access denied.");
    return;
  }

  if (!window.confirm("Are you sure you want to remove this demo user?")) return;

  saveUsers(getUsers().filter((user) => user.id !== userId));

  showToast("Demo user removed.");
  renderAdminDashboard();
}

// ==========================================
// TOAST
// ==========================================

function showToast(message) {
  let toast = document.querySelector(".robomind-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "robomind-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2600);
}

// ==========================================
// INITIALIZATION
// ==========================================

function initializeAuth() {
  if (!app) {
    console.error("RoboMind AI app container was not found.");
    return;
  }

  const existingSession = getSession();

  if (
    existingSession &&
    existingSession.role === "admin" &&
    existingSession.email === ADMIN_EMAIL &&
    existingSession.id === "robomind-admin"
  ) {
    showApp(existingSession);
    return;
  }

  if (existingSession && existingSession.role === "user") {
    showApp(existingSession);
    return;
  }

  clearSession();
  createAuthScreen();
}

initializeAuth();

console.log("RoboMind AI authentication initialized.");
