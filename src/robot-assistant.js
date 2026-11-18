
import "./robot-assistant.css";

// =====================================================
// ROBOMIND AI - FREE DATA-AWARE ROBOTICS ASSISTANT
// No API key | No external AI service
// =====================================================

let isWaitingForResponse = false;

// =====================================================
// TEXT PROCESSING
// =====================================================

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getWords(value) {
  return normalizeText(value)
    .split(" ")
    .filter(word => word.length > 1);
}

function includesAny(text, words) {
  return words.some(word => text.includes(word));
}

// =====================================================
// GET LIVE APPLICATION DATABASE
// =====================================================

function getApplicationData() {
  const robots = window.roboMindRobots || [];
  const components = window.roboMindComponentInfo || {};

  return {
    robots,
    components
  };
}

// =====================================================
// ROBOT SEARCH ENGINE
// =====================================================

function findRobot(question, robots) {
  const normalized = normalizeText(question);

  return [...robots]
    .sort((a, b) => b.name.length - a.name.length)
    .find(robot => {
      const name = normalizeText(robot.name);

      return name && normalized.includes(name);
    });
}

// =====================================================
// COMPONENT SEARCH ENGINE
// =====================================================

function findComponent(question, components) {
  const normalized = normalizeText(question);

  return Object.keys(components)
    .sort((a, b) => b.length - a.length)
    .find(name => {
      const componentName = normalizeText(name);

      return componentName &&
        normalized.includes(componentName);
    });
}

// =====================================================
// SMART KEYWORD MATCHING
// =====================================================

function scoreText(question, content) {
  const questionWords = [...new Set(getWords(question))];
  const contentWords = getWords(content);

  let score = 0;

  questionWords.forEach(word => {
    if (contentWords.includes(word)) {
      score += word.length > 4 ? 3 : 1;
    }
  });

  return score;
}

function searchComponents(question, components) {
  const results = [];

  Object.entries(components).forEach(([name, info]) => {
    const searchableText = [
      name,
      info.category,
      info.description,
      info.working,
      ...(Array.isArray(info.applications)
        ? info.applications
        : [info.applications || ""]),
      ...(Array.isArray(info.specifications)
        ? info.specifications
        : [info.specifications || ""])
    ].join(" ");

    const score = scoreText(question, searchableText);

    if (score > 0) {
      results.push({
        name,
        info,
        score
      });
    }
  });

  return results.sort((a, b) => b.score - a.score);
}

// =====================================================
// FORMAT COMPONENT INFORMATION
// =====================================================

function formatList(value) {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "Not available";
  }

  return value || "Not available";
}

function explainComponent(name, info) {
  return `
${name}

Category:
${info.category || "Not specified"}

Description:
${info.description || "No description available."}

Working Principle:
${info.working || "Working information is not available."}

Applications:
${formatList(info.applications)}

Specifications:
${formatList(info.specifications)}

Note: Verify technical specifications using the manufacturer's documentation.
`.trim();
}

// =====================================================
// ROBOT INFORMATION
// =====================================================

function explainRobot(robot) {
  const components = Array.isArray(robot.components)
    ? robot.components
    : [];

  return `
${robot.name}

Description:
${robot.description || "No description available."}

Components:

${components.length
    ? components.map((item, index) =>
        `${index + 1}. ${item}`
      ).join("\n")
    : "No components are currently listed."}

This information comes from the RoboMind AI application database.
`.trim();
}

// =====================================================
// INTENT DETECTION
// =====================================================

function isListQuestion(question) {
  return includesAny(question, [
    "list",
    "components",
    "parts",
    "contain",
    "include",
    "used",
    "available",
    "what are"
  ]);
}

function isWorkingQuestion(question) {
  return includesAny(question, [
    "working",
    "work",
    "principle",
    "function",
    "operate",
    "operation",
    "how does",
    "how do"
  ]);
}

function isApplicationQuestion(question) {
  return includesAny(question, [
    "application",
    "applications",
    "uses",
    "used for",
    "purpose"
  ]);
}

function isSpecificationQuestion(question) {
  return includesAny(question, [
    "specification",
    "specifications",
    "voltage",
    "current",
    "capacity",
    "range",
    "speed",
    "torque",
    "technical details"
  ]);
}

function isComparisonQuestion(question) {
  return includesAny(question, [
    "compare",
    "comparison",
    "difference",
    "different",
    "versus",
    "vs"
  ]);
}

// =====================================================
// COMPONENT COMPARISON
// =====================================================

function compareComponents(question, components) {
  const normalized = normalizeText(question);

  const names = Object.keys(components)
    .sort((a, b) => b.length - a.length);

  const matches = names.filter(name =>
    normalized.includes(normalizeText(name))
  );

  if (matches.length < 2) {
    return null;
  }

  const first = matches[0];
  const second = matches[1];

  return `
COMPONENT COMPARISON

1. ${first}

${explainComponent(first, components[first])}

--------------------------------

2. ${second}

${explainComponent(second, components[second])}

These details are retrieved from the RoboMind AI database.
`.trim();
}

// =====================================================
// MAIN ANSWER ENGINE
// =====================================================

function getAssistantAnswer(question) {
  const normalized = normalizeText(question);

  const { robots, components } = getApplicationData();

  // Greeting
  if (includesAny(normalized, [
    "hello",
    "hi",
    "hey",
    "good morning",
    "good evening"
  ])) {
    return "Hello! Welcome to RoboMind AI. I can help you explore robots, components, working principles, specifications and applications. What would you like to know?";
  }

  // Help
  if (
    normalized.includes("help") ||
    normalized.includes("what can you do")
  ) {
    return `
I am RoboMind AI's data-aware robotics assistant.

I can help you with:

1. Robot information
2. Robot component lists
3. Electronic component descriptions
4. Working principles
5. Applications
6. Available specifications
7. Component comparisons
8. Information added through the Admin Dashboard

Try asking:
- Which robots are available?
- What components are used in a drone?
- Explain the working of a GPS module.
- Compare two components.
`.trim();
  }

  // Count available robots
  if (
    normalized.includes("how many robots") ||
    normalized.includes("total robots")
  ) {
    return `There are currently ${robots.length} robots available in the RoboMind AI database.`;
  }

  // List all robots
  if (
    normalized.includes("list robots") ||
    normalized.includes("available robots") ||
    normalized.includes("all robots") ||
    normalized.includes("robot names")
  ) {
    if (!robots.length) {
      return "There are currently no robots in the application database.";
    }

    return `
Robots available in RoboMind AI:

${robots.map((robot, index) =>
      `${index + 1}. ${robot.name}`
    ).join("\n")}

Total robots: ${robots.length}
`.trim();
  }

  // Robot-specific questions
  const robot = findRobot(question, robots);

  if (robot) {
    if (isListQuestion(normalized)) {
      return explainRobot(robot);
    }

    if (robot.description) {
      return `
${robot.name}

${robot.description}

Ask me about its components to explore more information.
`.trim();
    }

    return explainRobot(robot);
  }

  // Component comparison
  if (isComparisonQuestion(normalized)) {
    const comparison = compareComponents(
      question,
      components
    );

    if (comparison) {
      return comparison;
    }
  }

  // Direct component lookup
  const componentName = findComponent(
    question,
    components
  );

  if (componentName) {
    const info = components[componentName];

    if (isWorkingQuestion(normalized)) {
      return `
Working principle of ${componentName}:

${info.working || "Working information is not available in the application database."}
`.trim();
    }

    if (isApplicationQuestion(normalized)) {
      return `
Applications of ${componentName}:

${formatList(info.applications)}
`.trim();
    }

    if (isSpecificationQuestion(normalized)) {
      return `
Specifications of ${componentName}:

${formatList(info.specifications)}
`.trim();
    }

    return explainComponent(componentName, info);
  }

  // Search component information
  const searchResults = searchComponents(
    question,
    components
  );

  if (searchResults.length > 0) {
    const best = searchResults[0];

    if (best.score >= 5) {
      return explainComponent(best.name, best.info);
    }
  }

  // Database statistics
  if (
    normalized.includes("how many components") ||
    normalized.includes("total components")
  ) {
    return `RoboMind AI currently contains ${Object.keys(components).length} component records.`;
  }

  // Fallback
  return `
I couldn't find a matching answer in the current RoboMind AI database.

You can try:
- Asking with an exact robot name.
- Using a component name.
- Asking about working principles.
- Asking about applications.
- Checking whether the information is available in the Admin Dashboard.

My answers are currently based on the information stored in this application.
`.trim();
}

// =====================================================
// ASSISTANT INTERFACE
// =====================================================

function initializeRobotAssistant() {
  if (document.querySelector("#robotAssistantWidget")) return;

  const widget = document.createElement("div");
  widget.id = "robotAssistantWidget";

  widget.innerHTML = `
    <button
      type="button"
      id="assistantToggle"
      class="assistant-toggle"
      aria-label="Open RoboMind Assistant"
      aria-expanded="false"
    >
      <span>🤖</span>
      <span class="assistant-toggle-label">Ask RoboMind</span>
    </button>

    <section
      class="assistant-window"
      id="assistantWindow"
      aria-label="RoboMind AI Assistant"
      hidden
    >

      <header class="assistant-header">
        <div class="assistant-profile">
          <div class="assistant-avatar">🤖</div>

          <div>
            <h3>RoboMind Assistant</h3>
            <span><i></i> Free robotics knowledge assistant</span>
          </div>
        </div>

        <button
          type="button"
          id="assistantClose"
          class="assistant-close"
          aria-label="Close assistant"
        >×</button>
      </header>

      <div class="assistant-welcome">
        <strong>How can I help you today?</strong>
        <p>Explore robots and components using RoboMind's database.</p>
      </div>

      <div class="assistant-suggestions" id="assistantSuggestions">
        <button type="button"
          data-question="Which robots are available?">
          Available robots
        </button>

        <button type="button"
          data-question="What components are used in a drone?">
          Drone components
        </button>

        <button type="button"
          data-question="Explain the working of a flight controller">
          Flight controller
        </button>
      </div>

      <div
        class="assistant-messages"
        id="assistantMessages"
        aria-live="polite"
      >
        <div class="assistant-message assistant-bot">
          <div class="assistant-message-avatar">🤖</div>

          <div class="assistant-message-bubble">
            Hello! I'm RoboMind AI. Ask me about the robotics
            information available in this application.
          </div>
        </div>
      </div>

      <form class="assistant-input-area" id="assistantForm">
        <input
          id="assistantInput"
          type="text"
          placeholder="Ask a robotics question..."
          maxlength="500"
          autocomplete="off"
          aria-label="Your robotics question"
          required
        />

        <button type="submit" id="assistantSend"
          aria-label="Send message">➤</button>
      </form>

      <div class="assistant-disclaimer">
        Answers are retrieved from RoboMind's application database.
        This version does not use an external AI API.
      </div>

    </section>
  `;

  document.body.appendChild(widget);

  const toggle = widget.querySelector("#assistantToggle");
  const panel = widget.querySelector("#assistantWindow");
  const close = widget.querySelector("#assistantClose");

  const form = widget.querySelector("#assistantForm");
  const input = widget.querySelector("#assistantInput");

  const sendButton = widget.querySelector("#assistantSend");

  const messages = widget.querySelector("#assistantMessages");
  const suggestions = widget.querySelector("#assistantSuggestions");

  // Open assistant
  function openAssistant() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    input.focus();
  }

  // Close assistant
  function closeAssistant() {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  // Display messages
  function addMessage(text, sender) {
    const message = document.createElement("div");

    message.className =
      `assistant-message ${
        sender === "user"
          ? "assistant-user"
          : "assistant-bot"
      }`;

    const avatar = document.createElement("div");
    avatar.className = "assistant-message-avatar";

    avatar.textContent =
      sender === "user" ? "👤" : "🤖";

    const bubble = document.createElement("div");
    bubble.className = "assistant-message-bubble";

    bubble.textContent = text;

    message.append(avatar, bubble);
    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;
  }

  // Send question
  function sendQuestion(question) {
    const trimmed = question.trim();

    if (!trimmed || isWaitingForResponse) return;

    addMessage(trimmed, "user");

    input.value = "";

    isWaitingForResponse = true;
    input.disabled = true;
    sendButton.disabled = true;

    try {
      const answer = getAssistantAnswer(trimmed);
      addMessage(answer, "bot");
    } catch (error) {
      console.error("RoboMind Assistant Error:", error);

      addMessage(
        "Something went wrong while searching the application database. Please try again.",
        "bot"
      );
    } finally {
      isWaitingForResponse = false;
      input.disabled = false;
      sendButton.disabled = false;
      input.focus();
    }
  }

  toggle.addEventListener("click", () => {
    if (panel.hidden) {
      openAssistant();
    } else {
      closeAssistant();
    }
  });

  close.addEventListener("click", closeAssistant);

  form.addEventListener("submit", event => {
    event.preventDefault();
    sendQuestion(input.value);
  });

  suggestions.addEventListener("click", event => {
    const button = event.target.closest("[data-question]");

    if (button) {
      sendQuestion(button.dataset.question);
    }
  });

  console.log(
    "RoboMind AI Free Data-Aware Assistant loaded successfully."
  );
}

// =====================================================
// INITIALIZATION
// =====================================================

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeRobotAssistant
  );
} else {
  initializeRobotAssistant();
}
