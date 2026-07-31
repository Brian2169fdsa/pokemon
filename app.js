const payData = [
  ["ROYAL FLUSH", 250], ["STRAIGHT FLUSH", 50], ["4 ACES", 80],
  ["4 2s, 3s, 4s", 40], ["4 5s THRU KINGS", 25], ["FULL HOUSE", 9],
  ["FLUSH", 6], ["STRAIGHT", 4], ["3 OF A KIND", 3],
  ["TWO PAIR", 2], ["JACKS OR BETTER", 1],
];
const multipliers = [1, 2, 3, 4, 5, 10];
const creatures = [
  { icon: "⚡", name: "Voltlynx", color: "#f5cf27" },
  { icon: "🔥", name: "Emberwing", color: "#f15a3d" },
  { icon: "💧", name: "Tidefin", color: "#37bcea" },
  { icon: "🌿", name: "Mossback", color: "#54c568" },
  { icon: "🔮", name: "Prismoth", color: "#a75ed1" },
];
const ranks = ["A", "K", "Q", "J", "10"];
const payRows = document.querySelector("#pay-rows");
const hands = document.querySelector("#hands");
const message = document.querySelector("#message");
let denomination = 10;
let betPerHand = 5;
let credits = 10000;
let dealing = false;

payRows.innerHTML = payData.map(([name, base]) => `<div class="pay-row"><span>${name}</span>${multipliers.map((multiplier) => `<b>${base * multiplier}</b>`).join("")}</div>`).join("");

function card(rank, creature, hidden = false) {
  if (hidden) return `<div class="card card-back"><i>✦</i><b>CARD LAB</b><small>PRISM RIFT</small></div>`;
  return `<div class="card" title="${creature.name}"><span>${rank}<i>♥</i></span><div class="card-art" style="--card:${creature.color}"><em>${creature.icon}</em><small>${creature.name}</small></div></div>`;
}

function renderHands(random = false) {
  hands.innerHTML = Array.from({ length: 10 }, (_, index) => {
    const cards = ranks.map((rank, cardIndex) => {
      const creature = random ? creatures[Math.floor(Math.random() * creatures.length)] : creatures[cardIndex];
      return card(rank, creature, !random && cardIndex === 4);
    }).join("");
    return `<article class="hand hand-${index + 1}">
      <span class="hand-number">${index + 1}</span>
      <div class="cards">${cards}</div>
      <div class="hand-pay"><span>JACKS OR<br />BETTER</span><strong>${betPerHand}</strong></div>
    </article>`;
  }).join("");
}

function updateMeters() {
  document.querySelector("#bet").textContent = betPerHand * 10;
  document.querySelector("#credit").textContent = `$${(credits / 100).toFixed(2)}`;
}

document.querySelectorAll("[data-denom]").forEach((button) => button.addEventListener("click", () => {
  if (dealing) return;
  document.querySelector("[data-denom].selected").classList.remove("selected");
  button.classList.add("selected");
  denomination = Number(button.dataset.denom);
  message.textContent = `DENOMINATION SET TO ${button.textContent}`;
}));

document.querySelector("#bet-hand").addEventListener("click", () => {
  if (dealing) return;
  betPerHand = betPerHand % 5 + 1;
  renderHands(); updateMeters();
  message.textContent = `${betPerHand} CREDIT${betPerHand === 1 ? "" : "S"} PER HAND`;
});

document.querySelector("#max-bet").addEventListener("click", () => {
  if (dealing) return;
  betPerHand = 5; renderHands(); updateMeters();
  message.textContent = "MAX BET SELECTED";
});

document.querySelector("#deal").addEventListener("click", () => {
  const cost = denomination * betPerHand * 10;
  if (dealing) return;
  if (credits < cost) { message.textContent = "INSUFFICIENT PLAY CREDIT"; return; }
  dealing = true; credits -= cost;
  document.querySelector("#win").textContent = "0";
  updateMeters(); message.textContent = "DEALING TEN HANDS…";
  document.querySelectorAll(".card").forEach((item, index) => setTimeout(() => item.classList.add("flipping"), index * 4));
  setTimeout(() => {
    renderHands(true);
    const win = Math.random() > .55 ? denomination * betPerHand * (1 + Math.floor(Math.random() * 8)) : 0;
    credits += win;
    document.querySelector("#win").textContent = win;
    updateMeters();
    message.textContent = win ? `WINNER! ${win} PLAY CREDITS` : "CHOOSE CARDS TO HOLD OR DEAL AGAIN";
    dealing = false;
  }, 650);
});

const dialog = document.querySelector("#help-dialog");
document.querySelector("#help").addEventListener("click", () => dialog.showModal());
document.querySelector("#games").addEventListener("click", () => { message.textContent = "MORE CARD LAB GAMES COMING SOON"; });
document.querySelector(".close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

renderHands();
updateMeters();
