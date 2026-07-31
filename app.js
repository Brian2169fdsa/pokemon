const creatures = [
  { icon: "⚡", color: "#f5c928", name: "Voltlynx" },
  { icon: "🔥", color: "#ef593f", name: "Emberwing" },
  { icon: "💧", color: "#36a9ee", name: "Tidefin" },
  { icon: "🌿", color: "#50bb67", name: "Mossback" },
  { icon: "🔮", color: "#b15adb", name: "Prismoth" },
];
const ranks = ["A♥", "K♥", "Q♥", "J♥", "10♥"];
const hands = document.querySelector("#hands");
const message = document.querySelector("#message");
const betOutput = document.querySelector("#bet");
const creditOutput = document.querySelector("#credit");
const winOutput = document.querySelector("#win");
let denomination = 10;
let betLevel = 5;
let credit = 10000;

function cardMarkup(rank, creature) {
  return `<div class="card" title="${creature.name} — Prism Rift specimen"><span class="rank">${rank}</span><span class="art" style="--card-color:${creature.color}" aria-label="${creature.name}">${creature.icon}</span></div>`;
}

function drawBoard(randomize = false) {
  hands.innerHTML = Array.from({ length: 10 }, (_, index) => {
    const cards = ranks.map((rank, cardIndex) => {
      const creature = randomize ? creatures[Math.floor(Math.random() * creatures.length)] : creatures[cardIndex];
      return cardMarkup(rank, creature);
    }).join("");
    return `<article class="hand"><span class="hand-number">${index + 1}</span><div class="cards">${cards}</div><div class="payout">JACKS OR<br>BETTER<strong>${betLevel}</strong></div></article>`;
  }).join("");
}

function updateMeters() {
  betOutput.textContent = (denomination * betLevel).toLocaleString();
  creditOutput.textContent = credit.toLocaleString();
}

document.querySelectorAll("[data-denom]").forEach((button) => button.addEventListener("click", () => {
  document.querySelector("[data-denom].active").classList.remove("active");
  button.classList.add("active");
  denomination = Number(button.dataset.denom);
  updateMeters();
  message.textContent = `PLAY VALUE SET TO ${denomination} CREDITS`;
}));

document.querySelector("#bet-one").addEventListener("click", () => {
  betLevel = betLevel % 5 + 1;
  updateMeters();
  drawBoard();
});

document.querySelector("#max-bet").addEventListener("click", () => {
  betLevel = 5;
  updateMeters();
  drawBoard();
  message.textContent = "MAXIMUM PLAY SELECTED";
});

document.querySelector("#deal").addEventListener("click", () => {
  const cost = denomination * betLevel;
  if (credit < cost) { message.textContent = "NOT ENOUGH PLAY CREDIT"; return; }
  credit -= cost;
  winOutput.textContent = "0";
  message.textContent = "DEALING PRISM RIFT CARDS…";
  updateMeters();
  document.querySelector("#deal").disabled = true;
  setTimeout(() => {
    drawBoard(true);
    const win = Math.random() > .65 ? denomination * betLevel * (1 + Math.floor(Math.random() * 4)) : 0;
    credit += win;
    winOutput.textContent = win.toLocaleString();
    updateMeters();
    message.textContent = win ? `NICE HAND — ${win} PLAY CREDITS!` : "EXPLORE THE CARDS, THEN DEAL AGAIN";
    document.querySelector("#deal").disabled = false;
  }, 420);
});

const modal = document.querySelector("#modal");
document.querySelector("#help").addEventListener("click", () => modal.showModal());
document.querySelector("#collection").addEventListener("click", () => modal.showModal());
document.querySelector(".close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => { if (event.target === modal) modal.close(); });

drawBoard();
updateMeters();
