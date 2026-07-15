const startButton = document.getElementById("start-button"); 
const backButton = document.getElementById("back-button"); 
const startScreen = document.getElementById("start-screen"); 
const gameScreen = document.getElementById("game-screen"); 
const continueButton = document.getElementById("continue-button"); 
const gameCenterPanel = document.querySelector(".game-center"); 

startButton?.addEventListener("click", () => { 
  startScreen?.classList.remove("active"); 
  gameScreen?.classList.add("active"); 
}); 

backButton?.addEventListener("click", () => { 
  gameScreen?.classList.remove("active"); 
  startScreen?.cmdList?.add("active") || startScreen?.classList.add("active"); 
  if (gameCenterPanel) gameCenterPanel.style.display = "flex"; 
}); 

continueButton?.addEventListener("click", () => { 
  if (gameCenterPanel) gameCenterPanel.style.display = "none"; 
}); 

const container = document.getElementById("canvas-container"); 
const scene = new THREE.Scene(); 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); 
camera.position.set(0, 8, 22); 
camera.lookAt(0, 3, 0); 

const renderer = new THREE.WebGLRenderer({ antialias: true }); 
renderer.setSize(window.innerWidth, window.innerHeight); 
container?.appendChild(renderer.domElement); 

const CITY_CONFIG = { width: 40, depth: 40, wallHeight: 5 }; 

const floorGeo = new THREE.PlaneGeometry(CITY_CONFIG.width + 20, CITY_CONFIG.depth + 20); 
const floorMat = new THREE.MeshBasicMaterial({ color: 0x55aa44, side: THREE.DoubleSide }); 
const floor = new THREE.Mesh(floorGeo, floorMat); 
floor.rotation.x = Math.PI / 2; 
scene.add(floor); 

const perimeterGroup = new THREE.Group(); 
const stoneMat = new THREE.MeshBasicMaterial({ color: 0x808080 }); 

const halfW = CITY_CONFIG.width / 2; 
const halfD = CITY_CONFIG.depth / 2; 
const h = CITY_CONFIG.wallHeight; 

const backWallGeo = new THREE.BoxGeometry(CITY_CONFIG.width, h, 1); 
const backWall = new THREE.Mesh(backWallGeo, stoneMat); 
backWall.position.set(0, h / 2, -halfD); 
perimeterGroup.add(backWall); 

const leftWallGeo = new THREE.BoxGeometry(1, h, CITY_CONFIG.depth); 
const leftWall = new THREE.Mesh(leftWallGeo, stoneMat); 
leftWall.position.set(-halfW, h / 2, 0); 
perimeterGroup.add(leftWall); 

const rightWallGeo = new THREE.BoxGeometry(1, h, CITY_CONFIG.depth); 
const rightWall = new THREE.Mesh(rightWallGeo, stoneMat); 
rightWall.position.set(halfW, h / 2, 0); 
perimeterGroup.add(rightWall); 

const gateWidth = 6; 
const frontSegmentWidth = (CITY_CONFIG.width - gateWidth) / 2; 

const frontLeftGeo = new THREE.BoxGeometry(frontSegmentWidth, h, 1); 
const frontLeft = new THREE.Mesh(frontLeftGeo, stoneMat); 
frontLeft.position.set(-(halfW + gateWidth / 2) / 2, h / 2, halfD); 
perimeterGroup.add(frontLeft); 

const frontRightGeo = new THREE.BoxGeometry(frontSegmentWidth, h, 1); 
const frontRight = new THREE.Mesh(frontRightGeo, stoneMat); 
frontRight.position.set((halfW + gateWidth / 2) / 2, h / 2, halfD); 
perimeterGroup.add(frontRight); 

const bunnyGateGroup = new THREE.Group(); 
const headGeo = new THREE.BoxGeometry(gateWidth, 4, 1.5); 
const headMesh = new THREE.Mesh(headGeo, stoneMat); 
headMesh.position.set(0, h + 2, halfD); 
bunnyGateGroup.add(headMesh); 

const leftEarGeo = new THREE.BoxGeometry(1.2, 3.5, 1.2); 
const leftEar = new THREE.Mesh(leftEarGeo, stoneMat); 
leftEar.position.set(-1.8, h + 5.25, halfD); 
bunnyGateGroup.add(leftEar); 

const rightEarGeo = new THREE.BoxGeometry(1.2, 3.5, 1.2); 
const rightEar = new THREE.Mesh(rightEarGeo, stoneMat); 
rightEar.position.set(1.8, h + 5.25, halfD); 
bunnyGateGroup.add(rightEar); 

const innerEarGeo = new THREE.BoxGeometry(0.6, 2.8, 0.2); 
const pinkMat = new THREE.MeshBasicMaterial({ color: 0xffaacc }); 
const leftInnerEar = new THREE.Mesh(innerEarGeo, pinkMat); 
leftInnerEar.position.set(-1.8, h + 5.25, halfD + 0.51); 
bunnyGateGroup.add(leftInnerEar); 

const rightInnerEar = leftInnerEar.clone(); 
rightInnerEar.position.x = 1.8; 
bunnyGateGroup.add(rightInnerEar); 

const signGeo = new THREE.BoxGeometry(4.5, 0.8, 0.1); 
const signMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 }); 
const sign = new THREE.Mesh(signGeo, signMat); 
sign.position.set(0, h - 0.5, halfD + 0.8); 
bunnyGateGroup.add(sign); 

perimeterGroup.add(bunnyGateGroup); 
scene.add(perimeterGroup); 

const playerGeo = new THREE.SphereGeometry(0.6, 16, 16); 
const playerMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); 
const player = new THREE.Mesh(playerGeo, playerMat); 
player.position.set(0, 0.6, halfD + 5); 
scene.add(player); 

const keys = { w: false, a: false, s: false, d: false }; 

window.addEventListener('keydown', (e) => { 
  if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true; 
}); 

window.addEventListener('keyup', (e) => { 
  if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false; 
}); 

const houseGeo = new THREE.BoxGeometry(2, 3, 2); 
const houseMat = new THREE.MeshBasicMaterial({ color: 0xff88aa }); 
const house1 = new THREE.Mesh(houseGeo, houseMat); 
house1.position.set(-4, 1.5, 0); 
scene.add(house1); 

const house2 = new THREE.Mesh(houseGeo, houseMat); 
house2.position.set(4, 1.5, -4); 
scene.add(house2); 

function runGameLoop() { 
  requestAnimationFrame(runGameLoop); 
  const speed = 0.15; 
  if (keys.w) player.position.z -= speed; 
  if (keys.s) player.position.z += speed; 
  if (keys.a) player.position.x -= speed; 
  if (keys.d) player.position.x += speed; 
  camera.position.x = player.position.x; 
  camera.position.z = player.position.z + 12; 
  house1.rotation.y += 0.003; 
  house2.rotation.y -= 0.002; 
  renderer.render(scene, camera); 
} 

runGameLoop(); 

window.addEventListener('resize', () => { 
  camera.aspect = window.innerWidth / window.innerHeight; 
  camera.updateProjectionMatrix(); 
  renderer.setSize(window.innerWidth, window.innerHeight); 
});