
import "./advanced-3d-explorer.css";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ==========================================
// ROBOMIND AI - INTERACTIVE 3D DRONE EXPLORER
// ==========================================

const robots = window.roboMindRobots || [];
const componentInfo = window.roboMindComponentInfo || {};

if (document.getElementById("3d-drone-explorer")) {
  console.warn("3D Drone Explorer is already loaded.");
} else {
  initializeDroneExplorer();
}

function initializeDroneExplorer() {
  const section = document.createElement("section");
  section.id = "3d-drone-explorer";
  section.className = "drone3d-section";

  section.innerHTML = `
    <div class="drone3d-container">

      <div class="drone3d-heading">
        <span class="drone3d-eyebrow">INTERACTIVE ROBOTICS LAB</span>
        <h2>3D Drone Explorer</h2>
        <p>
          Explore a drone in 3D. Select individual components
          to understand their functions and applications.
        </p>
      </div>

      <div class="drone3d-workspace">

        <div class="drone3d-viewer-card">

          <div class="drone3d-viewer-top">
            <div>
              <span class="drone3d-status-dot"></span>
              <span>3D MODEL ACTIVE</span>
            </div>

            <span class="drone3d-model-label">QUADCOPTER DRONE</span>
          </div>

          <div id="drone3d-canvas" class="drone3d-canvas">
            <div class="drone3d-loading">
              Preparing 3D model...
            </div>
          </div>

          <div class="drone3d-controls">
            <button id="drone3d-reset" class="drone3d-control-btn">
              ↻ Reset View
            </button>

            <button id="drone3d-explode" class="drone3d-control-btn">
              ◈ Exploded View
            </button>
          </div>

          <div class="drone3d-hint">
            Drag to rotate · Scroll to zoom · Click a component to explore
          </div>

        </div>

        <aside class="drone3d-details-card">

          <div class="drone3d-details-heading">
            <span>COMPONENT INSPECTOR</span>
            <span class="drone3d-live-badge">LIVE</span>
          </div>

          <div id="drone3d-selected-icon" class="drone3d-selected-icon">
            🚁
          </div>

          <h3 id="drone3d-selected-name">Select a component</h3>

          <p id="drone3d-selected-description">
            Click any highlighted part of the 3D drone model
            to view its information.
          </p>

          <div class="drone3d-info-divider"></div>

          <div class="drone3d-info-item">
            <span>Component Category</span>
            <strong id="drone3d-category">Not selected</strong>
          </div>

          <div class="drone3d-info-item">
            <span>Working Principle</span>
            <p id="drone3d-working">
              Select a component to see how it works.
            </p>
          </div>

          <div class="drone3d-info-item">
            <span>Applications</span>
            <p id="drone3d-applications">
              Component applications will appear here.
            </p>
          </div>

          <button id="drone3d-search-component" class="drone3d-search-btn" disabled>
            Explore in Component Gallery →
          </button>

        </aside>

      </div>

      <div class="drone3d-bottom">
        <div>
          <h3>Drone Components</h3>
          <p>Select a component below or click it directly in the 3D model.</p>
        </div>

        <div id="drone3d-component-list" class="drone3d-component-list"></div>
      </div>

    </div>
  `;

  const main = document.querySelector("main") || document.body;
  main.appendChild(section);

  addNavigationLink();

  const canvasContainer = document.getElementById("drone3d-canvas");

  if (!canvasContainer) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#F0FFF8");

  const camera = new THREE.PerspectiveCamera(
    45,
    canvasContainer.clientWidth / canvasContainer.clientHeight,
    0.1,
    100
  );

  camera.position.set(4.5, 3.5, 5.5);

  let renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
  } catch (error) {
    canvasContainer.innerHTML = `
      <div class="drone3d-error">
        <h3>3D rendering is unavailable</h3>
        <p>Please check whether your browser supports WebGL.</p>
      </div>
    `;
    console.error("Three.js renderer error:", error);
    return;
  }

  renderer.setSize(
    canvasContainer.clientWidth,
    canvasContainer.clientHeight
  );

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  canvasContainer.innerHTML = "";
  canvasContainer.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 3;
  controls.maxDistance = 10;
  controls.target.set(0, 0.8, 0);

  // ==========================================
  // LIGHTING
  // ==========================================

  scene.add(new THREE.AmbientLight("#FFFFFF", 2));

  const mainLight = new THREE.DirectionalLight("#FFFFFF", 3);
  mainLight.position.set(5, 8, 5);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight("#B5FFE1", 1.5);
  fillLight.position.set(-5, 3, -4);
  scene.add(fillLight);

  const groundLight = new THREE.PointLight("#20C997", 1.5);
  groundLight.position.set(0, 1, 4);
  scene.add(groundLight);

  // ==========================================
  // ENVIRONMENT
  // ==========================================

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(5, 64),
    new THREE.MeshStandardMaterial({
      color: "#E1F8EC",
      roughness: 0.9
    })
  );

  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(
    8,
    24,
    "#A5DCC1",
    "#D1EBDD"
  );

  grid.position.y = -0.035;
  scene.add(grid);

  // ==========================================
  // MATERIALS
  // ==========================================

  const materials = {
    body: new THREE.MeshStandardMaterial({
      color: "#263D35",
      metalness: 0.55,
      roughness: 0.35
    }),

    frame: new THREE.MeshStandardMaterial({
      color: "#087F5B",
      metalness: 0.45,
      roughness: 0.4
    }),

    motor: new THREE.MeshStandardMaterial({
      color: "#AABBB3",
      metalness: 0.8,
      roughness: 0.25
    }),

    propeller: new THREE.MeshStandardMaterial({
      color: "#20C997",
      metalness: 0.25,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85
    }),

    battery: new THREE.MeshStandardMaterial({
      color: "#F0B84A",
      metalness: 0.3,
      roughness: 0.45
    }),

    electronics: new THREE.MeshStandardMaterial({
      color: "#277A60",
      metalness: 0.35,
      roughness: 0.4
    }),

    camera: new THREE.MeshStandardMaterial({
      color: "#303A38",
      metalness: 0.7,
      roughness: 0.2
    }),

    gps: new THREE.MeshStandardMaterial({
      color: "#F5F5F0",
      metalness: 0.25,
      roughness: 0.3
    })
  };

  // ==========================================
  // PART REGISTRY
  // ==========================================

  const parts = [];
  const partMeshes = [];

  function createPart(id, name, icon, position, explodedOffset) {
    const group = new THREE.Group();

    group.position.copy(position);

    group.userData.componentId = id;
    group.userData.componentName = name;
    group.userData.icon = icon;

    scene.add(group);

    const part = {
      id,
      name,
      icon,
      group,
      basePosition: position.clone(),
      explodedOffset: explodedOffset.clone()
    };

    parts.push(part);

    return group;
  }

  function addMesh(group, geometry, material, position = [0, 0, 0]) {
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(position[0], position[1], position[2]);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.userData.componentId = group.userData.componentId;

    group.add(mesh);
    partMeshes.push(mesh);

    return mesh;
  }

  // ==========================================
  // DRONE CENTRAL BODY
  // ==========================================

  const body = createPart(
    "Flight Controller",
    "Flight Controller",
    "🧠",
    new THREE.Vector3(0, 0.9, 0),
    new THREE.Vector3(0, 0.8, 0)
  );

  addMesh(
    body,
    new THREE.BoxGeometry(0.9, 0.2, 0.7),
    materials.body
  );

  // ==========================================
  // DRONE FRAME ARMS
  // ==========================================

  const armPositions = [
    { x: -1.05, z: -1.05, label: "Front Left" },
    { x: 1.05, z: -1.05, label: "Front Right" },
    { x: -1.05, z: 1.05, label: "Rear Left" },
    { x: 1.05, z: 1.05, label: "Rear Right" }
  ];

  armPositions.forEach((arm, index) => {
    const midpoint = new THREE.Vector3(
      arm.x / 2,
      0.9,
      arm.z / 2
    );

    const group = createPart(
      `Drone Frame ${index + 1}`,
      `Drone Frame - ${arm.label}`,
      "🦾",
      midpoint,
      new THREE.Vector3(
        arm.x * 0.35,
        0.25,
        arm.z * 0.35
      )
    );

    const length = Math.sqrt(
      arm.x * arm.x + arm.z * arm.z
    );

    const mesh = addMesh(
      group,
      new THREE.BoxGeometry(length, 0.12, 0.16),
      materials.frame
    );

    mesh.rotation.y = -Math.atan2(arm.z, arm.x);
  });

  // ==========================================
  // MOTORS AND PROPELLERS
  // ==========================================

  armPositions.forEach((arm, index) => {
    const motorGroup = createPart(
      `Brushless Motor ${index + 1}`,
      `Brushless Motor - ${arm.label}`,
      "⚙️",
      new THREE.Vector3(arm.x, 0.95, arm.z),
      new THREE.Vector3(
        arm.x * 0.3,
        0.6,
        arm.z * 0.3
      )
    );

    addMesh(
      motorGroup,
      new THREE.CylinderGeometry(0.19, 0.19, 0.2, 24),
      materials.motor
    );

    const propellerGroup = createPart(
      `Propeller ${index + 1}`,
      `Propeller - ${arm.label}`,
      "🌀",
      new THREE.Vector3(arm.x, 1.09, arm.z),
      new THREE.Vector3(
        arm.x * 0.45,
        1.05,
        arm.z * 0.45
      )
    );

    const bladeOne = addMesh(
      propellerGroup,
      new THREE.BoxGeometry(0.95, 0.035, 0.12),
      materials.propeller
    );

    bladeOne.rotation.y = Math.PI / 8;

    const bladeTwo = addMesh(
      propellerGroup,
      new THREE.BoxGeometry(0.95, 0.035, 0.12),
      materials.propeller
    );

    bladeTwo.rotation.y = Math.PI / 2 + Math.PI / 8;

    addMesh(
      propellerGroup,
      new THREE.CylinderGeometry(0.07, 0.07, 0.09, 16),
      materials.motor,
      [0, 0.025, 0]
    );
  });

  // ==========================================
  // BATTERY
  // ==========================================

  const battery = createPart(
    "LiPo Battery",
    "LiPo Battery",
    "🔋",
    new THREE.Vector3(0, 0.65, 0.42),
    new THREE.Vector3(0, -0.9, 0.8)
  );

  addMesh(
    battery,
    new THREE.BoxGeometry(0.5, 0.25, 0.65),
    materials.battery
  );

  // ==========================================
  // ESC
  // ==========================================

  const esc = createPart(
    "Electronic Speed Controller",
    "Electronic Speed Controller (ESC)",
    "⚡",
    new THREE.Vector3(0.48, 0.72, 0),
    new THREE.Vector3(0.9, 0.2, 0)
  );

  addMesh(
    esc,
    new THREE.BoxGeometry(0.28, 0.12, 0.35),
    materials.electronics
  );

  // ==========================================
  // GPS MODULE
  // ==========================================

  const gps = createPart(
    "GPS Module",
    "GPS Module",
    "📡",
    new THREE.Vector3(0, 1.2, -0.28),
    new THREE.Vector3(0, 1.1, -0.8)
  );

  addMesh(
    gps,
    new THREE.CylinderGeometry(0.17, 0.17, 0.12, 24),
    materials.gps
  );

  // ==========================================
  // CAMERA
  // ==========================================

  const cameraPart = createPart(
    "Camera Module",
    "Camera Module",
    "📷",
    new THREE.Vector3(0, 0.65, -0.48),
    new THREE.Vector3(0, -0.8, -1)
  );

  addMesh(
    cameraPart,
    new THREE.BoxGeometry(0.35, 0.25, 0.28),
    materials.camera
  );

  const lens = addMesh(
    cameraPart,
    new THREE.CylinderGeometry(0.09, 0.09, 0.08, 24),
    materials.body,
    [0, -0.02, -0.17]
  );

  lens.rotation.x = Math.PI / 2;

  // ==========================================
  // SELECTION SYSTEM
  // ==========================================

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  let selectedPart = null;
  let exploded = false;

  function clearSelection() {
    partMeshes.forEach(mesh => {
      if (mesh.material.emissive) {
        mesh.material.emissive.set("#000000");
        mesh.material.emissiveIntensity = 0;
      }
    });
  }

  function selectPart(partId) {
    const part = parts.find(item => item.id === partId);

    if (!part) return;

    selectedPart = part;

    clearSelection();

    part.group.traverse(object => {
      if (
        object.isMesh &&
        object.material.emissive
      ) {
        object.material.emissive.set("#20C997");
        object.material.emissiveIntensity = 0.8;
      }
    });

    updateComponentDetails(part);
    updateComponentButtons(part.id);
  }

  function updateComponentDetails(part) {
    const info = componentInfo[part.id] || {};

    document.getElementById("drone3d-selected-icon").textContent =
      part.icon;

    document.getElementById("drone3d-selected-name").textContent =
      part.name;

    document.getElementById("drone3d-selected-description").textContent =
      info.description ||
      "This is a demonstration component in the 3D drone model.";

    document.getElementById("drone3d-category").textContent =
      info.category || "Robotics Component";

    document.getElementById("drone3d-working").textContent =
      info.working ||
      info.description ||
      "Component information is not yet available in the database.";

    const applications = info.applications;

    document.getElementById("drone3d-applications").textContent =
      Array.isArray(applications)
        ? applications.join(", ")
        : applications || "Information not available.";

    const searchButton = document.getElementById(
      "drone3d-search-component"
    );

    searchButton.disabled = !componentInfo[part.id];
  }

  function updateComponentButtons(selectedId) {
    document.querySelectorAll(".drone3d-component-btn").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.component === selectedId
      );
    });
  }

  renderer.domElement.addEventListener("pointerdown", event => {
    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const intersections = raycaster.intersectObjects(
      partMeshes,
      false
    );

    if (!intersections.length) return;

    const componentId = intersections[0].object.userData.componentId;

    if (componentId) {
      selectPart(componentId);
    }
  });

  // ==========================================
  // COMPONENT BUTTONS
  // ==========================================

  const componentList = document.getElementById(
    "drone3d-component-list"
  );

  parts.forEach(part => {
    const button = document.createElement("button");

    button.className = "drone3d-component-btn";
    button.dataset.component = part.id;

    button.innerHTML = `
      <span>${part.icon}</span>
      <span>${part.name}</span>
    `;

    button.addEventListener("click", () => {
      selectPart(part.id);
    });

    componentList.appendChild(button);
  });

  // ==========================================
  // EXPLODED VIEW
  // ==========================================

  document.getElementById("drone3d-explode").addEventListener("click", () => {
    exploded = !exploded;

    parts.forEach(part => {
      const target = exploded
        ? part.basePosition.clone().add(part.explodedOffset)
        : part.basePosition.clone();

      part.group.position.copy(target);
    });

    document.getElementById("drone3d-explode").textContent =
      exploded ? "◈ Assembled View" : "◈ Exploded View";
  });

  // ==========================================
  // RESET VIEW
  // ==========================================

  document.getElementById("drone3d-reset").addEventListener("click", () => {
    exploded = false;

    parts.forEach(part => {
      part.group.position.copy(part.basePosition);
    });

    camera.position.set(4.5, 3.5, 5.5);
    controls.target.set(0, 0.8, 0);
    controls.update();

    clearSelection();

    selectedPart = null;

    document.getElementById("drone3d-selected-icon").textContent = "🚁";
    document.getElementById("drone3d-selected-name").textContent =
      "Select a component";

    document.getElementById("drone3d-selected-description").textContent =
      "Click any highlighted part of the 3D drone model to view its information.";

    document.getElementById("drone3d-category").textContent =
      "Not selected";

    document.getElementById("drone3d-working").textContent =
      "Select a component to see how it works.";

    document.getElementById("drone3d-applications").textContent =
      "Component applications will appear here.";

    document.getElementById("drone3d-search-component").disabled = true;

    document.getElementById("drone3d-explode").textContent =
      "◈ Exploded View";

    updateComponentButtons(null);
  });

  // ==========================================
  // OPEN COMPONENT GALLERY
  // ==========================================

  document.getElementById("drone3d-search-component").addEventListener("click", () => {
    if (!selectedPart) return;

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
      searchInput.value = selectedPart.id;
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    }

    const gallery = document.getElementById("component-search");

    if (gallery) {
      gallery.scrollIntoView({ behavior: "smooth" });
    }
  });

  // ==========================================
  // RESPONSIVE RESIZING
  // ==========================================

  const resizeObserver = new ResizeObserver(() => {
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  });

  resizeObserver.observe(canvasContainer);

  // ==========================================
  // ANIMATION LOOP
  // ==========================================

  function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // Select the main flight controller initially.
  selectPart("Flight Controller");
}

// ==========================================
// NAVIGATION LINK
// ==========================================

function addNavigationLink() {
  const nav = document.querySelector(
    ".nav-links, .navbar-nav, nav"
  );

  if (!nav || nav.querySelector('[href="#3d-drone-explorer"]')) {
    return;
  }

  const link = document.createElement("a");

  link.href = "#3d-drone-explorer";
  link.className = "nav-link";
  link.textContent = "3D Explorer";

  nav.appendChild(link);
}
