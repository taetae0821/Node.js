import * as THREE from "three";

const canvas = document.getElementById("gameCanvas");
const leftScoreEl = document.getElementById("leftScore");
const rightScoreEl = document.getElementById("rightScore");
const storyTextEl = document.getElementById("storyText");
const chapterEl = document.getElementById("chapter");
const messageEl = document.getElementById("message");

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xbfd8e9, 18, 48);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(16, 6.5, 0);
camera.lookAt(0, 2.2, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.setClearColor(0x5f7f99, 1);

scene.add(new THREE.AmbientLight(0xffffff, 0.72));
const keyLight = new THREE.DirectionalLight(0xfff2d8, 1.1);
keyLight.position.set(5, 11, 6);
keyLight.castShadow = true;
scene.add(keyLight);

const courtWidth = 12;
const courtDepth = 18;
const gravity = 13.8;

const ground = new THREE.Mesh(
  new THREE.BoxGeometry(courtWidth, 0.5, courtDepth),
  new THREE.MeshStandardMaterial({ color: 0xd89f62, roughness: 0.85 })
);
ground.position.y = -0.25;
ground.receiveShadow = true;
scene.add(ground);

const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
function addLine(x, z, w, d) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, 0.03, d), lineMat);
  mesh.position.set(x, 0.01, z);
  scene.add(mesh);
}
addLine(0, 0, courtWidth, 0.08);
addLine(0, courtDepth / 2 - 0.1, courtWidth, 0.08);
addLine(0, -courtDepth / 2 + 0.1, courtWidth, 0.08);
addLine(-courtWidth / 2 + 0.1, 0, 0.08, courtDepth);
addLine(courtWidth / 2 - 0.1, 0, 0.08, courtDepth);

const net = new THREE.Mesh(
  new THREE.BoxGeometry(courtWidth, 1.5, 0.12),
  new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.3, metalness: 0.1 })
);
net.position.y = 0.75;
scene.add(net);

const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.6, 10);
const poleMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
const poleL = new THREE.Mesh(poleGeo, poleMat);
const poleR = new THREE.Mesh(poleGeo, poleMat);
poleL.position.set(-courtWidth / 2, 1.3, 0);
poleR.position.set(courtWidth / 2, 1.3, 0);
scene.add(poleL, poleR);

function createStadium() {
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(34, 0.45, 42),
    new THREE.MeshStandardMaterial({ color: 0x576574, roughness: 0.9 })
  );
  floor.position.y = -0.55;
  floor.receiveShadow = true;
  scene.add(floor);

  const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.82 });
  const standA = new THREE.Mesh(new THREE.BoxGeometry(34, 3.5, 4.8), standMat);
  standA.position.set(0, 1.25, courtDepth / 2 + 2.6);
  const standB = new THREE.Mesh(new THREE.BoxGeometry(34, 3.5, 4.8), standMat);
  standB.position.set(0, 1.25, -courtDepth / 2 - 2.6);
  const standC = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.5, 30), standMat);
  standC.position.set(courtWidth / 2 + 2.7, 1.25, 0);
  const standD = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.5, 30), standMat);
  standD.position.set(-courtWidth / 2 - 2.7, 1.25, 0);
  standA.receiveShadow = true;
  standB.receiveShadow = true;
  standC.receiveShadow = true;
  standD.receiveShadow = true;
  scene.add(standA, standB, standC, standD);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.95 });
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(34, 6, 0.6), wallMat);
  backWall.position.set(0, 3.1, -courtDepth / 2 - 5.2);
  scene.add(backWall);

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(34, 0.35, 42),
    new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.98 })
  );
  roof.position.y = 8.2;
  scene.add(roof);

  const lightBarMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, emissive: 0x2a2a2a, roughness: 0.3 });
  const bar1 = new THREE.Mesh(new THREE.BoxGeometry(20, 0.16, 0.3), lightBarMat);
  const bar2 = new THREE.Mesh(new THREE.BoxGeometry(20, 0.16, 0.3), lightBarMat);
  bar1.position.set(0, 7.2, -3.4);
  bar2.position.set(0, 7.2, 3.4);
  scene.add(bar1, bar2);

  const fillLightA = new THREE.PointLight(0xeef6ff, 0.46, 42);
  const fillLightB = new THREE.PointLight(0xeef6ff, 0.46, 42);
  fillLightA.position.set(0, 7.1, -3.4);
  fillLightB.position.set(0, 7.1, 3.4);
  scene.add(fillLightA, fillLightB);
}
createStadium();

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function createTextBadge(text, bgColor, fgColor, width = 128, height = 128, fontSize = 74) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = fgColor;
  ctx.font = `900 ${fontSize}px Segoe UI`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  return new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.24), material);
}

function buildPlayer(jerseyColor, accentColor, number, role) {
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd7b3, roughness: 0.8 });
  const jerseyMat = new THREE.MeshStandardMaterial({ color: jerseyColor, roughness: 0.6 });
  const shortMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.5 });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.88, 6, 12), jerseyMat);
  torso.position.y = 1.22;
  torso.castShadow = true;

  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.24, 0.34), shortMat);
  pelvis.position.y = 0.7;
  pelvis.castShadow = true;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 12), skinMat);
  head.position.y = 1.95;
  head.castShadow = true;

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.225, 12, 10), new THREE.MeshStandardMaterial({ color: 0x2c2b2a, roughness: 1 }));
  hair.position.y = 2.04;
  hair.scale.set(1, 0.65, 1);
  hair.castShadow = true;

  const armGeo = new THREE.CapsuleGeometry(0.08, 0.45, 4, 8);
  const legGeo = new THREE.CapsuleGeometry(0.1, 0.56, 4, 10);

  const leftArm = new THREE.Mesh(armGeo, skinMat);
  leftArm.position.set(-0.34, 1.35, 0);
  leftArm.castShadow = true;

  const rightArm = new THREE.Mesh(armGeo, skinMat);
  rightArm.position.set(0.34, 1.35, 0);
  rightArm.castShadow = true;

  const leftLeg = new THREE.Mesh(legGeo, shortMat);
  leftLeg.position.set(-0.14, 0.28, 0.02);
  leftLeg.castShadow = true;

  const rightLeg = new THREE.Mesh(legGeo, shortMat);
  rightLeg.position.set(0.14, 0.28, 0.02);
  rightLeg.castShadow = true;

  const backNumber = createTextBadge(String(number), "#ffffff", "#0f172a");
  backNumber.position.set(0, 1.24, 0.22);

  const frontNumber = createTextBadge(String(number), "#ffffff", "#0f172a");
  frontNumber.position.set(0, 1.18, -0.22);
  frontNumber.rotation.y = Math.PI;

  const roleTag = createTextBadge(role, "#111827", "#f8fafc", 192, 80, 42);
  roleTag.position.set(0, 2.25, 0);

  group.add(torso, pelvis, head, hair, leftArm, rightArm, leftLeg, rightLeg, backNumber, frontNumber, roleTag);
  group.userData.parts = { torso, leftArm, rightArm, leftLeg, rightLeg };
  return group;
}

const ROLE_STATS = {
  S: { speed: 4.6, jump: 6.7, hit: 6.2, reaction: 1.08 },
  OH: { speed: 4.8, jump: 6.9, hit: 6.9, reaction: 1.0 },
  MB: { speed: 4.2, jump: 7.5, hit: 7.2, reaction: 0.95 },
  OP: { speed: 4.5, jump: 7.1, hit: 7.4, reaction: 1.0 },
  L: { speed: 5.1, jump: 6.1, hit: 5.8, reaction: 1.16 },
};

function createTeam(side, jerseyColor, accentColor) {
  const formation =
    side === "left"
      ? [
          { x: -2.8, z: 6.7, role: "OH", number: 4 },
          { x: 0.0, z: 6.9, role: "S", number: 2 },
          { x: 2.8, z: 6.7, role: "L", number: 12 },
          { x: -2.8, z: 2.5, role: "MB", number: 9 },
          { x: 0.0, z: 2.3, role: "OP", number: 1 },
          { x: 2.8, z: 2.5, role: "MB", number: 11 },
        ]
      : [
          { x: -2.8, z: 6.7, role: "OH", number: 3 },
          { x: 0.0, z: 6.9, role: "S", number: 7 },
          { x: 2.8, z: 6.7, role: "L", number: 14 },
          { x: -2.8, z: 2.5, role: "MB", number: 5 },
          { x: 0.0, z: 2.3, role: "OP", number: 10 },
          { x: 2.8, z: 2.5, role: "MB", number: 8 },
        ];

  const sign = side === "left" ? 1 : -1;
  const slots = formation.map((f) => ({ x: f.x, z: f.z * sign }));
  const team = [];
  for (let i = 0; i < 6; i += 1) {
    const { role, number } = formation[i];
    const stats = ROLE_STATS[role];
    const player = buildPlayer(jerseyColor, accentColor, number, role);
    const homeX = slots[i].x;
    const homeZ = slots[i].z;

    player.position.set(homeX, 0, homeZ);
    scene.add(player);

    team.push({
      mesh: player,
      side,
      homeX,
      homeZ,
      targetX: homeX,
      targetZ: homeZ,
      velX: 0,
      velZ: 0,
      velY: 0,
      grounded: true,
      hitCooldown: 0,
      swing: 0,
      phase: Math.random() * Math.PI * 2,
      role,
      number,
      stats,
      slotIndex: i,
      blockTimer: 0,
    });
  }

  team.slots = slots;

  return team;
}

const leftTeam = createTeam("left", 0xe85d04, 0x6f1d1b);
const rightTeam = createTeam("right", 0x457b9d, 0x1d3557);

let userIndex = 1;
let userPlayer = leftTeam[userIndex];
let autoSwitchTimer = 0;
let spikeBuffer = 0;
let blockBuffer = 0;

const userMarker = new THREE.Mesh(
  new THREE.TorusGeometry(0.38, 0.04, 10, 28),
  new THREE.MeshBasicMaterial({ color: 0xfff8b8 })
);
userMarker.rotation.x = Math.PI / 2;
userMarker.position.y = 0.06;
scene.add(userMarker);

const ballRadius = 0.24;
const ball = new THREE.Mesh(
  new THREE.SphereGeometry(ballRadius, 18, 18),
  new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.05 })
);
ball.castShadow = true;
scene.add(ball);

const shadow = new THREE.Mesh(
  new THREE.CircleGeometry(0.28, 20),
  new THREE.MeshBasicMaterial({ color: 0x111827, transparent: true, opacity: 0.2 })
);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = 0.01;
scene.add(shadow);

const state = {
  scoreLeft: 0,
  scoreRight: 0,
  servingLeft: true,
  gameEnded: false,
  awaitingServe: true,
  serveTimer: 0,
  ballPos: new THREE.Vector3(),
  ballVel: new THREE.Vector3(),
  lastTouch: "left",
  rallyCount: 0,
};

const ROTATION_RING = [2, 5, 4, 3, 0, 1];

const SERVE_TYPES = {
  float: { label: "플로터", speed: 7.4, up: 7.6, side: 1.1, failChance: 0.12 },
  jump: { label: "점프서브", speed: 8.6, up: 8.2, side: 1.4, failChance: 0.2 },
  power: { label: "파워서브", speed: 9.4, up: 7.7, side: 1.8, failChance: 0.3 },
};

const CAMERA_MODES = [
  { id: "fp", label: "1인칭" },
  { id: "side", label: "사이드" },
  { id: "follow", label: "팔로우" },
  { id: "top", label: "탑" },
  { id: "back", label: "백코트" },
];
let cameraModeIndex = 2;
let selectedServeType = "float";

const keys = new Set();
const pressed = new Set();
window.addEventListener("keydown", (e) => {
  const firstPress = !keys.has(e.code);
  if (firstPress) pressed.add(e.code);
  keys.add(e.code);

  if (e.code === "KeyR") resetRally(state.servingLeft);
  if (e.code === "KeyQ") switchControlledPlayer(-1);
  if (e.code === "KeyE") switchControlledPlayer(1);
  if (e.code === "KeyJ") spikeBuffer = 0.2;
  if (e.code === "KeyZ") setServeType("float");
  if (e.code === "KeyX") setServeType("jump");
  if (e.code === "KeyV") setServeType("power");

  if (firstPress) {
    if (e.code === "KeyC") setCameraMode((cameraModeIndex + 1) % CAMERA_MODES.length);
    if (e.code === "Digit1") setCameraMode(0);
    if (e.code === "Digit2") setCameraMode(1);
    if (e.code === "Digit3") setCameraMode(2);
    if (e.code === "Digit4") setCameraMode(3);
    if (e.code === "Digit5") setCameraMode(4);
  }
});
window.addEventListener("keyup", (e) => {
  keys.delete(e.code);
});
window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
window.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    pressed.add("MouseLeft");
    spikeBuffer = 0.2;
  }
  if (e.button === 2) {
    pressed.add("MouseRight");
    blockBuffer = 0.24;
  }
});

function wasPressed(code) {
  return pressed.has(code);
}

function flushPressed() {
  pressed.clear();
}

function showMessage(text) {
  messageEl.textContent = text;
  messageEl.classList.add("show");
  clearTimeout(showMessage.timer);
  showMessage.timer = setTimeout(() => messageEl.classList.remove("show"), 1400);
}

function setCameraMode(index) {
  cameraModeIndex = clamp(index, 0, CAMERA_MODES.length - 1);
  showMessage(`카메라: ${CAMERA_MODES[cameraModeIndex].label}`);
}

function setServeType(type) {
  if (!SERVE_TYPES[type]) return;
  selectedServeType = type;
  showMessage(`서브 타입: ${SERVE_TYPES[type].label}`);
}

function switchControlledPlayer(step) {
  userIndex = (userIndex + step + leftTeam.length) % leftTeam.length;
  userPlayer = leftTeam[userIndex];
  showMessage(`조종 선수 변경: ${userPlayer.number}번 ${userPlayer.role}`);
}

function autoSelectUserPlayer() {
  const teamBallZ = Math.max(0.7, state.ballPos.z);
  let bestIndex = userIndex;
  let bestDist = Infinity;

  for (let i = 0; i < leftTeam.length; i += 1) {
    const p = leftTeam[i];
    const dx = state.ballPos.x - p.mesh.position.x;
    const dz = teamBallZ - p.mesh.position.z;
    const d = dx * dx + dz * dz;
    if (d < bestDist) {
      bestDist = d;
      bestIndex = i;
    }
  }

  if (bestIndex !== userIndex) {
    userIndex = bestIndex;
    userPlayer = leftTeam[userIndex];
  }
}

function updateStory() {
  const total = state.scoreLeft + state.scoreRight;
  if (state.gameEnded) {
    chapterEl.textContent = "FINAL SET. 하늘 끝의 한 점";
    storyTextEl.textContent =
      state.scoreLeft > state.scoreRight
        ? "12명이 만든 승리다. 마지막 랠리에서 팀의 호흡이 완벽하게 맞아떨어졌다."
        : "패배했지만 완성된 팀워크를 얻었다. 다음 경기에서는 반드시 벽을 넘는다.";
    return;
  }

  if (total >= 10) {
    chapterEl.textContent = "CHAPTER 3. 6명의 템포";
    storyTextEl.textContent = "한 명의 슈퍼플레이보다 6명의 연결이 중요해지는 구간이다.";
  } else if (total >= 5) {
    chapterEl.textContent = "CHAPTER 2. 라인 로테이션";
    storyTextEl.textContent = "전위와 후위의 간격이 벌어지면 바로 실점한다. 커버를 조여야 한다.";
  } else {
    chapterEl.textContent = "CHAPTER 1. 다시 뛰는 이유";
    storyTextEl.textContent = "무너진 마지막 경기 이후, 너는 6명의 동료와 다시 코트에 섰다.";
  }
}

function resetTeam(team) {
  for (const p of team) {
    const slot = team.slots[p.slotIndex];
    p.homeX = slot.x;
    p.homeZ = slot.z;
    p.mesh.position.set(p.homeX, 0, p.homeZ);
    p.targetX = p.homeX;
    p.targetZ = p.homeZ;
    p.velX = 0;
    p.velZ = 0;
    p.velY = 0;
    p.grounded = true;
    p.hitCooldown = 0;
    p.swing = 0;
    p.blockTimer = 0;
  }
}

function getServer(side) {
  const team = side === "left" ? leftTeam : rightTeam;
  return team.find((p) => p.slotIndex === 2) || team[0];
}

function syncServeBallPosition() {
  const side = state.servingLeft ? "left" : "right";
  const server = getServer(side);
  const zOffset = side === "left" ? 0.6 : -0.6;
  state.ballPos.set(server.mesh.position.x, server.mesh.position.y + 1.75, server.mesh.position.z + zOffset);
  ball.position.copy(state.ballPos);
  shadow.position.x = state.ballPos.x;
  shadow.position.z = state.ballPos.z;
  shadow.material.opacity = 0.22;
}

function pickAiServeType() {
  const roll = Math.random();
  if (roll < 0.5) return "float";
  if (roll < 0.82) return "jump";
  return "power";
}

function launchServe(side, serveType = "float") {
  const profile = SERVE_TYPES[serveType] || SERVE_TYPES.float;
  const server = getServer(side);
  const toOpp = side === "left" ? -1 : 1;
  const skillBonus = clamp((server.stats.hit - 6.3) * 0.015, -0.03, 0.04);
  const failChance = clamp(profile.failChance - skillBonus, 0.06, 0.36);

  if (Math.random() < failChance) {
    state.awaitingServe = false;
    state.serveTimer = 0;
    const winner = side === "left" ? "right" : "left";
    const reason = side === "left" ? `${profile.label} 실패! 상대 득점` : `상대 ${profile.label} 실패! 우리 득점`;
    scorePoint(winner, reason);
    return;
  }

  state.awaitingServe = false;
  state.serveTimer = 0;
  state.lastTouch = side;

  const lateral = clamp((server.mesh.position.x - state.ballPos.x) * 1.3 + (Math.random() - 0.5) * profile.side, -3.4, 3.4);
  state.ballVel.set(lateral, profile.up, profile.speed * toOpp);
  server.hitCooldown = 0.2;
  server.swing = 0.95;
}

function rotateTeam(team) {
  for (const p of team) {
    const ringPos = ROTATION_RING.indexOf(p.slotIndex);
    if (ringPos !== -1) {
      p.slotIndex = ROTATION_RING[(ringPos + 1) % ROTATION_RING.length];
    }
  }
}

function resetRally(servingLeft = true) {
  state.servingLeft = servingLeft;
  state.ballVel.set(0, 0, 0);
  state.awaitingServe = true;
  state.serveTimer = 0.55;
  state.lastTouch = servingLeft ? "left" : "right";
  resetTeam(leftTeam);
  resetTeam(rightTeam);

  if (servingLeft) {
    const server = getServer("left");
    userIndex = leftTeam.indexOf(server);
    userPlayer = server;
    showMessage(`내 서브: ${SERVE_TYPES[selectedServeType].label} (좌클릭)`);
  } else {
    showMessage("상대 서브 준비...");
  }

  syncServeBallPosition();
}

function scorePoint(side, reasonText = "") {
  if (state.gameEnded) return;

  const servingSide = state.servingLeft ? "left" : "right";
  let rotationMessage = "";
  if (side !== servingSide) {
    if (side === "left") {
      rotateTeam(leftTeam);
      rotationMessage = " 좌팀 로테이션";
    } else {
      rotateTeam(rightTeam);
      rotationMessage = " 우팀 로테이션";
    }
  }

  if (side === "left") {
    state.scoreLeft += 1;
    showMessage(reasonText || `득점! 팀 플레이가 살아난다.${rotationMessage}`);
  } else {
    state.scoreRight += 1;
    showMessage(reasonText || `실점... 위치를 다시 맞추자!${rotationMessage}`);
  }

  leftScoreEl.textContent = String(state.scoreLeft);
  rightScoreEl.textContent = String(state.scoreRight);
  updateStory();

  if ((state.scoreLeft >= 15 || state.scoreRight >= 15) && Math.abs(state.scoreLeft - state.scoreRight) >= 2) {
    state.gameEnded = true;
    showMessage(state.scoreLeft > state.scoreRight ? "승리! 6명의 합이 완성됐다." : "패배... 다음에는 더 단단하게.");
    return;
  }

  resetRally(side === "left");
}

function updateHumanoidAnimation(player, dt) {
  const parts = player.mesh.userData.parts;
  const speed = Math.hypot(player.velX, player.velZ);
  player.phase += dt * (5 + speed * 1.8);
  const stride = Math.min(1, speed / 3.2) * 0.55;

  parts.leftLeg.rotation.x = Math.sin(player.phase) * stride;
  parts.rightLeg.rotation.x = -Math.sin(player.phase) * stride;
  const blockPose = player.blockTimer > 0 ? 1.35 : 0;
  parts.leftArm.rotation.x = -Math.sin(player.phase) * stride * 0.7 + player.swing - blockPose;
  parts.rightArm.rotation.x = Math.sin(player.phase) * stride * 0.7 + player.swing - blockPose;
  parts.torso.rotation.z = clamp(player.velX * 0.03, -0.2, 0.2);

  player.swing *= Math.max(0, 1 - dt * 6.5);
}

function updatePlayerMovement(player, dt, maxSpeed, accel, drag) {
  const dx = player.targetX - player.mesh.position.x;
  const dz = player.targetZ - player.mesh.position.z;
  const dist = Math.hypot(dx, dz);

  let dirX = 0;
  let dirZ = 0;
  if (dist > 0.01) {
    dirX = dx / dist;
    dirZ = dz / dist;
  }

  player.velX += dirX * accel * dt;
  player.velZ += dirZ * accel * dt;

  player.velX *= Math.max(0, 1 - drag * dt);
  player.velZ *= Math.max(0, 1 - drag * dt);

  const speed = Math.hypot(player.velX, player.velZ);
  if (speed > maxSpeed) {
    const s = maxSpeed / speed;
    player.velX *= s;
    player.velZ *= s;
  }

  player.mesh.position.x += player.velX * dt;
  player.mesh.position.z += player.velZ * dt;

  player.mesh.position.x = clamp(player.mesh.position.x, -courtWidth / 2 + 0.5, courtWidth / 2 - 0.5);
  if (player.side === "left") {
    player.mesh.position.z = clamp(player.mesh.position.z, 0.6, courtDepth / 2 - 0.5);
  } else {
    player.mesh.position.z = clamp(player.mesh.position.z, -courtDepth / 2 + 0.5, -0.6);
  }

  if (!player.grounded) {
    player.velY -= gravity * dt;
    player.mesh.position.y += player.velY * dt;
    if (player.mesh.position.y <= 0) {
      player.mesh.position.y = 0;
      player.velY = 0;
      player.grounded = true;
    }
  }

  player.hitCooldown = Math.max(0, player.hitCooldown - dt);
  player.blockTimer = Math.max(0, player.blockTimer - dt);
  updateHumanoidAnimation(player, dt);
}

function tryHitBall(player, forceZ, upBoost, sidePush = 2.0) {
  if (player.hitCooldown > 0) return false;

  const dist = player.mesh.position.distanceTo(state.ballPos);
  if (dist > 1.12 || state.ballPos.y < 0.45) return false;

  const isReceive = state.lastTouch !== player.side;
  if (isReceive) {
    const speedPressure = clamp((Math.abs(state.ballVel.z) - 6.4) * 0.03, 0, 0.16);
    const reactionBonus = clamp((player.stats.reaction - 1) * 0.11, -0.05, 0.06);
    const receiveFailChance = clamp(0.2 + speedPressure - reactionBonus, 0.07, 0.36);

    if (Math.random() < receiveFailChance) {
      state.lastTouch = player.side;
      state.ballVel.x = clamp((Math.random() - 0.5) * 10.5, -8.4, 8.4);
      state.ballVel.z = player.side === "left" ? 5.8 : -5.8;
      state.ballVel.y = 1.6 + Math.random() * 1.2;
      player.hitCooldown = 0.3;
      player.swing = 0.45;
      if (player === userPlayer) {
        showMessage("리시브 미스!");
      }
      return false;
    }
  }

  const dirX = clamp((state.ballPos.x - player.mesh.position.x) * sidePush, -4.8, 4.8);
  const hitMul = player.stats.hit / 6.8;
  const jumpMul = player.stats.jump / 6.8;
  state.ballVel.x = dirX;
  state.ballVel.z = forceZ * hitMul;
  state.ballVel.y = upBoost * jumpMul;
  state.lastTouch = player.side;
  state.rallyCount += 1;

  player.hitCooldown = 0.36;
  player.swing = 0.9;
  return true;
}

function pickChaser(team) {
  let best = team[0];
  let bestDist = Infinity;

  for (const p of team) {
    const dx = state.ballPos.x - p.mesh.position.x;
    const dz = state.ballPos.z - p.mesh.position.z;
    const d = dx * dx + dz * dz;
    if (d < bestDist) {
      bestDist = d;
      best = p;
    }
  }

  return best;
}

function tryBlockBall(player) {
  if (player.blockTimer <= 0) return false;

  const nearNet = Math.abs(player.mesh.position.z) < 3.2;
  if (!nearNet) return false;

  const dist = player.mesh.position.distanceTo(state.ballPos);
  if (dist > 1.35 || state.ballPos.y < 1.0 || state.ballPos.y > 3.4) return false;

  const dirToOpp = player.side === "left" ? -1 : 1;
  state.ballVel.z = dirToOpp * Math.max(4.8, Math.abs(state.ballVel.z) * 0.95);
  state.ballVel.x = clamp(state.ballVel.x + (Math.random() - 0.5) * 1.2, -6.0, 6.0);
  state.ballVel.y = Math.max(5.6, state.ballVel.y * 0.75 + 1.2);
  state.lastTouch = player.side;
  player.hitCooldown = 0.24;
  return true;
}

function controlUserPlayer() {
  let inputX = 0;
  let inputZ = 0;
  if (keys.has("KeyA")) inputX -= 1;
  if (keys.has("KeyD")) inputX += 1;
  if (keys.has("KeyW")) inputZ -= 1;
  if (keys.has("KeyS")) inputZ += 1;

  const len = Math.hypot(inputX, inputZ) || 1;
  inputX /= len;
  inputZ /= len;

  userPlayer.targetX = userPlayer.mesh.position.x + inputX * 1.8;
  userPlayer.targetZ = userPlayer.mesh.position.z + inputZ * 1.8;

  if (state.awaitingServe) {
    if (state.servingLeft) {
      const server = getServer("left");
      if (userPlayer !== server) {
        userIndex = leftTeam.indexOf(server);
        userPlayer = server;
      }

      if (wasPressed("MouseLeft") || keys.has("KeyJ") || spikeBuffer > 0) {
        launchServe("left", selectedServeType);
      }
    }
    return;
  }

  if (wasPressed("Space") && userPlayer.grounded) {
    userPlayer.grounded = false;
    userPlayer.velY = userPlayer.stats.jump;
  }

  const spikePressed = wasPressed("MouseLeft") || keys.has("KeyJ") || spikeBuffer > 0;
  if (spikePressed) {
    const spike = !userPlayer.grounded;
    if (spike) {
      tryHitBall(userPlayer, -7.8, 8.0, 2.5);
    } else {
      tryHitBall(userPlayer, -5.8, 7.0, 2.0);
    }
  }

  if (wasPressed("MouseRight") || blockBuffer > 0) {
    userPlayer.blockTimer = 0.26;
    userPlayer.swing = 0.4;
    if (userPlayer.grounded) {
      userPlayer.grounded = false;
      userPlayer.velY = userPlayer.stats.jump * 0.9;
    }
  }

  if (userPlayer.blockTimer > 0) {
    tryBlockBall(userPlayer);
  }
}

function updateTeamAI(team, dt) {
  const chaser = pickChaser(team);

  for (const p of team) {
    const isUser = p === userPlayer && p.side === "left";
    if (isUser) {
      const maxSpeed = p.stats.speed + 0.35;
      const accel = 20;
      const drag = 8;
      updatePlayerMovement(p, dt, maxSpeed, accel, drag);
      continue;
    }

    const onTeamBallSide = p.side === "left" ? state.ballPos.z > 0 : state.ballPos.z < 0;
    const chaseThis = p === chaser && onTeamBallSide;

    if (chaseThis) {
      p.targetX = clamp(state.ballPos.x, -courtWidth / 2 + 0.7, courtWidth / 2 - 0.7);
      p.targetZ = clamp(state.ballPos.z + (p.side === "left" ? -0.8 : 0.8), p.side === "left" ? 0.7 : -courtDepth / 2 + 0.7, p.side === "left" ? courtDepth / 2 - 0.7 : -0.7);

      if (state.ballPos.y > 1.4 && p.grounded && Math.abs(state.ballPos.z - p.mesh.position.z) < 1.2) {
        p.grounded = false;
        p.velY = p.stats.jump * 0.94;
      }

      if (p.side === "left") {
        tryHitBall(p, -6.3, 7.3, 2.0);
      } else {
        tryHitBall(p, 6.3, 7.3, 2.0);
      }
    } else {
      p.targetX = p.homeX;
      p.targetZ = p.homeZ;
    }

    const maxSpeed = p.stats.speed;
    const accel = 12 * p.stats.reaction;
    const drag = 6.8;
    updatePlayerMovement(p, dt, maxSpeed, accel, drag);

    // Opponent front blockers get slight net pressure when ball is near the tape.
    if (
      p.role === "MB" &&
      Math.abs(p.homeZ) < 3.0 &&
      Math.abs(state.ballPos.z) < 1.2 &&
      state.ballPos.y > 1.2 &&
      p.grounded &&
      Math.abs(state.ballPos.x - p.mesh.position.x) < 0.9
    ) {
      p.grounded = false;
      p.velY = p.stats.jump * 0.9;
    }
  }
}

function updateBallPhysics(dt) {
  state.ballVel.y -= 12.9 * dt;
  state.ballVel.x *= Math.max(0, 1 - dt * 0.08);
  state.ballVel.z *= Math.max(0, 1 - dt * 0.04);
  state.ballPos.addScaledVector(state.ballVel, dt);

  if (state.ballPos.x < -courtWidth / 2 + ballRadius) {
    state.ballPos.x = -courtWidth / 2 + ballRadius;
    state.ballVel.x *= -0.68;
  }
  if (state.ballPos.x > courtWidth / 2 - ballRadius) {
    state.ballPos.x = courtWidth / 2 - ballRadius;
    state.ballVel.x *= -0.68;
  }

  if (Math.abs(state.ballPos.z) < 0.16 && state.ballPos.y < 1.75) {
    state.ballPos.z = state.ballPos.z > 0 ? 0.16 : -0.16;
    state.ballVel.z *= -0.6;
    state.ballVel.y *= 0.88;
  }

  const maxVz = 9.2;
  state.ballVel.z = clamp(state.ballVel.z, -maxVz, maxVz);

  if (state.ballPos.y <= ballRadius) {
    state.ballPos.y = ballRadius;

    if (state.ballVel.y < -0.45) {
      const landedSide = state.ballPos.z > 0 ? "left" : "right";
      scorePoint(landedSide === "left" ? "right" : "left");
      return;
    }

    state.ballVel.y *= -0.52;
    state.ballVel.x *= 0.82;
    state.ballVel.z *= 0.82;
  }

  ball.position.copy(state.ballPos);
  shadow.position.x = state.ballPos.x;
  shadow.position.z = state.ballPos.z;
  shadow.material.opacity = clamp(0.3 - state.ballPos.y * 0.035, 0.05, 0.25);
}

function updateCamera(dt) {
  const mode = CAMERA_MODES[cameraModeIndex].id;
  let targetX = 16;
  let targetY = 6 + state.ballPos.y * 0.08;
  let targetZ = clamp(state.ballPos.z * 0.3, -2.8, 2.8);
  let lookX = 0;
  let lookY = 1.8;
  let lookZ = 0;

  if (mode === "fp") {
    targetX = userPlayer.mesh.position.x;
    targetY = userPlayer.mesh.position.y + 1.78;
    targetZ = userPlayer.mesh.position.z - 0.08;
    lookX = userPlayer.mesh.position.x;
    lookY = userPlayer.mesh.position.y + 1.72;
    lookZ = userPlayer.mesh.position.z - 8;
  } else if (mode === "follow") {
    targetX = clamp(userPlayer.mesh.position.x, -courtWidth / 2 + 0.8, courtWidth / 2 - 0.8);
    targetY = userPlayer.mesh.position.y + 2.5;
    targetZ = clamp(userPlayer.mesh.position.z + 4.8, 2.8, courtDepth / 2 + 4.0);
    lookX = userPlayer.mesh.position.x;
    lookY = userPlayer.mesh.position.y + 1.4;
    lookZ = clamp(userPlayer.mesh.position.z - 5.0, -2.8, 1.8);
  } else if (mode === "top") {
    targetX = 0;
    targetY = 20;
    targetZ = 0;
    lookX = 0;
    lookY = 0;
    lookZ = 0;
  } else if (mode === "back") {
    targetX = 0;
    targetY = 5.4;
    targetZ = courtDepth / 2 + 4.4;
    lookX = 0;
    lookY = 1.7;
    lookZ = -1.8;
  }

  camera.position.x += (targetX - camera.position.x) * Math.min(1, dt * 3.2);
  camera.position.y += (targetY - camera.position.y) * Math.min(1, dt * 2.9);
  camera.position.z += (targetZ - camera.position.z) * Math.min(1, dt * 2.8);
  camera.lookAt(lookX, lookY, lookZ);
}

function updateMarkers() {
  userMarker.position.x = userPlayer.mesh.position.x;
  userMarker.position.z = userPlayer.mesh.position.z;
}

const clock = new THREE.Clock();
resetRally(true);
updateStory();
showMessage("6대6 경기 시작! 현재 3인칭, C 또는 1~5로 화면 전환");

function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.033);
  autoSwitchTimer = Math.max(0, autoSwitchTimer - dt);
  spikeBuffer = Math.max(0, spikeBuffer - dt);
  blockBuffer = Math.max(0, blockBuffer - dt);

  if (!state.gameEnded) {
    if (autoSwitchTimer <= 0) {
      autoSelectUserPlayer();
      autoSwitchTimer = 0.28;
    }

    controlUserPlayer();
    updateTeamAI(leftTeam, dt);
    updateTeamAI(rightTeam, dt);

    if (state.awaitingServe) {
      syncServeBallPosition();
      if (!state.servingLeft) {
        state.serveTimer -= dt;
        if (state.serveTimer <= 0) {
          launchServe("right", pickAiServeType());
        }
      }
    } else {
      updateBallPhysics(dt);
    }
    updateMarkers();
  }

  updateCamera(dt);
  renderer.render(scene, camera);
  flushPressed();
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
