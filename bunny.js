const startButton = document.getElementById("start-button");
const backButton = document.getElementById("back-button");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

startButton?.addEventListener("click", () => {
  startScreen?.classList.remove("active");
  gameScreen?.classList.add("active");
});

backButton?.addEventListener("click", () => {
  gameScreen?.classList.remove("active");
  startScreen?.classList.add("active");
});
