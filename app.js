 const AI_ENDPOINT = "https://phishguard-ai.workers.dev";
fetch(AI_ENDPOINT, {
const message = document.getElementById("message");
const result = document.getElementById("result");
const analyzeBtn = document.getElementById("analyzeBtn");

const example =
  "Congratulations! You have won ₦500,000. Click https://claim-prize.example/ now to claim your prize. This offer expires in 10 minutes. Send your OTP to confirm your account.";

document.getElementById("exampleBtn").onclick = () => {
  message.value = example;
};

document.getElementById("clearBtn").onclick = () => {
  message.value = "";
  result.className = "result hidden";
  result.textContent = "";
};

function showResult(title, body, cls = "medium") {
  result.className = result ${cls};
  result.innerHTML = "";

  const heading = document.createElement("div");
  heading.className = "risk";
  heading.textContent = title;

  const content = document.createElement("div");
  content.style.whiteSpace = "pre-wrap";
  content.textContent = body;

  result.append(heading, content);
}

async function analyzeWithAI(text) {
  const response = await fetch(AI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: text
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "AI analysis failed.");
  }

  return data.analysis;
}

analyzeBtn.onclick = async () => {

  const text = message.value.trim();

  if (!text) {
    showResult(
      "MESSAGE REQUIRED",
      "Paste a message to analyze.",
      "medium"
    );
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Analyzing...";

  showResult(
    "AI ANALYSIS IN PROGRESS",
    "PhishGuard NG is analyzing observable warning signs...",
    "medium"
  );

  try {

    const analysis = await analyzeWithAI(text);

    const upper = analysis.toUpperCase();

    let riskClass = "low";

    if (upper.includes("HIGH RISK")) {
      riskClass = "high";
    } else if (upper.includes("MEDIUM RISK")) {
      riskClass = "medium";
    }

    showResult(
      "AI ANALYSIS",
      analysis,
      riskClass
    );

  } catch (error) {

    showResult(
      "AI ANALYSIS UNAVAILABLE",
      error.message +
      "\n\nPlease try again. Important security decisions should always be independently verified.",
      "medium"
    );

  } finally {

    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Analyze message";

  }
};
