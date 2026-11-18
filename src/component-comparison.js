
import "./component-comparison.css";

const componentInfo = window.roboMindComponentInfo || {};
const componentImages = window.roboMindComponentImages || {};

const components = Object.keys(componentInfo).sort();

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

function getImage(name) {
  return componentImages[name] || "";
}

function getComponent(name) {
  return componentInfo[name] || {};
}

function createOptions(selected) {
  return components.map((name) => `
    <option value="${escapeHTML(name)}"
      ${name === selected ? "selected" : ""}>
      ${escapeHTML(name)}
    </option>
  `).join("");
}

// Add Component Comparison to the top navigation
function createComparisonNavLink() {
 const header = document.querySelector(".header");
const nav = header?.querySelector("nav");

  if (!nav || document.getElementById("comparisonNavLink")) return;

  const link = document.createElement("a");

  link.id = "comparisonNavLink";
  link.href = "#componentComparison";
  link.textContent = "Component Comparison";

  nav.appendChild(link);
}

function renderComparison() {
  const first = document.getElementById("compareFirst")?.value;
  const second = document.getElementById("compareSecond")?.value;
  const result = document.getElementById("comparisonResult");

  if (!result) return;

  if (!first || !second) {
    result.innerHTML = "<p>Please select two components.</p>";
    return;
  }

  if (first === second) {
    result.innerHTML = `
      <div class="comparison-message">
        Please select two different components.
      </div>
    `;
    return;
  }

  const a = getComponent(first);
  const b = getComponent(second);

  const imageA = getImage(first);
  const imageB = getImage(second);

  const fields = [
    ["Category", "category"],
    ["Description", "description"],
    ["Working Principle", "working"],
    ["Specifications", "specifications"],
    ["Applications", "applications"]
  ];

  const imageHTML = (image, name) => image
    ? `<img src="${escapeHTML(image)}" alt="${escapeHTML(name)}">`
    : `<div class="comparison-placeholder">No image available</div>`;

  result.innerHTML = `
    <div class="comparison-grid">
      <article class="comparison-card">
        <div class="comparison-image">
          ${imageHTML(imageA, first)}
        </div>
        <h3>${escapeHTML(first)}</h3>
        <span class="comparison-tag">Component A</span>
      </article>

      <article class="comparison-card">
        <div class="comparison-image">
          ${imageHTML(imageB, second)}
        </div>
        <h3>${escapeHTML(second)}</h3>
        <span class="comparison-tag">Component B</span>
      </article>
    </div>

    <div class="comparison-table-wrapper">
      <h3>Detailed Comparison</h3>

      <table class="comparison-table">
        <thead>
          <tr>
            <th>Features</th>
            <th>${escapeHTML(first)}</th>
            <th>${escapeHTML(second)}</th>
          </tr>
        </thead>

        <tbody>
          ${fields.map(([label, key]) => `
            <tr>
              <th>${escapeHTML(label)}</th>
              <td>${escapeHTML(a[key] || "Information unavailable")}</td>
              <td>${escapeHTML(b[key] || "Information unavailable")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function createComparisonPage() {
  if (document.getElementById("componentComparison")) {
    createComparisonNavLink();
    return;
  }

  const explorer = document.querySelector("#explore");
  const dashboard = document.querySelector(".dashboard-section");

  const page = document.createElement("section");

  page.id = "componentComparison";
  page.className = "comparison-section";

  page.innerHTML = `
    <div class="comparison-heading">
      <span class="comparison-eyebrow">ROBOTICS ANALYSIS</span>
      <h2>Component Comparison</h2>
      <p>Compare two robotics components and understand
      their features, working principles and applications.</p>
    </div>

    <div class="comparison-selector">
      <div class="comparison-select-card">
        <label for="compareFirst">First Component</label>
        <select id="compareFirst">
          ${createOptions(components[0])}
        </select>
      </div>

      <div class="comparison-vs">VS</div>

      <div class="comparison-select-card">
        <label for="compareSecond">Second Component</label>
        <select id="compareSecond">
          ${createOptions(components[1] || components[0])}
        </select>
      </div>
    </div>

    <button type="button" id="compareButton" class="compare-action">
      Compare Components
    </button>

    <div id="comparisonResult" aria-live="polite"></div>
  `;

  if (explorer) {
    explorer.insertAdjacentElement("afterend", page);
  } else if (dashboard) {
    dashboard.insertAdjacentElement("afterend", page);
  } else {
    document.body.appendChild(page);
  }

  document.getElementById("compareButton")
    .addEventListener("click", renderComparison);

  document.getElementById("compareFirst")
    .addEventListener("change", renderComparison);

  document.getElementById("compareSecond")
    .addEventListener("change", renderComparison);

  createComparisonNavLink();
  renderComparison();
}

if (components.length >= 2) {
  createComparisonPage();
} else {
  console.error("RoboMind AI: Component database is unavailable.");
}
