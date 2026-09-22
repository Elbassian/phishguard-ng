const AI_ENDPOINT = "https://phishguard-ai.workers.dev";

const message = document.getElementById("message");
const result = document.getElementById("result");
const analyzeBtn = document.getElementById("analyzeBtn");

analyzeBtn.addEventListener("click", async () => {
  const text = message.value.trim();

  if (!text) {
    result.textContent = "Please enter a message to analyze.";
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Analyzing...";
  result.textContent = "AI is analyzing the message...";

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    if (!response.ok) {
      throw new Error("AI server returned an error.");
    }

    const data = await response.json();

    result.textContent =
      data.analysis || "No analysis was returned.";
  } catch (error) {
    console.error(error);

    result.textContent =
      "AI ANALYSIS UNAVAILABLE. Please check the connection and try again.";
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Analyze message";
  }
});
