
import "./robot-learning.css";

// ==========================================
// ROBOMIND AI - ROBOTICS LEARNING CENTRE
// ==========================================

const learningTopics = [
  {
    id: "robotics-basics",
    title: "Introduction to Robotics",
    category: "Fundamentals",
    level: "Beginner",
    icon: "🤖",
    duration: "10 min",
    description: "Understand what robots are and how robotic systems work.",
    lessons: [
      {
        title: "What is Robotics?",
        content: "Robotics is a field of engineering and technology focused on designing, building and programming robots. It combines mechanical engineering, electronics, computer science and control systems."
      },
      {
        title: "Main Parts of a Robot",
        content: "A typical robot includes a controller, sensors, actuators, a power supply and a mechanical structure. These parts work together to perform specific tasks."
      },
      {
        title: "Applications of Robotics",
        content: "Robots are used in manufacturing, healthcare, agriculture, space exploration, education and many other fields."
      }
    ]
  },
  {
    id: "sensors",
    title: "Robotics Sensors",
    category: "Electronics",
    level: "Beginner",
    icon: "📡",
    duration: "12 min",
    description: "Discover how robots collect information from their surroundings.",
    lessons: [
      {
        title: "What are Sensors?",
        content: "Sensors are electronic devices that detect changes in the environment and provide information to a robot's controller."
      },
      {
        title: "Types of Sensors",
        content: "Common robotics sensors include ultrasonic sensors, infrared sensors, temperature sensors, gyroscopes, accelerometers and LiDAR sensors."
      },
      {
        title: "Why Robots Need Sensors",
        content: "Sensors help robots detect obstacles, measure distances, understand orientation and respond to environmental changes."
      }
    ]
  },
  {
    id: "motors",
    title: "Motors and Actuators",
    category: "Electronics",
    level: "Beginner",
    icon: "⚙️",
    duration: "15 min",
    description: "Learn how robots create movement using motors and actuators.",
    lessons: [
      {
        title: "What is an Actuator?",
        content: "An actuator converts energy into physical movement. It allows a robot to move wheels, rotate joints or operate mechanical parts."
      },
      {
        title: "Types of Motors",
        content: "Common motor types include DC motors, servo motors and stepper motors. Each type has different movement and control characteristics."
      },
      {
        title: "Motor Applications",
        content: "Motors are used in robot wheels, robotic arms, grippers, automated machines and many other robotic systems."
      }
    ]
  },
  {
    id: "controllers",
    title: "Microcontrollers and Controllers",
    category: "Programming",
    level: "Intermediate",
    icon: "💻",
    duration: "18 min",
    description: "Understand how controllers process information and control robots.",
    lessons: [
      {
        title: "What is a Microcontroller?",
        content: "A microcontroller is a compact integrated circuit containing a processor, memory and input/output peripherals. It can execute programs to control electronic devices."
      },
      {
        title: "Popular Development Boards",
        content: "Arduino boards and ESP32 development boards are commonly used in educational and hobby robotics projects."
      },
      {
        title: "Controller Responsibilities",
        content: "A controller receives sensor information, processes programmed instructions and sends control signals to connected devices."
      }
    ]
  },
  {
    id: "power",
    title: "Power Supply Systems",
    category: "Electronics",
    level: "Intermediate",
    icon: "🔋",
    duration: "12 min",
    description: "Understand batteries and power systems used in robots.",
    lessons: [
      {
        title: "Why Robots Need Power",
        content: "Robots need electrical energy to operate controllers, sensors, communication devices and motors."
      },
      {
        title: "Battery Types",
        content: "Robotic systems may use rechargeable lithium-ion, lithium-polymer, nickel-metal hydride and other battery technologies."
      },
      {
        title: "Power Management",
        content: "A power management system distributes suitable electrical power to different components. Voltage and current requirements must be checked against component specifications."
      }
    ]
  },
  {
    id: "navigation",
    title: "Robot Navigation",
    category: "Advanced",
    level: "Advanced",
    icon: "🧭",
    duration: "20 min",
    description: "Explore how autonomous robots understand their position and surroundings.",
    lessons: [
      {
        title: "What is Robot Navigation?",
        content: "Robot navigation is the process of determining a robot's position, orientation and movement toward a destination."
      },
      {
        title: "Navigation Technologies",
        content: "Robots may use GPS, cameras, LiDAR, ultrasonic sensors, inertial measurement units and mapping technologies."
      },
      {
        title: "Autonomous Navigation",
        content: "Autonomous robots combine sensor data, software and planning algorithms to make navigation decisions."
      }
    ]
  },
  {
    id: "communication",
    title: "Robotics Communication",
    category: "Programming",
    level: "Intermediate",
    icon: "📶",
    duration: "14 min",
    description: "Learn how robotic devices exchange information.",
    lessons: [
      {
        title: "Communication in Robotics",
        content: "Communication allows controllers, sensors, computers and other devices to exchange data."
      },
      {
        title: "Common Communication Protocols",
        content: "UART, I2C, SPI, Bluetooth and Wi-Fi are examples of communication interfaces and technologies used in robotics."
      },
      {
        title: "Why Communication Matters",
        content: "Reliable communication helps robotic subsystems coordinate their activities and share important information."
      }
    ]
  },
  {
    id: "ai-robotics",
    title: "Artificial Intelligence in Robotics",
    category: "Advanced",
    level: "Advanced",
    icon: "🧠",
    duration: "20 min",
    description: "Discover how AI makes robotic systems more intelligent.",
    lessons: [
      {
        title: "AI and Robotics",
        content: "Artificial intelligence helps robotic systems interpret information, recognize patterns and make decisions based on available data."
      },
      {
        title: "Machine Learning",
        content: "Machine learning allows computer systems to learn patterns from data and use those patterns to make predictions or classifications."
      },
      {
        title: "Real-World Applications",
        content: "AI is used in robot vision, object recognition, autonomous navigation, quality inspection and human-robot interaction."
      }
    ]
  }
];

// ==========================================
// KNOWLEDGE QUIZ
// ==========================================

const quizQuestions = [
  {
    question: "What is the main function of a sensor in a robot?",
    options: [
      "Store electricity",
      "Collect information from the environment",
      "Generate mechanical movement",
      "Display images"
    ],
    answer: 1,
    explanation: "Sensors collect information about the robot's surroundings."
  },
  {
    question: "Which component processes instructions in a robotic system?",
    options: [
      "Battery",
      "Wheel",
      "Controller",
      "Chassis"
    ],
    answer: 2,
    explanation: "The controller processes instructions and coordinates the robot's operations."
  },
  {
    question: "Which motor is commonly used for controlled angular positioning?",
    options: [
      "Servo motor",
      "DC power supply",
      "Ultrasonic sensor",
      "GPS module"
    ],
    answer: 0,
    explanation: "Servo motors are commonly used for controlled angular positioning."
  },
  {
    question: "What does GPS help a robot determine?",
    options: [
      "Temperature",
      "Location",
      "Battery capacity",
      "Motor speed"
    ],
    answer: 1,
    explanation: "GPS provides location information."
  },
  {
    question: "Which technology can be used for wireless communication?",
    options: [
      "Bluetooth",
      "Resistor",
      "Capacitor",
      "Gear"
    ],
    answer: 0,
    explanation: "Bluetooth is a wireless communication technology."
  },
  {
    question: "What is the purpose of a microcontroller?",
    options: [
      "Only provide mechanical support",
      "Process instructions and control devices",
      "Store mechanical energy",
      "Replace all sensors"
    ],
    answer: 1,
    explanation: "A microcontroller executes programs and controls connected devices."
  },
  {
    question: "What is an actuator?",
    options: [
      "A device that converts energy into movement",
      "A type of programming language",
      "A data storage format",
      "A wireless network"
    ],
    answer: 0,
    explanation: "Actuators create physical movement in robotic systems."
  },
  {
    question: "What does LiDAR measure?",
    options: [
      "Sound volume",
      "Distance using laser light",
      "Battery temperature only",
      "Internet speed"
    ],
    answer: 1,
    explanation: "LiDAR uses laser light to measure distances and help create environmental maps."
  }
];

// ==========================================
// HELPERS
// ==========================================

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function initializeLearningCentre() {
  if (document.querySelector("#robot-learning")) return;

  const gallery = document.querySelector("#component-search");
  if (!gallery) {
    console.error("Learning Centre: Component Gallery not found.");
    return;
  }

  const section = document.createElement("section");
  section.id = "robot-learning";
  section.className = "section robot-learning-section";

  section.innerHTML = `
    <div class="learning-container">

      <div class="learning-hero">
        <div class="learning-hero-content">
          <span class="learning-eyebrow">ROBOMIND AI ACADEMY</span>
          <h2>Explore. Learn. Build.</h2>
          <p>
            Discover robotics concepts, understand electronic
            components and improve your technical knowledge.
          </p>
          <a href="#learning-topics" class="learning-hero-button">
            Start Learning <span>→</span>
          </a>
        </div>
        <div class="learning-hero-art">🤖</div>
      </div>

      <div class="learning-heading" id="learning-topics">
        <span>YOUR LEARNING JOURNEY</span>
        <h2>Explore Learning Paths</h2>
        <p>Choose a topic and learn step by step.</p>
      </div>

      <div class="learning-filters" id="learningFilters">
        <button class="learning-filter active" data-filter="All">All Topics</button>
        <button class="learning-filter" data-filter="Fundamentals">Fundamentals</button>
        <button class="learning-filter" data-filter="Electronics">Electronics</button>
        <button class="learning-filter" data-filter="Programming">Programming</button>
        <button class="learning-filter" data-filter="Advanced">Advanced</button>
      </div>

      <div class="learning-topic-grid" id="learningTopicGrid"></div>

      <div class="learning-lesson-panel" id="learningLessonPanel">
        <div class="learning-empty">
          <span>📚</span>
          <h3>Choose a learning topic</h3>
          <p>Your lessons will appear here.</p>
        </div>
      </div>

      <div class="learning-quiz-section" id="learning-quiz">
        <div class="learning-quiz-heading">
          <span>TEST YOUR KNOWLEDGE</span>
          <h2>Robotics Knowledge Quiz</h2>
          <p>Check what you have learned with these questions.</p>
        </div>

        <div class="learning-quiz-card" id="learningQuizCard"></div>
      </div>

    </div>
  `;

  const compatibility = document.querySelector("#robot-compatibility");
  (compatibility || gallery).insertAdjacentElement("afterend", section);

  // Navigation
  const nav = document.querySelector(".header nav");

  if (nav && !nav.querySelector('[href="#robot-learning"]')) {
    const link = document.createElement("a");
    link.href = "#robot-learning";
    link.textContent = "Learning Centre";
    nav.appendChild(link);
  }

  // ==========================================
  // TOPIC RENDERING
  // ==========================================

  const topicGrid = section.querySelector("#learningTopicGrid");
  const lessonPanel = section.querySelector("#learningLessonPanel");

  function renderTopics(filter = "All") {
    const filteredTopics = learningTopics.filter(topic =>
      filter === "All" || topic.category === filter
    );

    topicGrid.innerHTML = filteredTopics.map(topic => `
      <article class="learning-topic-card">
        <div class="learning-topic-top">
          <span class="learning-topic-icon">${topic.icon}</span>
          <span class="learning-level">${escapeHTML(topic.level)}</span>
        </div>

        <span class="learning-topic-category">${escapeHTML(topic.category)}</span>
        <h3>${escapeHTML(topic.title)}</h3>
        <p>${escapeHTML(topic.description)}</p>

        <div class="learning-topic-footer">
          <span>📖 ${topic.lessons.length} Lessons</span>
          <span>◷ ${escapeHTML(topic.duration)}</span>
        </div>

        <button class="learning-start-button" data-topic="${escapeHTML(topic.id)}">
          Start Learning →
        </button>
      </article>
    `).join("");
  }

  section.querySelector("#learningFilters").addEventListener("click", event => {
    const button = event.target.closest(".learning-filter");
    if (!button) return;

    section.querySelectorAll(".learning-filter").forEach(item =>
      item.classList.remove("active")
    );

    button.classList.add("active");
    renderTopics(button.dataset.filter);
  });

  // ==========================================
  // LESSON VIEWER
  // ==========================================

  function openTopic(topicId) {
    const topic = learningTopics.find(item => item.id === topicId);
    if (!topic) return;

    lessonPanel.innerHTML = `
      <div class="learning-lesson-header">
        <div>
          <span>LEARNING MODULE</span>
          <h3>${topic.icon} ${escapeHTML(topic.title)}</h3>
          <p>${escapeHTML(topic.description)}</p>
        </div>
        <button class="learning-close-button" id="closeLearningLesson">✕</button>
      </div>

      <div class="learning-lesson-list">
        ${topic.lessons.map((lesson, index) => `
          <article class="learning-lesson-item">
            <div class="lesson-number">${index + 1}</div>
            <div>
              <h4>${escapeHTML(lesson.title)}</h4>
              <p>${escapeHTML(lesson.content)}</p>
            </div>
          </article>
        `).join("")}
      </div>

      <div class="learning-complete-message">
        <span>✓</span>
        You have explored this learning module!
      </div>
    `;

    lessonPanel.scrollIntoView({ behavior: "smooth", block: "start" });

    section.querySelector("#closeLearningLesson").addEventListener("click", () => {
      lessonPanel.innerHTML = `
        <div class="learning-empty">
          <span>📚</span>
          <h3>Choose a learning topic</h3>
          <p>Your lessons will appear here.</p>
        </div>
      `;
    });
  }

  topicGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-topic]");
    if (button) openTopic(button.dataset.topic);
  });

  // ==========================================
  // QUIZ ENGINE
  // ==========================================

  const quizCard = section.querySelector("#learningQuizCard");

  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    const question = quizQuestions[currentQuestion];

    answered = false;

    quizCard.innerHTML = `
      <div class="quiz-progress-row">
        <span>Question ${currentQuestion + 1} of ${quizQuestions.length}</span>
        <span>Score: ${score}</span>
      </div>

      <div class="quiz-progress-track">
        <div class="quiz-progress-fill"
          style="width:${(currentQuestion / quizQuestions.length) * 100}%">
        </div>
      </div>

      <h3 class="quiz-question">${escapeHTML(question.question)}</h3>

      <div class="quiz-options">
        ${question.options.map((option, index) => `
          <button class="quiz-option" data-answer="${index}">
            <span>${String.fromCharCode(65 + index)}</span>
            ${escapeHTML(option)}
          </button>
        `).join("")}
      </div>

      <div class="quiz-feedback" id="quizFeedback"></div>

      <button class="quiz-next-button" id="quizNextButton" disabled>
        Next Question →
      </button>
    `;

    quizCard.querySelectorAll(".quiz-option").forEach(button => {
      button.addEventListener("click", () => selectAnswer(Number(button.dataset.answer)));
    });

    quizCard.querySelector("#quizNextButton").addEventListener("click", () => {
      if (!answered) return;

      currentQuestion++;

      if (currentQuestion < quizQuestions.length) {
        renderQuestion();
      } else {
        renderQuizResult();
      }
    });
  }

  function selectAnswer(selectedIndex) {
    if (answered) return;

    answered = true;

    const question = quizQuestions[currentQuestion];
    const correct = selectedIndex === question.answer;

    if (correct) score++;

    quizCard.querySelectorAll(".quiz-option").forEach((button, index) => {
      button.disabled = true;

      if (index === question.answer) {
        button.classList.add("correct-answer");
      } else if (index === selectedIndex) {
        button.classList.add("wrong-answer");
      }
    });

    const feedback = quizCard.querySelector("#quizFeedback");

    feedback.className = `quiz-feedback ${correct ? "feedback-correct" : "feedback-wrong"}`;
    feedback.innerHTML = `
      <strong>${correct ? "Correct answer!" : "Not quite!"}</strong>
      <p>${escapeHTML(question.explanation)}</p>
    `;

    quizCard.querySelector("#quizNextButton").disabled = false;
    quizCard.querySelector("#quizNextButton").textContent =
      currentQuestion === quizQuestions.length - 1
        ? "See My Results →"
        : "Next Question →";
  }

  function renderQuizResult() {
    const percentage = Math.round((score / quizQuestions.length) * 100);

    quizCard.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result-icon">🏆</div>
        <span>QUIZ COMPLETED</span>
        <h3>Your Result</h3>
        <div class="quiz-score">${score}/${quizQuestions.length}</div>
        <p>You scored ${percentage}% in the Robotics Knowledge Quiz.</p>
        <p class="quiz-result-message">
          ${percentage >= 80
            ? "Excellent work! You have a strong understanding of these basics."
            : percentage >= 50
              ? "Good effort! Keep learning and strengthen your knowledge."
              : "Keep practicing! Review the learning modules and try again."}
        </p>
        <button class="quiz-restart-button" id="restartLearningQuiz">
          Try Again ↻
        </button>
      </div>
    `;

    quizCard.querySelector("#restartLearningQuiz").addEventListener("click", () => {
      currentQuestion = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderTopics();
  renderQuestion();

  console.log("RoboMind AI Learning Centre loaded successfully.");
}

// ==========================================
// INITIALIZE
// ==========================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeLearningCentre);
} else {
  initializeLearningCentre();
}
