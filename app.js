const message = document.getElementById("message");
const result = document.getElementById("result");

const example = "Congratulations! You have won ₦500,000. Click https://claim-prize.example/ now to claim your prize. This offer expires in 10 minutes. Send your OTP to confirm your account.";

document.getElementById("exampleBtn").onclick = () => {
  message.value = example;
  message.focus();
};

document.getElementById("clearBtn").onclick = () => {
  message.value = "";
  result.className = "result hidden";
  result.innerHTML = "";
};

function analyze(text){
  const t = text.toLowerCase();
  const checks = [
    {keys:["otp","one time password","verification code"], label:"Requests or mentions an OTP/verification code", weight:3},
    {keys:["password","passcode","pin"], label:"Requests sensitive authentication information", weight:3},
    {keys:["click","tap here","open this link","login here"], label:"Uses a call to click/open a link", weight:2},
    {keys:["urgent","immediately","act now","expires","within 10 minutes"], label:"Creates urgency or time pressure", weight:2},
    {keys:["won","winner","congratulations","prize","free money","cash"], label:"Uses an unexpected prize or financial reward", weight:2},
    {keys:["verify your account","account suspended","account locked"], label:"Creates fear about an account problem", weight:2},
    {keys:["send money","transfer","payment"], label:"Requests a financial action", weight:2},
    {keys:["http://","https://"], label:"Contains a web link", weight:1}
  ];
  let score=0, reasons=[];
  checks.forEach(c=>{
    if(c.keys.some(k=>t.includes(k))){score+=c.weight; reasons.push(c.label);}
  });
  let level = score>=7 ? "HIGH RISK" : score>=4 ? "MEDIUM RISK" : "LOWER RISK";
  let cls = score>=7 ? "high" : score>=4 ? "medium" : "low";
  return {level, cls, score, reasons};
}

document.getElementById("analyzeBtn").onclick = () => {
  const text = message.value.trim();
  if(!text){
    result.className = "result medium";
    result.innerHTML = "<div class='risk'>Please enter a message</div><p>Paste a suspicious message to run the prototype analysis.</p>";
    return;
  }
  const r = analyze(text);
  const reasons = r.reasons.length ? r.reasons.map(x=>`<li>${x}</li>`).join("") : "<li>No major warning indicators were detected by this prototype.</li>";
  const advice = r.cls === "high"
    ? "Do not click links or share credentials. Verify the claim through an official channel and report the message if appropriate."
    : r.cls === "medium"
    ? "Pause before acting. Verify the sender and claim independently, especially before sharing information or making payments."
    : "No major indicators were detected, but this does not prove the message is safe. Stay cautious and verify unexpected requests.";
  result.className = `result ${r.cls}`;
  result.innerHTML = `<div class="risk">${r.level}</div>
    <p><b>Prototype risk score:</b> ${r.score}</p>
    <p><b>Why it was flagged:</b></p><ul>${reasons}</ul>
    <div class="advice"><b>Recommended action:</b> ${advice}</div>`;
  result.scrollIntoView({behavior:"smooth",block:"nearest"});
};

document.querySelectorAll(".option").forEach(btn=>{
  btn.onclick=()=>{
    const fb=document.getElementById("quizFeedback");
    if(btn.dataset.correct==="true"){
      fb.textContent="✅ Correct. Never share an OTP. Contact the bank through an official channel.";
    }else{
      fb.textContent="❌ Not the safest choice. Never share an OTP, PIN or password with someone who contacts you unexpectedly.";
    }
  };
});