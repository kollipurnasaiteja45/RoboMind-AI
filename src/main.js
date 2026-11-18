
import "./style.css";

// ==========================================
// 1. ROBOT DATA
// ==========================================

const robots = [
  {
    id: "drone",
    name: "Drone",
    emoji: "🚁",
    description: "Explore the electronic components used in a drone.",
    components: [
      "Flight Controller", "Brushless Motor", "ESC", "LiPo Battery",
      "GPS Module", "Accelerometer", "Gyroscope", "LiDAR Sensor",
      "Brushless DC Motor",
    ],
  },
  {
    id: "robotic-arm",
    name: "Robotic Arm",
    emoji: "🦾",
    description: "Explore the components used in a robotic arm.",
    components: [
      "Servo Motor", "Microcontroller", "Motor Driver", "Sensors",
      "Stepper Motor", "Linear Actuator", "Touch Sensor", "Arduino", "ESP32",
    ],
  },
  {
    id: "line-follower",
    name: "Line Following Robot",
    emoji: "🤖",
    description: "Explore the components used in a line-following robot.",
    components: [
      "IR Sensor", "Arduino", "Motor Driver", "DC Motor",
      "Ultrasonic Sensor", "ESP32", "Li-ion Battery", "Bluetooth HC-05",
    ],
  },
  {
    id: "humanoid",
    name: "Humanoid Robot",
    emoji: "🧍",
    description: "Explore robots designed to perform movements and tasks similar to humans.",
    components: [
      "Microcontroller", "Servo Motor", "DC Motor", "Touch Sensor",
      "Accelerometer", "Gyroscope", "Sensors", "Bluetooth HC-05",
    ],
  },
  {
    id: "obstacle-avoidance",
    name: "Obstacle Avoidance Robot",
    emoji: "🚗",
    description: "Explore a robot that detects obstacles and navigates around them.",
    components: [
      "Ultrasonic Sensor", "IR Sensor", "Arduino", "Motor Driver",
      "DC Motor", "Li-ion Battery", "ESP32",
    ],
  },
  {
    id: "amr",
    name: "Autonomous Mobile Robot",
    emoji: "📦",
    description: "Explore autonomous robots used for transporting materials and objects.",
    components: [
      "LiDAR Sensor", "Ultrasonic Sensor", "ESP32", "DC Motor",
      "Motor Driver", "Li-ion Battery", "Wi-Fi Module", "GPS Module",
    ],
  },
  {
    id: "pick-place",
    name: "Pick and Place Robot",
    emoji: "🏭",
    description: "Explore robotic systems that pick up and position objects accurately.",
    components: [
      "Servo Motor", "Stepper Motor", "Linear Actuator", "Microcontroller",
      "Sensors", "Motor Driver", "Touch Sensor",
    ],
  },
  {
    id: "hexapod",
    name: "Hexapod Robot",
    emoji: "🕷️",
    description: "Explore a six-legged robot designed for walking and movement.",
    components: [
      "Servo Motor", "Microcontroller", "Accelerometer", "Gyroscope",
      "Li-ion Battery", "Bluetooth HC-05", "Sensors",
    ],
  },
  {
    id: "rover",
    name: "Robotic Rover",
    emoji: "🛸",
    description: "Explore mobile robotic vehicles used for exploration and navigation.",
    components: [
      "DC Motor", "Motor Driver", "GPS Module", "LiDAR Sensor",
      "Ultrasonic Sensor", "Arduino", "Li-ion Battery", "Solar Panel",
    ],
  },
  {
    id: "solar-robot",
    name: "Solar-Powered Robot",
    emoji: "☀️",
    description: "Explore robots that use solar energy as a power source.",
    components: [
      "Solar Panel", "DC Motor", "Arduino", "Battery Management System",
      "Li-ion Battery", "Voltage Regulator", "Sensors",
    ],
  },
];

// ==========================================
// 2. COMPONENT INFORMATION
// ==========================================

const componentInfo = {
  "Flight Controller": {
    category: "Control System",
    description: "The flight controller is the main control unit of a drone. It processes sensor information and controls the drone's movement.",
    working: "It receives information from sensors and pilot commands, processes them, and sends control signals to the electronic speed controllers.",
    specifications: "Specifications vary by model. Check the manufacturer's datasheet for processor, supported firmware, input voltage, and interfaces.",
    applications: "Drones, quadcopters, and other unmanned aerial vehicles.",
  },
  "Brushless Motor": {
    category: "Motor",
    description: "A brushless motor converts electrical energy into rotational movement. It is commonly used in drones.",
    working: "Electronic switching controls the magnetic fields inside the motor, causing its rotor to rotate.",
    specifications: "Check KV rating, voltage range, maximum current, power rating, and mounting dimensions.",
    applications: "Drones, RC aircraft, and robotics.",
  },
  ESC: {
    category: "Motor Controller",
    description: "An Electronic Speed Controller (ESC) controls the speed of a brushless motor.",
    working: "It receives control signals from the flight controller and regulates electrical power supplied to the motor.",
    specifications: "Check supported battery voltage, continuous current, peak current, firmware, and supported control protocols.",
    applications: "Drones, RC vehicles, and robotic systems.",
  },
  "LiPo Battery": {
    category: "Power Supply",
    description: "A Lithium Polymer battery stores electrical energy and supplies power to a drone.",
    working: "The battery supplies DC electrical energy to the electronic components of the drone.",
    specifications: "Check cell count, nominal voltage, capacity, discharge rating, connector type, and manufacturer limits.",
    applications: "Drones, RC vehicles, and portable electronic systems.",
  },
  "GPS Module": {
    category: "Navigation",
    description: "A GPS module helps a drone estimate its geographical position using satellite signals.",
    working: "It receives signals from satellites and calculates location information for the flight controller.",
    specifications: "Check positioning accuracy, update rate, supported satellite systems, interface, and operating voltage.",
    applications: "Drone navigation, location tracking, and mapping.",
  },
  "Servo Motor": {
    category: "Motor",
    description: "A servo motor provides controlled angular or positional movement.",
    working: "It uses a control signal and internal feedback to move its shaft toward a requested position.",
    specifications: "Check operating voltage, torque, speed, rotation range, and control interface.",
    applications: "Robotic arms, robotic joints, and automation systems.",
  },
  Microcontroller: {
    category: "Control System",
    description: "A microcontroller is a small computer that controls electronic devices and processes sensor inputs.",
    working: "It executes programmed instructions and communicates with connected sensors and actuators.",
    specifications: "Check processor, clock speed, memory, operating voltage, GPIO pins, and communication interfaces.",
    applications: "Robotics, embedded systems, and automation.",
  },
  "Motor Driver": {
    category: "Motor Controller",
    description: "A motor driver acts as an interface between a controller and an electric motor.",
    working: "It receives control signals and switches or regulates power to operate the connected motor.",
    specifications: "Check supported motor type, supply voltage, continuous current, peak current, and control interface.",
    applications: "Mobile robots, robotic arms, and automation.",
  },
  Sensors: {
    category: "Sensor",
    description: "Sensors collect information about the surrounding environment or the robot's condition.",
    working: "They detect physical conditions and convert them into signals that a controller can process.",
    specifications: "Specifications depend on the sensor type. Check measurement range, accuracy, resolution, and interface.",
    applications: "Robotics, automation, and monitoring systems.",
  },
  "IR Sensor": {
    category: "Sensor",
    description: "An infrared sensor detects infrared light and can be used to identify a line on a surface.",
    working: "It detects changes in reflected infrared light and sends a corresponding signal to the robot's controller.",
    specifications: "Check detection range, output type, operating voltage, sensitivity, and response time.",
    applications: "Line-following robots and obstacle detection.",
  },
  Arduino: {
    category: "Control System",
    description: "Arduino is an electronics platform used to build and program interactive projects.",
    working: "A compatible Arduino board runs a program that reads inputs and controls connected electronic components.",
    specifications: "Specifications depend on the board. Check processor, operating voltage, memory, and available pins.",
    applications: "Educational robotics, prototypes, and automation.",
  },
  "DC Motor": {
    category: "Motor",
    description: "A DC motor converts direct-current electrical energy into rotational movement.",
    working: "Electrical current creates magnetic forces that produce rotation in the motor.",
    specifications: "Check rated voltage, current, speed, torque, and motor dimensions.",
    applications: "Mobile robots, toys, and mechanical systems.",
  },
  "Ultrasonic Sensor": {
    category: "Sensor",
    description: "An ultrasonic sensor measures distance using high-frequency sound waves.",
    working: "It sends an ultrasonic pulse and measures the time taken for the reflected sound to return.",
    specifications: "Check measurement range, accuracy, operating voltage, trigger interface, and response time.",
    applications: "Obstacle detection, distance measurement, and robot navigation.",
  },
  "Temperature Sensor": {
    category: "Sensor",
    description: "A temperature sensor measures the temperature of an object or surrounding environment.",
    working: "It detects temperature changes and converts them into an electrical signal or digital reading.",
    specifications: "Check temperature range, accuracy, resolution, and output interface.",
    applications: "Industrial monitoring, smart homes, and robotics.",
  },
  "Humidity Sensor": {
    category: "Sensor",
    description: "A humidity sensor measures the amount of moisture present in the air.",
    working: "It detects changes in electrical properties caused by humidity and produces a corresponding reading.",
    specifications: "Check humidity range, accuracy, operating voltage, and communication interface.",
    applications: "Weather stations, agriculture, and environmental monitoring.",
  },
  "Touch Sensor": {
    category: "Sensor",
    description: "A touch sensor detects physical contact or touch.",
    working: "It detects changes in capacitance, pressure, or another physical property when touched.",
    specifications: "Check sensing method, sensitivity, response time, and output type.",
    applications: "Interactive robots, touch panels, and automation.",
  },
  Accelerometer: {
    category: "Sensor",
    description: "An accelerometer measures acceleration and changes in movement along different axes.",
    working: "It detects changes in acceleration and provides measurements that a controller can process.",
    specifications: "Check measurement range, number of axes, sensitivity, resolution, and interface.",
    applications: "Drone stabilization, motion detection, and robotics.",
  },
  Gyroscope: {
    category: "Sensor",
    description: "A gyroscope measures angular velocity and helps identify rotational movement.",
    working: "It senses rotational motion and provides data to a controller for orientation estimation.",
    specifications: "Check measurement range, sensitivity, number of axes, and communication interface.",
    applications: "Drone stabilization, navigation, and motion tracking.",
  },
  "LiDAR Sensor": {
    category: "Sensor",
    description: "LiDAR uses laser light to measure distances and create information about surroundings.",
    working: "It emits laser pulses and measures the returning light to estimate distances.",
    specifications: "Check measurement range, accuracy, scanning frequency, field of view, and interface.",
    applications: "Autonomous robots, mapping, and obstacle detection.",
  },
  "Stepper Motor": {
    category: "Motor",
    description: "A stepper motor moves in small, controlled angular steps.",
    working: "Electrical pulses energize its coils in a sequence, producing controlled step-by-step rotation.",
    specifications: "Check step angle, rated voltage, current, holding torque, and number of phases.",
    applications: "3D printers, CNC machines, and robotic positioning.",
  },
  "Brushless DC Motor": {
    category: "Motor",
    description: "A Brushless DC motor uses electronic switching instead of mechanical brushes.",
    working: "An electronic controller switches current through motor windings to create a rotating magnetic field.",
    specifications: "Check rated voltage, KV rating, current, torque, power, and speed.",
    applications: "Drones, electric vehicles, and robotics.",
  },
  "Linear Actuator": {
    category: "Motor",
    description: "A linear actuator converts energy into straight-line movement.",
    working: "An internal motor and mechanical mechanism extend or retract a moving shaft.",
    specifications: "Check stroke length, force rating, speed, voltage, and duty cycle.",
    applications: "Robotic mechanisms, automation, and adjustable equipment.",
  },
  Solenoid: {
    category: "Motor",
    description: "A solenoid is an electromagnetic device that produces linear movement.",
    working: "When current flows through its coil, a magnetic field moves a metal plunger.",
    specifications: "Check operating voltage, current, stroke length, force, and duty cycle.",
    applications: "Electromagnetic locks, valves, and automated mechanisms.",
  },
  ESP32: {
    category: "Control System",
    description: "ESP32 is a microcontroller family commonly used in connected electronic and robotics projects.",
    working: "It executes programmed instructions and supports wireless communication through built-in connectivity features.",
    specifications: "Check processor, memory, GPIO pins, operating voltage, Wi-Fi, Bluetooth, and board version.",
    applications: "IoT, smart robots, wireless control, and automation.",
  },
  "Raspberry Pi": {
    category: "Control System",
    description: "Raspberry Pi is a small single-board computer that can run an operating system and applications.",
    working: "It processes software instructions and communicates with connected hardware through its interfaces.",
    specifications: "Check processor, RAM, storage, GPIO, connectivity, and operating system support.",
    applications: "Computer vision, robotics, education, and IoT.",
  },
  NodeMCU: {
    category: "Control System",
    description: "NodeMCU is a development platform commonly built around an ESP8266 microcontroller.",
    working: "It runs programmed instructions and can exchange data over Wi-Fi.",
    specifications: "Check microcontroller version, operating voltage, memory, GPIO pins, and Wi-Fi support.",
    applications: "IoT devices, smart home projects, and connected robots.",
  },
  STM32: {
    category: "Control System",
    description: "STM32 is a family of microcontrollers based on ARM Cortex processor cores.",
    working: "It executes embedded programs and controls hardware through its peripherals and interfaces.",
    specifications: "Check processor family, clock speed, memory, GPIO, timers, and communication interfaces.",
    applications: "Embedded systems, robotics, and industrial control.",
  },
  "Raspberry Pi Pico": {
    category: "Control System",
    description: "Raspberry Pi Pico is a compact microcontroller development board.",
    working: "It runs embedded programs and controls connected electronic components using GPIO pins.",
    specifications: "Check microcontroller, clock speed, RAM, GPIO count, ADC channels, and board version.",
    applications: "Learning electronics, robotics, and embedded projects.",
  },
  "L298N Motor Driver": {
    category: "Motor Controller",
    description: "The L298N is a dual H-bridge motor driver module used to control compatible DC motors.",
    working: "It switches motor power according to control signals from a microcontroller.",
    specifications: "Check motor supply voltage, logic voltage, current limits, and heat dissipation requirements.",
    applications: "Mobile robots, educational projects, and motor control.",
  },
  "Relay Module": {
    category: "Electronic Module",
    description: "A relay module allows a low-power control signal to operate an electrically isolated switch.",
    working: "An electrical control signal energizes a relay coil, changing the state of its contacts.",
    specifications: "Check coil voltage, contact ratings, number of channels, and isolation features.",
    applications: "Automation, switching systems, and smart devices.",
  },
  "Voltage Regulator": {
    category: "Electronic Module",
    description: "A voltage regulator maintains a suitable output voltage for electronic circuits.",
    working: "It controls electrical output to keep the voltage within its specified regulation range.",
    specifications: "Check input range, output voltage, maximum current, efficiency, and thermal limits.",
    applications: "Microcontroller boards, power supplies, and embedded systems.",
  },
  Transistor: {
    category: "Electronic Module",
    description: "A transistor is a semiconductor device used for switching and signal amplification.",
    working: "A control signal changes the current flowing through the transistor.",
    specifications: "Check transistor type, voltage rating, current rating, gain, and switching characteristics.",
    applications: "Electronic circuits, switching, and signal processing.",
  },
  MOSFET: {
    category: "Electronic Module",
    description: "A MOSFET is a field-effect transistor commonly used for electronic switching.",
    working: "A voltage applied to its gate controls current through the device.",
    specifications: "Check drain-source voltage, current rating, gate threshold, on-resistance, and power dissipation.",
    applications: "Motor control, power conversion, and switching circuits.",
  },
  "H-Bridge": {
    category: "Motor Controller",
    description: "An H-Bridge is an electronic circuit that can control the direction of a compatible DC motor.",
    working: "It switches the motor's electrical connections to change the direction of current through the motor.",
    specifications: "Check voltage range, current capacity, switching frequency, and control inputs.",
    applications: "Robotic vehicles, motor control, and automation.",
  },
  "Li-ion Battery": {
    category: "Power Supply",
    description: "A Lithium-ion battery stores electrical energy for portable electronic devices and robots.",
    working: "It stores and releases electrical energy through reversible electrochemical reactions.",
    specifications: "Check nominal voltage, capacity, charging requirements, protection, and manufacturer limits.",
    applications: "Mobile robots, portable electronics, and electric systems.",
  },
  "Battery Management System": {
    category: "Power Supply",
    description: "A Battery Management System monitors and helps protect rechargeable battery packs.",
    working: "It monitors battery conditions and manages functions such as protection and cell balancing.",
    specifications: "Check supported chemistry, cell count, current rating, protection features, and balancing method.",
    applications: "Battery packs, electric vehicles, and robotics.",
  },
  "Buck Converter": {
    category: "Power Supply",
    description: "A buck converter is a DC-DC converter that reduces an input voltage to a lower output voltage.",
    working: "It uses electronic switching and energy storage components to regulate a lower DC output.",
    specifications: "Check input range, output range, current rating, efficiency, and thermal limits.",
    applications: "Embedded systems, robotics, and power supplies.",
  },
  "Boost Converter": {
    category: "Power Supply",
    description: "A boost converter is a DC-DC converter that increases an input voltage.",
    working: "It uses switching and energy storage components to produce a higher DC output.",
    specifications: "Check input range, output voltage, current rating, efficiency, and thermal limits.",
    applications: "Battery-powered electronics, robotics, and portable devices.",
  },
  "Solar Panel": {
    category: "Power Supply",
    description: "A solar panel converts sunlight into electrical energy.",
    working: "Photovoltaic cells convert light energy into electrical energy through the photovoltaic effect.",
    specifications: "Check rated power, voltage, current, efficiency, and physical dimensions.",
    applications: "Solar-powered robots, outdoor systems, and renewable energy projects.",
  },
  "Bluetooth HC-05": {
    category: "Communication",
    description: "HC-05 is a Bluetooth module commonly used for wireless serial communication.",
    working: "It exchanges serial data wirelessly with compatible Bluetooth devices.",
    specifications: "Check Bluetooth version, operating voltage, serial baud rate, and communication range.",
    applications: "Wireless robot control, Arduino projects, and embedded systems.",
  },
  "Wi-Fi Module": {
    category: "Communication",
    description: "A Wi-Fi module provides wireless network connectivity to electronic devices.",
    working: "It sends and receives data through a compatible wireless network.",
    specifications: "Check supported Wi-Fi standards, frequency bands, range, interface, and power requirements.",
    applications: "IoT, remote monitoring, and connected robots.",
  },
  "GSM Module": {
    category: "Communication",
    description: "A GSM module enables compatible devices to communicate through cellular networks.",
    working: "It uses a cellular connection to exchange supported data and messages.",
    specifications: "Check supported cellular bands, network compatibility, power requirements, and interfaces.",
    applications: "Remote monitoring, tracking systems, and IoT.",
  },
  NRF24L01: {
    category: "Communication",
    description: "NRF24L01 is a wireless transceiver module used for short-range data communication.",
    working: "It transmits and receives data packets over a compatible radio frequency connection.",
    specifications: "Check operating frequency, data rate, supply voltage, antenna type, and interface.",
    applications: "Wireless sensor networks, remote control, and robotics.",
  },
  "LoRa Module": {
    category: "Communication",
    description: "A LoRa module supports long-range, low-power wireless communication.",
    working: "It uses a radio modulation technique designed for communication over longer distances at relatively low data rates.",
    specifications: "Check frequency band, transmit power, sensitivity, data rate, and antenna requirements.",
    applications: "IoT, remote sensors, agriculture, and monitoring systems.",
  },
};

// ==========================================
// 3. COMPONENT IMAGES
// ==========================================

const componentImages = {
  "Flight Controller": "https://commons.wikimedia.org/wiki/Special:FilePath/Pixhawk.png",
  "Brushless Motor": "https://commons.wikimedia.org/wiki/Special:FilePath/Brushless-Motor-DUM60.jpg",
  ESC: "https://commons.wikimedia.org/wiki/Special:FilePath/BLDC_with_inbuilt_ESC_for_drone_2.jpg",
  "LiPo Battery": "https://commons.wikimedia.org/wiki/Special:FilePath/LiPo.JPG",
  "GPS Module": "https://commons.wikimedia.org/wiki/Special:FilePath/GPS_ublox_NEO-M6_Antenne.jpg",
  "Servo Motor": "https://commons.wikimedia.org/wiki/Special:FilePath/Servo_Motor.jpg",
  Microcontroller: "https://commons.wikimedia.org/wiki/Special:FilePath/Microcontroller_Boards.jpg",
  "Motor Driver": "https://commons.wikimedia.org/wiki/Special:FilePath/L293D_motor_driver_module.jpg",
  Sensors: "https://commons.wikimedia.org/wiki/Special:FilePath/IR_Sensor.jpg",
  "IR Sensor": "https://commons.wikimedia.org/wiki/Special:FilePath/IR_Sensor.jpg",
  Arduino: "https://commons.wikimedia.org/wiki/Special:FilePath/Arduino_Uno_board.jpg",
  "DC Motor": "https://commons.wikimedia.org/wiki/Special:FilePath/DC_Motor.jpg",
  "Ultrasonic Sensor": "https://commons.wikimedia.org/wiki/Special:FilePath/HC-SR04_Ultrasonic_Sensor.jpg",
  "Temperature Sensor": "https://commons.wikimedia.org/wiki/Special:FilePath/Temperature_sensor.jpg",
  "Humidity Sensor": "https://commons.wikimedia.org/wiki/Special:FilePath/DHT11.jpg",
  "Touch Sensor": "https://commons.wikimedia.org/wiki/Special:FilePath/Touch_sensor.jpg",
  Accelerometer: "https://commons.wikimedia.org/wiki/Special:FilePath/Accelerometer.jpg",
  Gyroscope: "https://commons.wikimedia.org/wiki/Special:FilePath/Gyroscope.jpg",
  "LiDAR Sensor": "https://commons.wikimedia.org/wiki/Special:FilePath/Lidar_sensor.jpg",
  "Stepper Motor": "https://commons.wikimedia.org/wiki/Special:FilePath/Stepper_motor.jpg",
  "Brushless DC Motor": "https://commons.wikimedia.org/wiki/Special:FilePath/Brushless-Motor-DUM60.jpg",
  "Linear Actuator": "https://commons.wikimedia.org/wiki/Special:FilePath/Linear_actuator.jpg",
  Solenoid: "https://commons.wikimedia.org/wiki/Special:FilePath/Solenoid.jpg",
  ESP32: "https://commons.wikimedia.org/wiki/Special:FilePath/ESP32_DevKitC.jpg",
  "Raspberry Pi": "https://commons.wikimedia.org/wiki/Special:FilePath/Raspberry_Pi_4_Model_B.jpg",
  NodeMCU: "https://commons.wikimedia.org/wiki/Special:FilePath/NodeMCU_Amica_R2.jpg",
  STM32: "https://commons.wikimedia.org/wiki/Special:FilePath/STM32_Nucleo_board.jpg",
  "Raspberry Pi Pico": "https://commons.wikimedia.org/wiki/Special:FilePath/Raspberry_Pi_Pico.jpg",
  "L298N Motor Driver": "https://commons.wikimedia.org/wiki/Special:FilePath/L298N_Motor_Driver_Module.jpg",
  "Relay Module": "https://commons.wikimedia.org/wiki/Special:FilePath/Relay_module.jpg",
  "Voltage Regulator": "https://commons.wikimedia.org/wiki/Special:FilePath/Voltage_regulator.jpg",
  Transistor: "https://commons.wikimedia.org/wiki/Special:FilePath/Transistor.jpg",
  MOSFET: "https://commons.wikimedia.org/wiki/Special:FilePath/MOSFET.jpg",
  "H-Bridge": "https://commons.wikimedia.org/wiki/Special:FilePath/H_bridge.jpg",
  "Li-ion Battery": "https://commons.wikimedia.org/wiki/Special:FilePath/Lithium_ion_battery.jpg",
  "Battery Management System": "https://commons.wikimedia.org/wiki/Special:FilePath/Battery_management_system.jpg",
  "Buck Converter": "https://commons.wikimedia.org/wiki/Special:FilePath/Buck_converter.jpg",
  "Boost Converter": "https://commons.wikimedia.org/wiki/Special:FilePath/Boost_converter.jpg",
  "Solar Panel": "https://commons.wikimedia.org/wiki/Special:FilePath/Solar_panel.jpg",
  "Bluetooth HC-05": "https://commons.wikimedia.org/wiki/Special:FilePath/HC-05_Bluetooth_module.jpg",
  "Wi-Fi Module": "https://commons.wikimedia.org/wiki/Special:FilePath/ESP8266_ESP-01.jpg",
  "GSM Module": "https://commons.wikimedia.org/wiki/Special:FilePath/SIM800L_GSM_module.jpg",
  NRF24L01: "https://commons.wikimedia.org/wiki/Special:FilePath/NRF24L01_module.jpg",
  "LoRa Module": "https://commons.wikimedia.org/wiki/Special:FilePath/LoRa_module.jpg",
};

// ==========================================
// 4. SHARE DATA WITH OTHER MODULES
// ==========================================

window.roboMindRobots = robots;
window.roboMindComponentInfo = componentInfo;
window.roboMindComponentImages = componentImages;

// ==========================================
// 5. APPLICATION STATE AND HELPERS
// ==========================================

const app = document.querySelector("#app");

let activeRobot = "drone";
let activeComponent = null;

// Keep object URLs cached so uploaded images are not fetched repeatedly.
const uploadedImageURLCache = new Map();

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}

function getAllComponents() {
  return Object.entries(componentInfo).map(([name, info]) => ({
    name,
    ...info,
  }));
}

function getImageMarkup(reference, className, alt, fallback = "") {
  if (!reference) {
    return fallback
      ? `<div class="${className} image-unavailable">${fallback}</div>`
      : "";
  }

  const safeReference = escapeHTML(reference);
  const safeAlt = escapeHTML(alt);

  if (reference.startsWith("idb:")) {
    return `
      <div class="${className}">
        <img
          class="component-art"
          data-image-ref="${safeReference}"
          alt="${safeAlt}"
          loading="lazy"
        />
      </div>
    `;
  }

  return `
    <div class="${className}">
      <img
        class="component-art"
        src="${safeReference}"
        alt="${safeAlt}"
        loading="lazy"
      />
    </div>
  `;
}

function getComponentImage(componentName, className = "component-artwork") {
  return getImageMarkup(
    componentImages[componentName],
    className,
    `Representative photograph of ${componentName}`
  );
}

// Resolve an IndexedDB image reference to a browser object URL.
async function resolveUploadedImage(reference) {
  if (!reference || !reference.startsWith("idb:")) {
    return reference || "";
  }

  if (uploadedImageURLCache.has(reference)) {
    return uploadedImageURLCache.get(reference);
  }

  const adminData = window.roboMindAdminData;

  if (!adminData || typeof adminData.getUploadedImage !== "function") {
    return "";
  }

  const imageKey = reference.slice(4);

  try {
    const file = await adminData.getUploadedImage(imageKey);

    if (!file) {
      return "";
    }

    const objectURL = URL.createObjectURL(file);
    uploadedImageURLCache.set(reference, objectURL);

    return objectURL;
  } catch (error) {
    console.error("Could not load uploaded image:", error);
    return "";
  }
}

// Hydrate all IndexedDB image references inside a rendered section.
async function hydrateImages(root = document) {
  const images = root.querySelectorAll("img[data-image-ref]");

  for (const image of images) {
    const reference = image.dataset.imageRef;

    if (!reference) continue;

    const objectURL = await resolveUploadedImage(reference);

    // Ignore images that were replaced while the IndexedDB request was running.
    if (!image.isConnected || image.dataset.imageRef !== reference) {
      continue;
    }

    if (objectURL) {
      image.src = objectURL;
    } else {
      image.style.display = "none";
      image.parentElement?.classList.add("image-unavailable");
    }
  }
}

// Revoke cached object URLs when an uploaded image is replaced or deleted.
function clearUnusedImageURLs() {
  const currentReferences = new Set([
    ...Object.values(componentImages),
    ...robots.map((robot) => robot.image).filter(Boolean),
  ]);

  for (const [reference, objectURL] of uploadedImageURLCache.entries()) {
    if (!currentReferences.has(reference)) {
      URL.revokeObjectURL(objectURL);
      uploadedImageURLCache.delete(reference);
    }
  }
}

// ==========================================
// 6. APPLICATION HTML
// ==========================================

app.innerHTML = `
  <header class="header">
    <div class="logo">🤖 RoboMind AI</div>

    <nav>
      <a href="#home">Home</a>
      <a href="#explore">Robot Explorer</a>
      <a href="#component-search">Search Components</a>
    </nav>
  </header>

  <main>

    <section class="hero" id="home">
      <p class="eyebrow">AI-POWERED ROBOTICS COMPONENT EXPLORER</p>

      <h1>Explore the World of Robotics</h1>

      <p>
        Discover robots, understand their electronic components,
        and learn how they work.
      </p>

      <a href="#explore" class="hero-button">Start Exploring</a>
    </section>

    <section class="section" id="explore">

      <div class="section-heading">
        <p class="eyebrow">DISCOVER</p>
        <h2>Robot Explorer</h2>
        <p>Select a robot to explore its components.</p>
      </div>

      <div class="robot-grid" id="robotList"></div>

      <div class="explorer-content" id="robotComponentDetails">

        <div class="component-list-panel">

          <h3 id="selectedRobotTitle">Drone Components</h3>

          <p id="selectedRobotDescription"></p>

          <p id="componentTotal" class="result-count"></p>

          <div id="componentList" class="component-list"></div>

        </div>

        <div class="info-panel" id="componentInfoPanel">

          <div class="empty-info">
            <span>🔍</span>
            <h3>Component Details</h3>
            <p>Select a component to view its information.</p>
          </div>

        </div>

      </div>

    </section>

    <section class="section search-section" id="component-search">

      <div class="section-heading">
        <p class="eyebrow">FIND WHAT YOU NEED</p>
        <h2>Component Gallery</h2>
        <p>Explore robotics components and filter by category.</p>
      </div>

      <div class="search-controls">

        <input
          type="search"
          id="searchInput"
          placeholder="Search components... e.g. GPS, Motor, Battery"
          aria-label="Search components"
        />

        <select id="categoryFilter" aria-label="Filter by category">
          <option value="All">All Categories</option>
        </select>

      </div>

      <p class="result-count" id="resultCount"></p>

      <div class="search-results" id="searchResults"></div>

    </section>

  </main>

  <footer class="footer">
    <h3>RoboMind AI</h3>
    <p>Learn Robotics. Explore Components. Build Ideas.</p>
    <p>© 2026 RoboMind AI</p>
  </footer>
`;

// ==========================================
// 7. ROBOT CARDS
// ==========================================

const robotList = document.querySelector("#robotList");

function renderRobotCards() {
  robotList.innerHTML = "";

  robots.forEach((robot) => {
    const card = document.createElement("button");

    card.className = "robot-card";
    card.type = "button";
    card.dataset.robot = robot.id;

    const robotImage = robot.image
      ? getImageMarkup(
          robot.image,
          "robot-card-image",
          `${robot.name} photograph`
        )
      : `<span class="robot-emoji">${escapeHTML(robot.emoji || "🤖")}</span>`;

    card.innerHTML = `
      ${robotImage}
      <h3>${escapeHTML(robot.name)}</h3>
      <p>${escapeHTML(robot.description)}</p>
      <span class="card-link">Explore Components →</span>
    `;

    robotList.appendChild(card);
  });

  hydrateImages(robotList);
}

// ==========================================
// 8. ROBOT COMPONENT EXPLORER
// ==========================================

function renderRobotComponents(robotId, showFirstDetails = false) {
  const robot = robots.find((item) => item.id === robotId);

  if (!robot) {
    activeRobot = robots[0]?.id || null;

    if (activeRobot) {
      renderRobotComponents(activeRobot, showFirstDetails);
    }

    return;
  }

  activeRobot = robotId;

  document.querySelector("#selectedRobotTitle").textContent =
    `${robot.name} Components`;

  document.querySelector("#selectedRobotDescription").textContent =
    robot.description || "";

  document.querySelector("#componentTotal").textContent =
    `${(robot.components || []).length} components used in this project`;

  document.querySelectorAll(".robot-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.robot === robotId);
  });

  const componentList = document.querySelector("#componentList");

  componentList.innerHTML = "";

  (robot.components || []).forEach((componentName) => {
    const button = document.createElement("button");

    button.className = "component-button";
    button.type = "button";
    button.dataset.component = componentName;

    button.innerHTML = `
      <span>${escapeHTML(componentName)}</span>
      <span class="card-link">View Details →</span>
    `;

    componentList.appendChild(button);
  });

  const panel = document.querySelector("#componentInfoPanel");

  panel.innerHTML = `
    <div class="empty-info">
      <span>🔍</span>
      <h3>${escapeHTML(robot.name)} Components</h3>
      <p>Select a component from the list to explore its details.</p>
    </div>
  `;

  activeComponent = null;

  if (showFirstDetails && robot.components?.length > 0) {
    const firstComponent = robot.components[0];

    showComponentDetails(firstComponent);
    setActiveComponentButton(firstComponent);
  }
}

// ==========================================
// 9. COMPONENT SELECTION
// ==========================================

function setActiveComponentButton(componentName) {
  document.querySelectorAll(".component-button").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.component === componentName
    );
  });
}

// ==========================================
// 10. COMPONENT DETAILS
// ==========================================

function showComponentDetails(componentName) {
  const info = componentInfo[componentName];
  const panel = document.querySelector("#componentInfoPanel");

  activeComponent = componentName;

  if (!info) {
    panel.innerHTML = `
      <div class="empty-info">
        <span>📘</span>
        <h3>${escapeHTML(componentName)}</h3>
        <p>Detailed information for this component will be added soon.</p>
      </div>
    `;

    return;
  }

  panel.innerHTML = `
    <div class="component-details">

      ${getComponentImage(componentName, "details-artwork")}

      <p class="eyebrow">COMPONENT INFORMATION</p>

      <h2>${escapeHTML(componentName)}</h2>

      <span class="category-tag">
        ${escapeHTML(info.category || "Uncategorized")}
      </span>

      <div class="detail-item">
        <h3>Description</h3>
        <p>${escapeHTML(info.description || "No description available.")}</p>
      </div>

      <div class="detail-item">
        <h3>Working Principle</h3>
        <p>${escapeHTML(info.working || "Information will be added soon.")}</p>
      </div>

      <div class="detail-item">
        <h3>Technical Specifications</h3>
        <p>${escapeHTML(info.specifications || "Check the manufacturer's datasheet.")}</p>
      </div>

      <div class="detail-item">
        <h3>Applications</h3>
        <p>${escapeHTML(info.applications || "Information will be added soon.")}</p>
      </div>

      <p class="data-note">
        Note: These photographs are representative examples.
        Verify exact specifications using the manufacturer's
        datasheet for the selected model.
      </p>

    </div>
  `;

  hydrateImages(panel);
}

// ==========================================
// 11. ROBOT CARD CLICK EVENT
// ==========================================

robotList.addEventListener("click", (event) => {
  const card = event.target.closest(".robot-card");

  if (!card) return;

  renderRobotComponents(card.dataset.robot, true);

  document.querySelector("#robotComponentDetails").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

// ==========================================
// 12. COMPONENT BUTTON CLICK EVENT
// ==========================================

document.querySelector("#componentList").addEventListener(
  "click",
  (event) => {
    const button = event.target.closest(".component-button");

    if (!button) return;

    const componentName = button.dataset.component;

    setActiveComponentButton(componentName);
    showComponentDetails(componentName);
  }
);

// ==========================================
// 13. COMPONENT GALLERY
// ==========================================

const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const searchResults = document.querySelector("#searchResults");
const resultCount = document.querySelector("#resultCount");

function renderCategoryOptions() {
  const previousCategory = categoryFilter.value;

  const categories = [
    ...new Set(
      getAllComponents()
        .map((component) => component.category)
        .filter(Boolean)
    ),
  ].sort();

  categoryFilter.innerHTML = `
    <option value="All">All Categories</option>
  `;

  categories.forEach((category) => {
    const option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    categoryFilter.appendChild(option);
  });

  if (categories.includes(previousCategory)) {
    categoryFilter.value = previousCategory;
  }
}

// ==========================================
// 14. SEARCH COMPONENTS
// ==========================================

function renderSearchResults() {
  const allComponents = getAllComponents();
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filteredComponents = allComponents.filter((component) => {
    const matchesSearch =
      component.name.toLowerCase().includes(searchText) ||
      (component.category || "").toLowerCase().includes(searchText) ||
      (component.description || "").toLowerCase().includes(searchText) ||
      (component.applications || "").toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "All" ||
      component.category === selectedCategory;

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
        <p>Try another component name or select a different category.</p>
      </div>
    `;

    return;
  }

  filteredComponents.forEach((component) => {
    const card = document.createElement("button");

    card.type = "button";
    card.className = "search-card";
    card.dataset.component = component.name;

    card.innerHTML = `
      ${getComponentImage(component.name, "card-artwork")}

      <div class="search-card-content">
        <h3>${escapeHTML(component.name)}</h3>

        <span class="category-tag">
          ${escapeHTML(component.category || "Uncategorized")}
        </span>

        <p>${escapeHTML(component.description || "")}</p>

        <span class="card-link">View Details →</span>
      </div>
    `;

    searchResults.appendChild(card);
  });

  hydrateImages(searchResults);
}

// ==========================================
// 15. SEARCH EVENT LISTENERS
// ==========================================

searchInput.addEventListener("input", renderSearchResults);

categoryFilter.addEventListener("change", renderSearchResults);

// ==========================================
// 16. GALLERY COMPONENT DETAILS
// ==========================================

searchResults.addEventListener("click", (event) => {
  const card = event.target.closest(".search-card");

  if (!card) return;

  const componentName = card.dataset.component;

  setActiveComponentButton(componentName);
  showComponentDetails(componentName);

  document.querySelector("#explore").scrollIntoView({
    behavior: "smooth",
  });
});

// ==========================================
// 17. ADMIN DASHBOARD DATA REFRESH
// ==========================================

// The admin-data module dispatches this event after changes.
// Re-render the explorer using the updated shared data.
window.addEventListener("robomind:data-updated", () => {
  clearUnusedImageURLs();

  renderRobotCards();
  renderCategoryOptions();
  renderSearchResults();

  const robotStillExists = robots.some(
    (robot) => robot.id === activeRobot
  );

  if (!robotStillExists) {
    activeRobot = robots[0]?.id || null;
  }

  if (activeRobot) {
    renderRobotComponents(activeRobot);
  }

  if (activeComponent && componentInfo[activeComponent]) {
    showComponentDetails(activeComponent);
    setActiveComponentButton(activeComponent);
  }
});

// ==========================================
// 18. INITIAL APPLICATION SETUP
// ==========================================

renderRobotCards();
renderCategoryOptions();
renderRobotComponents(activeRobot);
renderSearchResults();

// ==========================================
// 19. LOAD ADDITIONAL FEATURES
// ==========================================

import("./advanced-explorer.js").catch((error) => {
  console.error("Advanced Explorer loading failed:", error);
});

import("./component-comparison.js").catch((error) => {
  console.error("Component Comparison loading failed:", error);
});

import("./robot-compatibility.js").catch((error) => {
  console.error("Compatibility Checker loading failed:", error);
});

import("./robot-learning.js").catch((error) => {
  console.error("Learning Centre loading failed:", error);
});

import("./robot-assistant.js").catch((error) => {
  console.error("Robot Assistant loading failed:", error);
});

import("./advanced-3d-explorer.js").catch((error) => {
  console.error("3D Explorer loading failed:", error);
});
