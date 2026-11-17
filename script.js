const gameState = {
  playerCount: 2,
  setupConfigs: [
    { name: "Pemain 1", pawnId: "garuda", isBot: false, botDiff: "santai" },
    { name: "Pemain 2", pawnId: "monas", isBot: false, botDiff: "santai" },
    { name: "Pemain 3", pawnId: "bintang", isBot: false, botDiff: "santai" },
    { name: "Pemain 4", pawnId: "padi", isBot: false, botDiff: "pintar" },
  ],
  players: [],
  currentPlayerIndex: 0,
  turnNumber: 1,
  isBusy: false,
  diceValue: 1,
  unusedQuestionIds: [],
  activeQuiz: null,
  quizTimerInterval: null,
  botActionTimeout: null,
  gameOver: false,
};

function getSquareGridCoords(squareNumber) {
  const clamped = Math.max(1, Math.min(100, squareNumber));
  const zeroIdx = clamped - 1;
  const rowFromBottom = Math.floor(zeroIdx / 10);
  const colInRow = zeroIdx % 10;
  const col = rowFromBottom % 2 === 0 ? colInRow : 9 - colInRow;
  const visualRow = 9 - rowFromBottom;
  return { visualRow, col };
}

function getSquareCenterPercent(squareNumber) {
  const { visualRow, col } = getSquareGridCoords(squareNumber);
  return {
    x: (col + 0.5) * 10,
    y: (visualRow + 0.5) * 10,
  };
}

function showToast(message, style = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  const bgMap = {
    success: "bg-emerald-500 text-white border-emerald-700",
    warning: "bg-amber-400 text-slate-900 border-amber-600",
    danger: "bg-rose-500 text-white border-rose-800",
    info: "bg-indigo-600 text-white border-indigo-800",
  };
  toast.className = `${bgMap[style] || bgMap.info} border-b-4 px-5 py-2.5 rounded-full shadow-xl font-arcade text-xs sm:text-sm font-bold text-center transition-all duration-300 transform translate-y-0 opacity-100`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("opacity-0", "-translate-y-3");
    setTimeout(() => toast.remove(), 300);
  }, 2400);
}

function renderSetupPlayers() {
  const list = document.getElementById("playerSetupList");
  list.innerHTML = "";

  const activeCount = gameState.playerCount;
  const quotaBadge = document.getElementById("lobbyPlayerQuotaBadge");
  const topAddBtn = document.getElementById("btnTopAddPlayer");

  if (quotaBadge) {
    quotaBadge.textContent = `${activeCount} / 4 Pemain Aktif`;
    quotaBadge.className =
      activeCount >= 4
        ? "font-arcade text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full bg-amber-500 text-slate-900 shadow-xs"
        : "font-arcade text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full bg-indigo-600 text-white shadow-xs";
  }

  if (topAddBtn) {
    topAddBtn.disabled = activeCount >= 4;
    topAddBtn.innerHTML =
      activeCount >= 4
        ? "<span>✓</span> Kuota Penuh (4/4)"
        : `<span>＋</span> Tambah Pemain (${activeCount}/4)`;
  }

  for (let i = 0; i < activeCount; i++) {
    const cfg = gameState.setupConfigs[i];
    const selectedTheme =
      PAWN_THEMES.find((p) => p.id === cfg.pawnId) || PAWN_THEMES[i];
    const canRemove = activeCount > 2;

    const card = document.createElement("div");
    card.className =
      "rounded-3xl p-4 border-4 transition shadow-md space-y-3 bg-white relative overflow-hidden";
    card.style.borderColor = selectedTheme.bg;

    const avatarButtons = PAWN_THEMES.map((pawn) => {
      const active = cfg.pawnId === pawn.id;
      return `
        <button
          type="button"
          onclick="selectSetupPawn(${i}, '${pawn.id}')"
          title="${pawn.label}"
          class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl text-xs font-bold border-2 transition ${
            active
              ? "scale-105 ring-2 ring-slate-800 shadow-sm"
              : "opacity-65 hover:opacity-100 border-transparent"
          }"
          style="background-color: ${pawn.bg}; color: ${pawn.text}; border-color: ${
            active ? "#FFFFFF" : "transparent"
          };"
        >
          ${pawn.svg}
          <span>${pawn.label.split(" ")[0]}</span>
        </button>
      `;
    }).join("");

    const currentTypeVal = cfg.isBot
      ? `bot-${cfg.botDiff || "santai"}`
      : "human";

    card.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span
            class="font-arcade text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs"
            style="background-color: ${selectedTheme.bg}; color: ${selectedTheme.text};"
          >
            ${cfg.isBot ? `🤖 Slot #${i + 1} (Bot AI)` : `🎮 Pemain #${i + 1}`}
          </span>
          <span class="text-xs font-extrabold text-slate-500 hidden sm:inline">
            ${selectedTheme.label}
          </span>
        </div>

        ${
          canRemove
            ? `<button
                type="button"
                onclick="removeLobbyPlayerSlot(${i})"
                title="Hapus Pemain Ini"
                class="px-2.5 py-1 rounded-xl bg-rose-100 hover:bg-rose-500 text-rose-700 hover:text-white text-xs font-extrabold transition flex items-center gap-1"
              >
                <span>🗑</span> Hapus
              </button>`
            : `<span class="text-[11px] font-bold text-slate-400">Wajib</span>`
        }
      </div>

      <!-- Input Nama & Pilihan Manusia / Bot AI -->
      <div class="grid grid-cols-1 sm:grid-cols-5 gap-2">
        <input
          type="text"
          maxlength="18"
          value="${cfg.name}"
          oninput="updateSetupName(${i}, this.value)"
          placeholder="Nama pemain..."
          class="sm:col-span-3 w-full px-3.5 py-2 rounded-2xl border-2 border-slate-200 bg-slate-50 focus:bg-white text-sm font-bold text-slate-800 focus:outline-none focus:border-monas"
        />

        <select
          onchange="updateSetupPlayerType(${i}, this.value)"
          aria-label="Tipe Pemain ${i + 1}"
          class="sm:col-span-2 w-full px-2.5 py-2 rounded-2xl border-2 border-slate-200 bg-slate-50 text-xs font-extrabold text-slate-700 focus:outline-none focus:border-monas cursor-pointer"
        >
          <option value="human" ${currentTypeVal === "human" ? "selected" : ""}>👤 Manusia</option>
          <option value="bot-santai" ${currentTypeVal === "bot-santai" ? "selected" : ""}>🤖 Bot Santai</option>
          <option value="bot-pintar" ${currentTypeVal === "bot-pintar" ? "selected" : ""}>🧠 Bot Pintar</option>
        </select>
      </div>

      <!-- Pilihan Avatar Pion -->
      <div>
        <div class="text-[11px] font-bold text-slate-400 mb-1.5">Pilih Pion Nusantara:</div>
        <div class="flex flex-wrap gap-1.5">
          ${avatarButtons}
        </div>
      </div>
    `;
    list.appendChild(card);
  }

  // Kartu Besar Interaktif "+ Tambah Pemain Baru" jika pemain masih < 4
  if (activeCount < 4) {
    const addCard = document.createElement("button");
    addCard.type = "button";
    addCard.onclick = addLobbyPlayerSlot;
    addCard.className =
      "btn-chunky group rounded-3xl p-6 border-4 border-dashed border-emerald-400 bg-emerald-50/70 hover:bg-emerald-100/90 hover:border-emerald-500 transition flex flex-col items-center justify-center text-center min-h-[180px] shadow-sm";
    addCard.innerHTML = `
      <div class="w-14 h-14 rounded-2xl bg-emerald-500 group-hover:scale-110 transition text-white font-arcade text-3xl flex items-center justify-center shadow-md mb-2.5">
        ＋
      </div>
      <div class="font-arcade font-bold text-base sm:text-lg text-emerald-900">
        Tambah Pemain ke-${activeCount + 1}
      </div>
      <p class="text-xs font-semibold text-emerald-700 mt-1 max-w-xs">
        Klik untuk menambahkan teman atau Bot AI baru (Maksimal 4 Pemain dalam 1 permainan)
      </p>
    `;
    list.appendChild(addCard);
  }
}

window.updateSetupName = function (idx, val) {
  gameState.setupConfigs[idx].name = val;
};

window.updateSetupPlayerType = function (idx, typeValue) {
  const cfg = gameState.setupConfigs[idx];
  if (typeValue === "human") {
    cfg.isBot = false;
    if (cfg.name.startsWith("Bot AI")) {
      cfg.name = `Pemain ${idx + 1}`;
    }
  } else {
    cfg.isBot = true;
    cfg.botDiff = typeValue === "bot-pintar" ? "pintar" : "santai";
    if (cfg.name.startsWith("Pemain") || cfg.name.startsWith("Bot AI")) {
      cfg.name =
        cfg.botDiff === "pintar"
          ? `Bot AI ${idx + 1} (Pintar)`
          : `Bot AI ${idx + 1} (Santai)`;
    }
  }
  renderSetupPlayers();
};

window.addLobbyPlayerSlot = function () {
  if (gameState.playerCount >= 4) {
    showToast(
      "⚠️ Kuota penuh! Maksimal 4 pemain dalam 1 permainan.",
      "warning",
    );
    return;
  }
  const newIdx = gameState.playerCount;
  const usedPawns = new Set(
    gameState.setupConfigs.slice(0, newIdx).map((c) => c.pawnId),
  );
  const freeTheme =
    PAWN_THEMES.find((p) => !usedPawns.has(p.id)) || PAWN_THEMES[newIdx];

  gameState.setupConfigs[newIdx].pawnId = freeTheme.id;
  gameState.setupConfigs[newIdx].isBot = false;
  gameState.setupConfigs[newIdx].name = `Pemain ${newIdx + 1}`;
  gameState.playerCount += 1;

  SoundEngine.step();
  renderSetupPlayers();
  showToast(
    `🎉 Pemain ke-${gameState.playerCount} berhasil ditambahkan!`,
    "success",
  );
};

window.removeLobbyPlayerSlot = function (removeIdx) {
  if (gameState.playerCount <= 2) {
    showToast("⚠️ Minimal harus ada 2 pemain untuk bermain!", "warning");
    return;
  }
  gameState.setupConfigs.splice(removeIdx, 1);
  const usedPawns = new Set(gameState.setupConfigs.map((c) => c.pawnId));
  const fallbackPawn =
    PAWN_THEMES.find((p) => !usedPawns.has(p.id)) || PAWN_THEMES[3];
  gameState.setupConfigs.push({
    name: "Pemain 4",
    pawnId: fallbackPawn.id,
    isBot: false,
    botDiff: "santai",
  });
  gameState.playerCount -= 1;
  renderSetupPlayers();
  showToast("Pemain dihapus dari daftar lobby.", "info");
};

window.applyLobbyPreset = function (presetKey) {
  if (presetKey === "1vBot") {
    gameState.playerCount = 2;
    gameState.setupConfigs[0] = {
      name: "Pemain 1",
      pawnId: "garuda",
      isBot: false,
      botDiff: "santai",
    };
    gameState.setupConfigs[1] = {
      name: "Bot AI (Santai)",
      pawnId: "monas",
      isBot: true,
      botDiff: "santai",
    };
    showToast("🤖 Mode Duel 1 Pemain vs Bot AI dipilih!", "info");
  } else if (presetKey === "2p") {
    gameState.playerCount = 2;
    gameState.setupConfigs[0] = {
      name: "Pemain 1",
      pawnId: "garuda",
      isBot: false,
      botDiff: "santai",
    };
    gameState.setupConfigs[1] = {
      name: "Pemain 2",
      pawnId: "monas",
      isBot: false,
      botDiff: "santai",
    };
    showToast("👥 Mode 2 Pemain dipilih!", "info");
  } else if (presetKey === "3p") {
    gameState.playerCount = 3;
    gameState.setupConfigs[0] = {
      name: "Pemain 1",
      pawnId: "garuda",
      isBot: false,
      botDiff: "santai",
    };
    gameState.setupConfigs[1] = {
      name: "Pemain 2",
      pawnId: "monas",
      isBot: false,
      botDiff: "santai",
    };
    gameState.setupConfigs[2] = {
      name: "Pemain 3",
      pawnId: "bintang",
      isBot: false,
      botDiff: "santai",
    };
    showToast("👨‍👩‍👦 Mode 3 Pemain dipilih!", "success");
  } else if (presetKey === "4p") {
    gameState.playerCount = 4;
    gameState.setupConfigs[0] = {
      name: "Pemain 1",
      pawnId: "garuda",
      isBot: false,
      botDiff: "santai",
    };
    gameState.setupConfigs[1] = {
      name: "Pemain 2",
      pawnId: "monas",
      isBot: false,
      botDiff: "santai",
    };
    gameState.setupConfigs[2] = {
      name: "Pemain 3",
      pawnId: "bintang",
      isBot: false,
      botDiff: "santai",
    };
    gameState.setupConfigs[3] = {
      name: "Pemain 4",
      pawnId: "padi",
      isBot: false,
      botDiff: "santai",
    };
    showToast("🎉 Kuota Penuh 4 Pemain diaktifkan!", "success");
  }
  SoundEngine.step();
  renderSetupPlayers();
};

window.selectSetupPawn = function (playerIdx, pawnId) {
  const activeCount = gameState.playerCount;
  const conflictIdx = gameState.setupConfigs
    .slice(0, activeCount)
    .findIndex((c, idx) => idx !== playerIdx && c.pawnId === pawnId);
  if (conflictIdx !== -1) {
    gameState.setupConfigs[conflictIdx].pawnId =
      gameState.setupConfigs[playerIdx].pawnId;
  }
  gameState.setupConfigs[playerIdx].pawnId = pawnId;
  renderSetupPlayers();
};

function buildBoardGrid() {
  const grid = document.getElementById("boardGrid");
  grid.innerHTML = "";

  const pastelPalette = [
    "#FFF3B0", // Kuning Lemon
    "#CAF0F8", // Biru Langit
    "#FFD6E0", // Merah Muda Permen
    "#D8F3DC", // Hijau Mint
    "#EDE7F6", // Ungu Lavender
    "#FFFFFF", // Putih Cerah
  ];

  const ladderMap = new Map(LADDERS.map((l) => [l.from, l.to]));
  const snakeMap = new Map(SNAKES.map((s) => [s.from, s.to]));
  const eventSet = new Set(EVENT_SQUARES);

  for (let visualRow = 0; visualRow < 10; visualRow++) {
    const rowFromBottom = 9 - visualRow;
    for (let col = 0; col < 10; col++) {
      const colInRow = rowFromBottom % 2 === 0 ? col : 9 - col;
      const num = rowFromBottom * 10 + colInRow + 1;

      const cell = document.createElement("div");
      const bgHex = pastelPalette[(visualRow * 3 + col) % pastelPalette.length];
      cell.style.backgroundColor = bgHex;

      let extraClass = "rounded-md sm:rounded-lg shadow-2xs";
      let badgeHtml = "";

      if (num === 1) {
        cell.style.background =
          "linear-gradient(135deg, #34D399 0%, #38BDF8 100%)";
        badgeHtml = `
          <span class="mt-auto inline-flex items-center gap-0.5 text-[7px] sm:text-[9px] font-arcade font-bold uppercase px-1 py-0.2 rounded bg-white text-emerald-700 shadow-2xs">
            🚩 START
          </span>
        `;
      } else if (num === 100) {
        cell.style.background =
          "linear-gradient(135deg, #FDE047 0%, #FB923C 100%)";
        badgeHtml = `
          <span class="mt-auto inline-flex items-center gap-0.5 text-[7px] sm:text-[9px] font-arcade font-bold uppercase px-1 py-0.2 rounded bg-white text-amber-700 shadow-2xs">
            👑 FINISH
          </span>
        `;
      } else if (ladderMap.has(num)) {
        badgeHtml = `
          <span class="mt-auto text-[8px] sm:text-[10px] font-arcade font-bold text-emerald-800 bg-emerald-200/90 px-1 rounded-md leading-tight">
            ▲${ladderMap.get(num)}
          </span>
        `;
      } else if (snakeMap.has(num)) {
        badgeHtml = `
          <span class="mt-auto text-[8px] sm:text-[10px] font-arcade font-bold text-rose-800 bg-rose-200/90 px-1 rounded-md leading-tight">
            ▼${snakeMap.get(num)}
          </span>
        `;
      } else if (eventSet.has(num)) {
        extraClass += " tile-event-pulse";
        badgeHtml = `
          <span class="mt-auto mx-auto flex items-center justify-center text-purple-600" title="Petak Peristiwa Sejarah">
            <svg class="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-500 drop-shadow-2xs" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.9 6.1 6.7.9-4.9 4.7 1.2 6.6L12 17.1l-5.9 3.2 1.2-6.6-4.9-4.7 6.7-.9L12 2z"/>
            </svg>
          </span>
        `;
      }

      cell.className = `${extraClass} p-0.5 sm:p-1 flex flex-col justify-between relative select-none overflow-hidden`;
      const isSpecialBg = num === 1 || num === 100;
      cell.innerHTML = `
        <span class="font-arcade text-[10px] sm:text-xs font-bold leading-none ${
          isSpecialBg
            ? "text-white drop-shadow-2xs"
            : snakeMap.has(num)
              ? "text-rose-700"
              : ladderMap.has(num)
                ? "text-emerald-800"
                : "text-slate-700"
        }">${num}</span>
        ${badgeHtml}
      `;
      grid.appendChild(cell);
    }
  }
}

function drawBoardSvgOverlay() {
  const laddersLayer = document.getElementById("laddersLayer");
  const snakesLayer = document.getElementById("snakesLayer");
  laddersLayer.innerHTML = "";
  snakesLayer.innerHTML = "";

  const svgNS = "http://www.w3.org/2000/svg";

  // 1. Gambar 8 Tangga 3D Berwarna Cerah (Oranye-Emas & Hijau Zamrud)
  const ladderStyles = [
    { railOuter: "#B45309", railInner: "#FBBF24", rung: "#FEF08A" },
    { railOuter: "#065F46", railInner: "#10B981", rung: "#A7F3D0" },
  ];

  LADDERS.forEach((ladder, idx) => {
    const start = getSquareCenterPercent(ladder.from);
    const end = getSquareCenterPercent(ladder.to);
    const x1 = start.x * 10;
    const y1 = start.y * 10;
    const x2 = end.x * 10;
    const y2 = end.y * 10;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    const nx = (-dy / len) * 16;
    const ny = (dx / len) * 16;
    const style = ladderStyles[idx % ladderStyles.length];

    const g = document.createElementNS(svgNS, "g");

    // Tiang tangga kiri & kanan
    [-1, 1].forEach((dir) => {
      const outer = document.createElementNS(svgNS, "line");
      outer.setAttribute("x1", x1 + nx * dir);
      outer.setAttribute("y1", y1 + ny * dir);
      outer.setAttribute("x2", x2 + nx * dir);
      outer.setAttribute("y2", y2 + ny * dir);
      outer.setAttribute("stroke", style.railOuter);
      outer.setAttribute("stroke-width", "10");
      outer.setAttribute("stroke-linecap", "round");
      g.appendChild(outer);

      const inner = document.createElementNS(svgNS, "line");
      inner.setAttribute("x1", x1 + nx * dir);
      inner.setAttribute("y1", y1 + ny * dir);
      inner.setAttribute("x2", x2 + nx * dir);
      inner.setAttribute("y2", y2 + ny * dir);
      inner.setAttribute("stroke", style.railInner);
      inner.setAttribute("stroke-width", "5");
      inner.setAttribute("stroke-linecap", "round");
      g.appendChild(inner);
    });

    // Anak tangga berkilau
    const steps = Math.max(4, Math.floor(len / 34));
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const rx = x1 + dx * t;
      const ry = y1 + dy * t;

      const rungShadow = document.createElementNS(svgNS, "line");
      rungShadow.setAttribute("x1", rx - nx);
      rungShadow.setAttribute("y1", ry - ny);
      rungShadow.setAttribute("x2", rx + nx);
      rungShadow.setAttribute("y2", ry + ny);
      rungShadow.setAttribute("stroke", style.railOuter);
      rungShadow.setAttribute("stroke-width", "8");
      rungShadow.setAttribute("stroke-linecap", "round");
      g.appendChild(rungShadow);

      const rung = document.createElementNS(svgNS, "line");
      rung.setAttribute("x1", rx - nx);
      rung.setAttribute("y1", ry - ny);
      rung.setAttribute("x2", rx + nx);
      rung.setAttribute("y2", ry + ny);
      rung.setAttribute("stroke", style.rung);
      rung.setAttribute("stroke-width", "4.5");
      rung.setAttribute("stroke-linecap", "round");
      g.appendChild(rung);
    }

    // Indikator lingkaran panah naik di pangkal tangga
    const baseBadge = document.createElementNS(svgNS, "circle");
    baseBadge.setAttribute("cx", x1);
    baseBadge.setAttribute("cy", y1);
    baseBadge.setAttribute("r", "13");
    baseBadge.setAttribute("fill", "#10B981");
    baseBadge.setAttribute("stroke", "#FFFFFF");
    baseBadge.setAttribute("stroke-width", "3");
    g.appendChild(baseBadge);

    const arrowPath = document.createElementNS(svgNS, "path");
    arrowPath.setAttribute(
      "d",
      `M ${x1 - 5} ${y1 + 2} L ${x1} ${y1 - 4} L ${x1 + 5} ${y1 + 2}`,
    );
    arrowPath.setAttribute("fill", "none");
    arrowPath.setAttribute("stroke", "#FFFFFF");
    arrowPath.setAttribute("stroke-width", "3");
    arrowPath.setAttribute("stroke-linecap", "round");
    arrowPath.setAttribute("stroke-linejoin", "round");
    g.appendChild(arrowPath);

    laddersLayer.appendChild(g);
  });

  // 2. Gambar 8 Ular Kartun Gemuk & Warna-Warni
  const snakeThemes = [
    { outline: "#6B21A8", main: "#C026D3", spots: "#FDE047" },
    { outline: "#9F1239", main: "#FF5E7E", spots: "#FEF08A" },
    { outline: "#0F766E", main: "#14B8A6", spots: "#BAE6FD" },
    { outline: "#3F6212", main: "#84CC16", spots: "#FEF9C3" },
  ];

  SNAKES.forEach((snake, idx) => {
    const head = getSquareCenterPercent(snake.from);
    const tail = getSquareCenterPercent(snake.to);
    const x1 = head.x * 10;
    const y1 = head.y * 10;
    const x2 = tail.x * 10;
    const y2 = tail.y * 10;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    const nx = -dy / len;
    const ny = dx / len;

    const theme = snakeThemes[idx % snakeThemes.length];
    const waves = len > 320 ? 3 : 2;
    const amp = Math.min(38, len * 0.13);

    const segments = 32;
    let pathD = `M ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    let headAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const taper = Math.sin(t * Math.PI);
      const waveOffset = Math.sin(t * Math.PI * waves) * amp * taper;
      const px = x1 + dx * t + nx * waveOffset;
      const py = y1 + dy * t + ny * waveOffset;
      pathD += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;

      if (i === 2) {
        headAngleDeg = (Math.atan2(py - y1, px - x1) * 180) / Math.PI;
      }
    }

    const g = document.createElementNS(svgNS, "g");

    // Outline tubuh ular gemuk
    const outlinePath = document.createElementNS(svgNS, "path");
    outlinePath.setAttribute("d", pathD);
    outlinePath.setAttribute("fill", "none");
    outlinePath.setAttribute("stroke", theme.outline);
    outlinePath.setAttribute("stroke-width", "22");
    outlinePath.setAttribute("stroke-linecap", "round");
    outlinePath.setAttribute("stroke-linejoin", "round");
    g.appendChild(outlinePath);

    // Badan utama ular
    const mainPath = document.createElementNS(svgNS, "path");
    mainPath.setAttribute("d", pathD);
    mainPath.setAttribute("fill", "none");
    mainPath.setAttribute("stroke", theme.main);
    mainPath.setAttribute("stroke-width", "15");
    mainPath.setAttribute("stroke-linecap", "round");
    mainPath.setAttribute("stroke-linejoin", "round");
    g.appendChild(mainPath);

    // Bintik / belang sisik warna-warni
    const spotPath = document.createElementNS(svgNS, "path");
    spotPath.setAttribute("d", pathD);
    spotPath.setAttribute("fill", "none");
    spotPath.setAttribute("stroke", theme.spots);
    spotPath.setAttribute("stroke-width", "6");
    spotPath.setAttribute("stroke-dasharray", "4 16");
    spotPath.setAttribute("stroke-linecap", "round");
    g.appendChild(spotPath);

    // Kepala Ular Kartun Ekspresif di (x1, y1)
    const headGroup = document.createElementNS(svgNS, "g");
    headGroup.setAttribute(
      "transform",
      `translate(${x1}, ${y1}) rotate(${headAngleDeg})`,
    );

    // Lidah bercabang merah cerah
    const tongue = document.createElementNS(svgNS, "path");
    tongue.setAttribute("d", "M -15 0 L -27 -5 M -21 0 L -27 5");
    tongue.setAttribute("stroke", "#EF4444");
    tongue.setAttribute("stroke-width", "3.2");
    tongue.setAttribute("stroke-linecap", "round");
    headGroup.appendChild(tongue);

    // Kepala bulat menggemaskan
    const headOval = document.createElementNS(svgNS, "ellipse");
    headOval.setAttribute("cx", "0");
    headOval.setAttribute("cy", "0");
    headOval.setAttribute("rx", "17");
    headOval.setAttribute("ry", "14");
    headOval.setAttribute("fill", theme.main);
    headOval.setAttribute("stroke", theme.outline);
    headOval.setAttribute("stroke-width", "4");
    headGroup.appendChild(headOval);

    // Sepasang mata besar kartun
    [-6, 6].forEach((ey) => {
      const eyeWhite = document.createElementNS(svgNS, "circle");
      eyeWhite.setAttribute("cx", "-5");
      eyeWhite.setAttribute("cy", ey);
      eyeWhite.setAttribute("r", "4.3");
      eyeWhite.setAttribute("fill", "#FFFFFF");
      headGroup.appendChild(eyeWhite);

      const pupil = document.createElementNS(svgNS, "circle");
      pupil.setAttribute("cx", "-6.2");
      pupil.setAttribute("cy", ey);
      pupil.setAttribute("r", "2.1");
      pupil.setAttribute("fill", "#0F172A");
      headGroup.appendChild(pupil);
    });

    g.appendChild(headGroup);
    snakesLayer.appendChild(g);
  });
}

function build3DCubeFacesHTML() {
  const faceLayouts = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9],
  };

  let html = "";
  for (let face = 1; face <= 6; face++) {
    const activeCells = new Set(faceLayouts[face]);
    let cellsHtml = "";
    for (let cell = 1; cell <= 9; cell++) {
      if (activeCells.has(cell)) {
        const colorClass =
          face === 1 ? "pip-red" : face === 6 ? "pip-blue" : "";
        cellsHtml += `<span class="pip ${colorClass}"></span>`;
      } else {
        cellsHtml += `<span></span>`;
      }
    }
    html += `<div class="dice-face face-${face}">${cellsHtml}</div>`;
  }
  return html;
}

function init3DDiceCubes() {
  const facesHtml = build3DCubeFacesHTML();
  document.getElementById("desktopDiceCube").innerHTML = facesHtml;
  document.getElementById("mobileDiceCube").innerHTML = facesHtml;
  set3DDiceFace(1, false);
}

function set3DDiceFace(value, spinExtra = true) {
  gameState.diceValue = value;
  const targetAngles = {
    1: { x: 0, y: 0 },
    2: { x: 0, y: 180 },
    3: { x: 0, y: -90 },
    4: { x: 0, y: 90 },
    5: { x: -90, y: 0 },
    6: { x: 90, y: 0 },
  };

  const target = targetAngles[value] || targetAngles[1];
  const extraX = spinExtra ? 360 : 0;
  const extraY = spinExtra ? 360 : 0;
  const transformStr = `rotateX(${target.x + extraX}deg) rotateY(${target.y + extraY}deg)`;

  ["desktopDiceCube", "mobileDiceCube"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("is-tumbling");
    el.style.transform = transformStr;
  });
}

function start3DDiceTumble() {
  ["desktopDiceCube", "mobileDiceCube"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("is-tumbling");
  });
}

function renderPawns(hoppingPlayerId = null) {
  const layer = document.getElementById("pawnsLayer");
  layer.innerHTML = "";

  const squareGroups = {};
  gameState.players.forEach((p, idx) => {
    if (!squareGroups[p.position]) squareGroups[p.position] = [];
    squareGroups[p.position].push(idx);
  });

  const offsets = [
    { dx: -1.9, dy: -1.9 },
    { dx: 1.9, dy: -1.9 },
    { dx: -1.9, dy: 1.9 },
    { dx: 1.9, dy: 1.9 },
  ];

  gameState.players.forEach((player, idx) => {
    const center = getSquareCenterPercent(player.position);
    const siblings = squareGroups[player.position];
    const rank = siblings.indexOf(idx);
    const hasMultiple = siblings.length > 1;
    const offset = hasMultiple
      ? offsets[rank % offsets.length]
      : { dx: 0, dy: 0 };

    const isCurrentTurn =
      idx === gameState.currentPlayerIndex && !gameState.gameOver;
    const isHopping = player.id === hoppingPlayerId;

    const pawnEl = document.createElement("div");
    pawnEl.id = `pawn-${player.id}`;
    pawnEl.className = `player-pawn absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center border-[2.5px] border-white ${
      hasMultiple ? "w-6 h-6 sm:w-8 sm:h-8 scale-90" : "w-8 h-8 sm:w-10 sm:h-10"
    } ${isHopping ? "pawn-hopping" : ""}`;
    pawnEl.style.left = `${center.x + offset.dx}%`;
    pawnEl.style.top = `${center.y + offset.dy}%`;
    pawnEl.style.backgroundColor = player.theme.bg;
    pawnEl.style.color = player.theme.text;
    pawnEl.style.zIndex = isCurrentTurn ? "25" : "20";

    pawnEl.innerHTML = `
      ${
        isCurrentTurn
          ? `<span class="pawn-turn-ring absolute -inset-1.5 rounded-full border-4 border-amber-300 pointer-events-none"></span>`
          : ""
      }
      ${player.theme.svg}
    `;
    layer.appendChild(pawnEl);
  });
}

function updateTurnAndScoreboardUI() {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  if (!currentPlayer) return;

  // Desktop Turn Header
  const dIcon = document.getElementById("desktopTurnPawnIcon");
  dIcon.style.backgroundColor = currentPlayer.theme.bg;
  dIcon.style.color = currentPlayer.theme.text;
  dIcon.innerHTML = currentPlayer.theme.svg;
  document.getElementById("desktopTurnPlayerName").textContent =
    currentPlayer.name;
  document.getElementById("turnCounterBadge").textContent =
    `Putaran #${gameState.turnNumber}`;

  // Mobile Turn Header
  const mIcon = document.getElementById("mobileTurnPawnIcon");
  mIcon.style.backgroundColor = currentPlayer.theme.bg;
  mIcon.style.color = currentPlayer.theme.text;
  mIcon.innerHTML = currentPlayer.theme.svg;
  document.getElementById("mobileTurnPlayerName").textContent =
    currentPlayer.name;

  const statusMsg = currentPlayer.isBot
    ? "Bot AI sedang bersiap melempar dadu..."
    : gameState.isBusy
      ? "Sedang melangkah / menjawab kuis..."
      : "Ayo kocok dadu 3D sekarang!";

  document.getElementById("desktopTurnStatus").textContent = statusMsg;
  document.getElementById("mobileTurnHint").textContent = statusMsg;

  const disableRoll =
    gameState.isBusy || currentPlayer.isBot || gameState.gameOver;
  document.getElementById("btnRollDesktop").disabled = disableRoll;
  document.getElementById("btnRollMobile").disabled = disableRoll;

  document.getElementById("remainingQuestionsBadge").textContent =
    `${gameState.unusedQuestionIds.length} Soal Sisa`;

  const countBadge = document.getElementById("inGamePlayerCountBadge");
  if (countBadge) countBadge.textContent = `${gameState.players.length}/4`;

  const midGameSection = document.getElementById("midGameAddPlayerSection");
  if (midGameSection) {
    midGameSection.classList.toggle(
      "hidden",
      gameState.players.length >= 4 || gameState.gameOver,
    );
  }

  // Render Kartu Status Pemain
  const scoreboard = document.getElementById("scoreboardList");
  scoreboard.innerHTML = "";

  gameState.players.forEach((p, idx) => {
    const isCurrent =
      idx === gameState.currentPlayerIndex && !gameState.gameOver;
    const progressPct = Math.min(100, Math.max(2, p.position));

    const card = document.createElement("div");
    card.className = `rounded-2xl p-3 border-2 transition ${
      isCurrent
        ? "bg-amber-50/90 border-amber-400 shadow-md scale-[1.01]"
        : "bg-slate-50/90 border-slate-200/80"
    }`;

    card.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2.5 min-w-0">
          <div
            class="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-xs"
            style="background-color: ${p.theme.bg}; color: ${p.theme.text};"
          >
            ${p.theme.svg}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="font-arcade font-bold text-sm text-slate-800 truncate">${p.name}</span>
              ${
                isCurrent
                  ? `<span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 shrink-0">GILIRANMU!</span>`
                  : ""
              }
            </div>
            <div class="text-[11px] font-bold text-slate-500 flex items-center gap-2 mt-0.5">
              <span>Petak <strong class="text-slate-700">${p.position}</strong>/100</span>
              <span>•</span>
              <span>✅ ${p.correctCount}/${p.answeredCount}</span>
            </div>
          </div>
        </div>

        <div class="text-right shrink-0">
          <div class="font-arcade font-bold text-base sm:text-lg text-indigo-600 leading-none">${p.score}</div>
          <div class="text-[10px] font-extrabold uppercase text-slate-400 mt-0.5">Poin</div>
        </div>
      </div>

      <!-- Bilah Progres Mini menuju Petak 100 -->
      <div class="mt-2 w-full h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-300"
          style="width: ${progressPct}%; background-color: ${p.theme.bg};"
        ></div>
      </div>
    `;
    scoreboard.appendChild(card);
  });
}

function addActivityLog(htmlText, style = "neutral") {
  const log = document.getElementById("activityLog");
  const item = document.createElement("div");
  const classes = {
    ladder: "bg-emerald-50 border-emerald-200 text-emerald-900",
    snake: "bg-rose-50 border-rose-200 text-rose-900",
    event: "bg-purple-50 border-purple-200 text-purple-900",
    neutral: "bg-slate-50 border-slate-200 text-slate-700",
  };
  item.className = `${classes[style] || classes.neutral} border rounded-2xl px-3 py-2 leading-snug`;
  item.innerHTML = htmlText;
  log.prepend(item);
}

function refillAndShuffleQuestions() {
  const ids = BANK_SOAL.map((q) => q.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  gameState.unusedQuestionIds = ids;
}

function drawNextQuestion() {
  if (gameState.unusedQuestionIds.length === 0) {
    refillAndShuffleQuestions();
  }
  const nextId = gameState.unusedQuestionIds.pop();
  return BANK_SOAL.find((q) => q.id === nextId) || BANK_SOAL[0];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleRollDice() {
  if (gameState.isBusy || gameState.gameOver) return;
  const player = gameState.players[gameState.currentPlayerIndex];
  if (!player) return;

  gameState.isBusy = true;
  updateTurnAndScoreboardUI();
  SoundEngine.roll();

  // Mulai putaran akrobatik dadu kubus 3D
  start3DDiceTumble();
  await sleep(620);

  const rolled = Math.floor(Math.random() * 6) + 1;
  set3DDiceFace(rolled, true);
  await sleep(320);

  addActivityLog(
    `🎲 <strong>${player.name}</strong> melempar dadu dan mendapat angka <strong>${rolled}</strong>!`,
  );

  // Gerakkan pion langkah demi langkah dengan efek melompat (hop)
  let dir = 1;
  for (let step = 0; step < rolled; step++) {
    if (player.position === 100 && dir === 1) {
      dir = -1; // Memantul mundur jika kelebihan langkah
    }
    player.position += dir;
    SoundEngine.step();
    renderPawns(player.id);
    updateTurnAndScoreboardUI();
    await sleep(240);
  }

  // Cek apakah mendarat tepat di Petak 100
  if (player.position === 100) {
    declareWinner(player);
    return;
  }

  // Cek Tangga, Kepala Ular, atau Petak Peristiwa Sejarah
  const ladder = LADDERS.find((l) => l.from === player.position);
  const snake = SNAKES.find((s) => s.from === player.position);
  const isEvent = EVENT_SQUARES.includes(player.position);

  if (ladder) {
    showToast(`🪜 Tangga Kesempatan di Petak ${ladder.from}!`, "success");
    addActivityLog(
      `🪜 <strong>${player.name}</strong> tiba di pangkal tangga <strong>Petak ${ladder.from}</strong> (menuju Petak ${ladder.to})!`,
      "ladder",
    );
    openQuizModal({
      type: "ladder",
      player,
      fromSquare: ladder.from,
      targetSquare: ladder.to,
      timeLimit: 30,
    });
  } else if (snake) {
    showToast(`🐍 Awas! Kepala Ular di Petak ${snake.from}!`, "danger");
    addActivityLog(
      `🐍 <strong>${player.name}</strong> bertemu kepala ular di <strong>Petak ${snake.from}</strong> (ekor di Petak ${snake.to})!`,
      "snake",
    );
    openQuizModal({
      type: "snake",
      player,
      fromSquare: snake.from,
      targetSquare: snake.to,
      timeLimit: 30,
    });
  } else if (isEvent) {
    showToast(
      `⭐ Kartu Peristiwa Sejarah di Petak ${player.position}!`,
      "info",
    );
    addActivityLog(
      `⭐ <strong>${player.name}</strong> membuka <strong>Kartu Peristiwa Sejarah</strong> di Petak ${player.position}!`,
      "event",
    );
    openQuizModal({
      type: "event",
      player,
      fromSquare: player.position,
      targetSquare: Math.min(100, player.position + 2),
      timeLimit: 20,
    });
  } else {
    advanceToNextTurn();
  }
}

function advanceToNextTurn() {
  if (gameState.gameOver) return;

  gameState.currentPlayerIndex =
    (gameState.currentPlayerIndex + 1) % gameState.players.length;
  if (gameState.currentPlayerIndex === 0) {
    gameState.turnNumber += 1;
  }

  gameState.isBusy = false;
  renderPawns();
  updateTurnAndScoreboardUI();

  const nextPlayer = gameState.players[gameState.currentPlayerIndex];
  if (nextPlayer && nextPlayer.isBot && !gameState.gameOver) {
    clearTimeout(gameState.botActionTimeout);
    gameState.botActionTimeout = setTimeout(() => {
      handleRollDice();
    }, 1050);
  }
}

function openQuizModal({ type, player, fromSquare, targetSquare, timeLimit }) {
  clearInterval(gameState.quizTimerInterval);

  const question = drawNextQuestion();
  gameState.activeQuiz = {
    type,
    player,
    fromSquare,
    targetSquare,
    timeLimit,
    remaining: timeLimit,
    question,
    answered: false,
  };

  const modal = document.getElementById("quizModal");
  const header = document.getElementById("quizModalHeader");
  const triggerBadge = document.getElementById("quizTriggerBadge");
  const playerBadge = document.getElementById("quizPlayerBadge");
  const themeTitle = document.getElementById("quizThemeTitle");
  const qText = document.getElementById("quizQuestionText");
  const optionsList = document.getElementById("quizOptionsList");
  const feedbackBox = document.getElementById("quizFeedbackBox");
  const botBanner = document.getElementById("botThinkingBanner");
  const shortcutHint = document.getElementById("quizShortcutHint");

  feedbackBox.classList.add("hidden");
  botBanner.classList.toggle("hidden", !player.isBot);
  shortcutHint.classList.toggle("hidden", player.isBot);

  if (type === "ladder") {
    header.className =
      "bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-4 flex items-center justify-between gap-3";
    triggerBadge.textContent = `🪜 Tangga Kesempatan (${fromSquare} → ${targetSquare})`;
  } else if (type === "snake") {
    header.className =
      "bg-gradient-to-r from-rose-500 to-red-600 text-white px-5 py-4 flex items-center justify-between gap-3";
    triggerBadge.textContent = `🐍 Tantangan Ular (Petak ${fromSquare})`;
  } else {
    header.className =
      "bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-4 flex items-center justify-between gap-3";
    triggerBadge.textContent = `⭐ Kartu Peristiwa Sejarah (Petak ${fromSquare})`;
  }

  playerBadge.textContent = `Penjawab: ${player.name}`;
  themeTitle.textContent = `Tema: ${question.tema}`;
  qText.textContent = question.pertanyaan;

  const kahootStyles = [
    {
      letter: "A",
      btnClass: "btn-3d-coral text-white",
      badgeClass: "bg-white text-rose-600",
    },
    {
      letter: "B",
      btnClass: "btn-3d-blue text-white",
      badgeClass: "bg-white text-blue-600",
    },
    {
      letter: "C",
      btnClass: "btn-3d-amber text-slate-900",
      badgeClass: "bg-slate-900 text-amber-300",
    },
    {
      letter: "D",
      btnClass: "btn-3d-emerald text-white",
      badgeClass: "bg-white text-emerald-700",
    },
  ];

  optionsList.innerHTML = "";
  question.pilihan.forEach((optText, idx) => {
    const st = kahootStyles[idx];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.optIndex = idx;
    btn.disabled = player.isBot;
    btn.className = `quiz-opt-btn btn-chunky ${st.btnClass} w-full text-left p-3.5 sm:p-4 rounded-2xl flex items-start gap-3`;
    btn.innerHTML = `
      <span class="w-8 h-8 rounded-xl ${st.badgeClass} font-arcade font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
        ${st.letter}
      </span>
      <span class="text-xs sm:text-sm font-bold leading-snug pt-1">
        ${optText}
      </span>
    `;
    if (!player.isBot) {
      btn.addEventListener("click", () => submitQuizAnswer(idx));
    }
    optionsList.appendChild(btn);
  });

  updateQuizTimerUI(timeLimit, timeLimit);
  modal.classList.remove("hidden");

  gameState.quizTimerInterval = setInterval(() => {
    if (!gameState.activeQuiz || gameState.activeQuiz.answered) {
      clearInterval(gameState.quizTimerInterval);
      return;
    }
    gameState.activeQuiz.remaining -= 1;
    updateQuizTimerUI(
      gameState.activeQuiz.remaining,
      gameState.activeQuiz.timeLimit,
    );

    if (gameState.activeQuiz.remaining <= 0) {
      clearInterval(gameState.quizTimerInterval);
      submitQuizAnswer(-1);
    }
  }, 1000);

  // Jawaban otomatis Bot AI sesuai tingkat kesulitan masing-masing Bot
  if (player.isBot) {
    clearTimeout(gameState.botActionTimeout);
    gameState.botActionTimeout = setTimeout(() => {
      if (!gameState.activeQuiz || gameState.activeQuiz.answered) return;
      const accuracyRate = player.botDiff === "pintar" ? 0.8 : 0.55;
      const isBotRight = Math.random() < accuracyRate;
      let chosenIdx = question.jawabanBenar;
      if (!isBotRight) {
        const wrongs = [0, 1, 2, 3].filter((i) => i !== question.jawabanBenar);
        chosenIdx = wrongs[Math.floor(Math.random() * wrongs.length)];
      }
      submitQuizAnswer(chosenIdx);
    }, 2000);
  }
}

function updateQuizTimerUI(remaining, total) {
  const safeRem = Math.max(0, remaining);
  const timerText = document.getElementById("quizTimerText");
  const timerBar = document.getElementById("quizTimerBar");
  const pct = (safeRem / total) * 100;

  timerText.textContent = `${safeRem}s`;
  timerBar.style.width = `${pct}%`;

  if (pct > 50) {
    timerBar.className =
      "h-full bg-emerald-500 transition-all duration-1000 ease-linear";
    timerText.className =
      "font-arcade font-bold text-xl sm:text-2xl text-emerald-600 leading-none mt-0.5";
  } else if (pct > 25) {
    timerBar.className =
      "h-full bg-amber-400 transition-all duration-1000 ease-linear";
    timerText.className =
      "font-arcade font-bold text-xl sm:text-2xl text-amber-500 leading-none mt-0.5";
  } else {
    timerBar.className =
      "h-full bg-rose-500 transition-all duration-1000 ease-linear";
    timerText.className =
      "font-arcade font-bold text-xl sm:text-2xl text-rose-600 leading-none mt-0.5 animate-pulse";
  }
}

function submitQuizAnswer(selectedIndex) {
  const quiz = gameState.activeQuiz;
  if (!quiz || quiz.answered) return;

  quiz.answered = true;
  clearInterval(gameState.quizTimerInterval);
  document.getElementById("botThinkingBanner").classList.add("hidden");
  document.getElementById("quizShortcutHint").classList.add("hidden");

  const { type, player, fromSquare, targetSquare, question } = quiz;
  const isCorrect = selectedIndex === question.jawabanBenar;
  const isTimeout = selectedIndex === -1;

  player.answeredCount += 1;
  if (isCorrect) {
    player.correctCount += 1;
    SoundEngine.correct();
  } else {
    SoundEngine.wrong();
  }

  // Sorot jawaban benar dan pudarkan opsi lainnya
  const optionBtns = document.querySelectorAll(".quiz-opt-btn");
  optionBtns.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === question.jawabanBenar) {
      btn.classList.add("ring-4", "ring-emerald-400", "scale-[1.02]");
    } else if (idx === selectedIndex && !isCorrect) {
      btn.classList.add("ring-4", "ring-rose-900", "opacity-75");
    } else {
      btn.classList.add("opacity-35");
    }
  });

  // Hitung efek pergerakan & poin
  let outcomeTitle = "";
  let outcomeReward = "";
  let newPos = player.position;
  let pointsEarned = 0;

  if (type === "ladder") {
    if (isCorrect) {
      pointsEarned = 150;
      newPos = targetSquare;
      outcomeTitle = "🎉 Hebat! Berhasil Naik Tangga!";
      outcomeReward = `+${pointsEarned} Poin & Melesat ke Petak ${targetSquare}`;
    } else {
      outcomeTitle = isTimeout
        ? "⏰ Waktu Habis! Gagal Naik Tangga"
        : "😅 Kurang Tepat! Belum Bisa Naik";
      outcomeReward = `Tetap bertahan di Petak ${fromSquare}`;
    }
  } else if (type === "snake") {
    if (isCorrect) {
      pointsEarned = 100;
      newPos = fromSquare;
      outcomeTitle = "🛡️ Luar Biasa! Selamat dari Ular!";
      outcomeReward = `+${pointsEarned} Poin & Bertahan di Petak ${fromSquare}`;
    } else {
      newPos = targetSquare;
      outcomeTitle = isTimeout
        ? "⏰ Waktu Habis! Terpeleset Ular!"
        : "🐍 Ups! Terpeleset Turun Ular!";
      outcomeReward = `Meluncur ke Petak ${targetSquare}`;
    }
  } else if (type === "event") {
    if (isCorrect) {
      pointsEarned = 120;
      newPos = Math.min(100, fromSquare + 2);
      outcomeTitle = "⭐ Mantap! Bonus Peristiwa Sejarah!";
      outcomeReward = `+${pointsEarned} Poin & Maju +2 Langkah (Petak ${newPos})`;
    } else {
      outcomeTitle = isTimeout ? "⏰ Waktu Habis!" : "😅 Jawaban Belum Tepat!";
      outcomeReward = `Tetap di Petak ${fromSquare}`;
    }
  }

  player.score += pointsEarned;
  quiz.resolvedNewPosition = newPos;
  quiz.wasCorrect = isCorrect;

  // Tampilkan kotak Fakta Sejarah
  const feedbackBox = document.getElementById("quizFeedbackBox");
  const titleEl = document.getElementById("quizOutcomeTitle");
  const rewardEl = document.getElementById("quizOutcomeReward");
  const factEl = document.getElementById("quizFactText");
  const btnContinue = document.getElementById("btnContinueAfterQuiz");

  feedbackBox.classList.remove("hidden");
  if (isCorrect) {
    feedbackBox.className =
      "rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-4 sm:p-5 space-y-3";
    titleEl.className =
      "font-arcade font-bold text-base sm:text-lg text-emerald-800";
    rewardEl.className =
      "text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500 text-white";
  } else {
    feedbackBox.className =
      "rounded-3xl border-2 border-rose-300 bg-rose-50 p-4 sm:p-5 space-y-3";
    titleEl.className =
      "font-arcade font-bold text-base sm:text-lg text-rose-800";
    rewardEl.className =
      "text-xs font-extrabold px-3 py-1 rounded-full bg-rose-500 text-white";
  }

  titleEl.textContent = outcomeTitle;
  rewardEl.textContent = outcomeReward;
  factEl.textContent = question.fakta;
  btnContinue.textContent = player.isBot
    ? "Lanjutkan Sekarang →"
    : "Lanjutkan Permainan →";

  updateTurnAndScoreboardUI();

  if (player.isBot) {
    clearTimeout(gameState.botActionTimeout);
    gameState.botActionTimeout = setTimeout(() => {
      continueAfterQuiz();
    }, 3000);
  }
}

async function continueAfterQuiz() {
  const quiz = gameState.activeQuiz;
  if (!quiz) return;

  clearTimeout(gameState.botActionTimeout);
  clearInterval(gameState.quizTimerInterval);
  document.getElementById("quizModal").classList.add("hidden");
  gameState.activeQuiz = null;

  const { type, player, fromSquare, resolvedNewPosition, wasCorrect } = quiz;

  if (resolvedNewPosition !== player.position) {
    if (type === "ladder" && wasCorrect) {
      SoundEngine.ladder();
      showToast(
        `🚀 +150 Poin! Naik ke Petak ${resolvedNewPosition}`,
        "success",
      );
      addActivityLog(
        `🪜 <strong>${player.name}</strong> naik tangga dari <strong>Petak ${fromSquare}</strong> ke <strong>Petak ${resolvedNewPosition}</strong> (+150 poin)!`,
        "ladder",
      );
    } else if (type === "snake" && !wasCorrect) {
      SoundEngine.snake();
      showToast(`🐍 Yah! Turun ke Petak ${resolvedNewPosition}`, "danger");
      addActivityLog(
        `🐍 <strong>${player.name}</strong> meluncur turun dari <strong>Petak ${fromSquare}</strong> ke <strong>Petak ${resolvedNewPosition}</strong>.`,
        "snake",
      );
    } else if (type === "event" && wasCorrect) {
      SoundEngine.event();
      showToast(`⭐ +120 Poin! Maju ke Petak ${resolvedNewPosition}`, "info");
      addActivityLog(
        `⭐ <strong>${player.name}</strong> mendapat bonus +2 langkah ke <strong>Petak ${resolvedNewPosition}</strong> (+120 poin)!`,
        "event",
      );
    }

    player.position = resolvedNewPosition;
    renderPawns(player.id);
    updateTurnAndScoreboardUI();
    await sleep(480);
  } else {
    if (type === "snake" && wasCorrect) {
      showToast(`🛡️ Selamat! +100 Poin di Petak ${fromSquare}`, "success");
      addActivityLog(
        `🛡️ <strong>${player.name}</strong> selamat dari gigitan ular di <strong>Petak ${fromSquare}</strong> (+100 poin)!`,
        "snake",
      );
    } else if (type === "ladder" && !wasCorrect) {
      addActivityLog(
        `🪜 <strong>${player.name}</strong> belum berhasil naik tangga dan tetap di <strong>Petak ${fromSquare}</strong>.`,
      );
    }
  }

  if (player.position === 100) {
    declareWinner(player);
    return;
  }

  advanceToNextTurn();
}

function launchConfettiShower() {
  const colors = [
    "#FF5E7E",
    "#2979FF",
    "#FFB300",
    "#00C853",
    "#A18CD1",
    "#00F2FE",
    "#FB7185",
  ];
  for (let i = 0; i < 85; i++) {
    const piece = document.createElement("div");
    const size = Math.floor(Math.random() * 9) + 7;
    const isCircle = Math.random() > 0.5;
    piece.className = `confetti-piece ${isCircle ? "rounded-full" : "rounded-xs"}`;
    piece.style.width = `${size}px`;
    piece.style.height = `${isCircle ? size : size * 0.6}px`;
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.animationDuration = `${(Math.random() * 2.2 + 2.2).toFixed(2)}s`;
    piece.style.animationDelay = `${(Math.random() * 0.9).toFixed(2)}s`;
    document.body.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 5200);
  }
}

function declareWinner(winnerPlayer) {
  gameState.gameOver = true;
  gameState.isBusy = false;
  clearTimeout(gameState.botActionTimeout);
  clearInterval(gameState.quizTimerInterval);

  winnerPlayer.score += 300;
  SoundEngine.win();
  renderPawns(winnerPlayer.id);
  updateTurnAndScoreboardUI();
  launchConfettiShower();

  addActivityLog(
    `👑 <strong>${winnerPlayer.name}</strong> mencapai <strong>Petak 100</strong> dan menjadi Juara (+300 poin bonus)!`,
    "event",
  );

  document.getElementById("winnerAnnouncement").textContent =
    `Selamat, ${winnerPlayer.name}!`;

  const ranked = [...gameState.players].sort((a, b) => {
    if (b.position !== a.position) return b.position - a.position;
    return b.score - a.score;
  });

  const medals = ["🥇", "🥈", "🥉", "🎖️"];
  const leaderboardEl = document.getElementById("victoryLeaderboard");
  leaderboardEl.innerHTML = "";

  ranked.forEach((p, idx) => {
    const accuracy =
      p.answeredCount > 0
        ? Math.round((p.correctCount / p.answeredCount) * 100)
        : 0;
    const row = document.createElement("div");
    row.className = `flex items-center justify-between gap-3 p-3.5 rounded-2xl border-2 ${
      idx === 0
        ? "bg-amber-50 border-amber-400 shadow-sm"
        : "bg-slate-50 border-slate-200"
    }`;

    row.innerHTML = `
      <div class="flex items-center gap-3 min-w-0">
        <span class="text-xl shrink-0">${medals[idx] || `#${idx + 1}`}</span>
        <div
          class="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-xs"
          style="background-color: ${p.theme.bg}; color: ${p.theme.text};"
        >
          ${p.theme.svg}
        </div>
        <div class="min-w-0">
          <div class="font-arcade font-bold text-sm sm:text-base text-slate-800 truncate">${p.name}</div>
          <div class="text-[11px] font-bold text-slate-500">
            Petak ${p.position}/100 • Kuis: ${p.correctCount}/${p.answeredCount} (${accuracy}%)
          </div>
        </div>
      </div>
      <div class="text-right shrink-0">
        <div class="font-arcade font-bold text-base sm:text-lg text-indigo-600">${p.score}</div>
        <div class="text-[10px] font-extrabold uppercase text-slate-400">Poin</div>
      </div>
    `;
    leaderboardEl.appendChild(row);
  });

  document.getElementById("victoryModal").classList.remove("hidden");
}

let activeBankFilter = "Semua";

function renderBankSoalModal() {
  const tabsContainer = document.getElementById("bankFilterTabs");
  const listContainer = document.getElementById("bankSoalListContainer");
  const countLabel = document.getElementById("bankCountLabel");

  const themes = [
    "Semua",
    "Transisi Politik & Awal Pemerintahan",
    "Program Pembangunan Ekonomi & Sosial",
    "Sistem Politik & Hubungan Luar Negeri",
    "Dinamika Akhir & Masa Transisi 1998",
  ];

  tabsContainer.innerHTML = themes
    .map((t) => {
      const isActive = activeBankFilter === t;
      const label = t === "Semua" ? "Semua Tema (36)" : t;
      return `
        <button
          type="button"
          onclick="setBankFilter('${t}')"
          class="px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition ${
            isActive
              ? "bg-unguArcade text-white border-unguArcade shadow-xs"
              : "bg-white text-slate-700 border-slate-200 hover:border-unguArcade"
          }"
        >
          ${label}
        </button>
      `;
    })
    .join("");

  const filtered =
    activeBankFilter === "Semua"
      ? BANK_SOAL
      : BANK_SOAL.filter((q) => q.tema === activeBankFilter);

  countLabel.textContent = `Menampilkan ${filtered.length} dari ${BANK_SOAL.length} soal`;
  const letters = ["A", "B", "C", "D"];

  listContainer.innerHTML = filtered
    .map(
      (q) => `
      <div class="bg-white border-2 border-slate-200/90 rounded-2xl p-4 space-y-2.5 shadow-2xs">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
            Soal #${q.id} • ${q.tema}
          </span>
          <span class="text-xs font-extrabold text-emerald-600">
            ✓ Kunci: ${letters[q.jawabanBenar]}
          </span>
        </div>
        <p class="font-bold text-sm text-slate-800 leading-snug">
          ${q.pertanyaan}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
          ${q.pilihan
            .map(
              (opt, idx) => `
              <div class="px-3 py-2 rounded-xl border ${
                idx === q.jawabanBenar
                  ? "bg-emerald-50 border-emerald-400 font-bold text-emerald-900"
                  : "bg-slate-50 border-slate-200/80 text-slate-600"
              }">
                <strong>${letters[idx]}.</strong> ${opt}
              </div>
            `,
            )
            .join("")}
        </div>
        <div class="text-xs text-slate-600 bg-amber-50/80 rounded-xl px-3 py-2 border border-amber-200/80">
          <strong class="text-amber-800">💡 Fakta Sejarah:</strong> ${q.fakta}
        </div>
      </div>
    `,
    )
    .join("");
}

window.setBankFilter = function (themeName) {
  activeBankFilter = themeName;
  renderBankSoalModal();
};

function updateBoomboxUI() {
  const playing = SoundEngine.isBgmPlaying();
  const eq = document.getElementById("bgmEqContainer");
  const playIcon = document.getElementById("bgmPlayIcon");
  const select = document.getElementById("bgmTrackSelect");
  const muteBtn = document.getElementById("btnMuteAllAudio");

  if (eq) eq.classList.toggle("bgm-playing", playing);
  if (playIcon) playIcon.textContent = playing ? "⏸" : "▶";
  if (select) select.value = String(SoundEngine.getTrackIndex());
  if (muteBtn) {
    muteBtn.textContent = SoundEngine.isMuted()
      ? "🔊 Nyalakan Semua Suara"
      : "🔇 Bisukan Semua Suara";
  }
}

function startNewGame() {
  const activeCount = gameState.playerCount;
  const players = [];

  for (let i = 0; i < activeCount; i++) {
    const cfg = gameState.setupConfigs[i];
    const cleanName = (cfg.name || "").trim() || `Pemain ${i + 1}`;
    const theme =
      PAWN_THEMES.find((p) => p.id === cfg.pawnId) || PAWN_THEMES[i];
    players.push({
      id: `player-${i}`,
      name: cleanName,
      isBot: Boolean(cfg.isBot),
      botDiff: cfg.botDiff || "santai",
      theme,
      position: 1,
      score: 0,
      correctCount: 0,
      answeredCount: 0,
    });
  }

  clearTimeout(gameState.botActionTimeout);
  clearInterval(gameState.quizTimerInterval);

  gameState.players = players;
  gameState.currentPlayerIndex = 0;
  gameState.turnNumber = 1;
  gameState.isBusy = false;
  gameState.gameOver = false;
  gameState.activeQuiz = null;

  refillAndShuffleQuestions();

  if (!SoundEngine.isMuted() && !SoundEngine.isBgmPlaying()) {
    SoundEngine.startBgm();
  }
  updateBoomboxUI();

  document.getElementById("setupScreen").classList.add("hidden");
  document.getElementById("victoryModal").classList.add("hidden");
  document.getElementById("quizModal").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  document.getElementById("btnBackToSetup").classList.remove("hidden");

  document.getElementById("activityLog").innerHTML = "";
  addActivityLog(
    `🚀 Petualangan dimulai dengan <strong>${players.length} Pemain</strong> di <strong>Petak 1 (START)</strong>! Giliran pertama: <strong>${players[0].name}</strong>!`,
  );

  buildBoardGrid();
  drawBoardSvgOverlay();
  init3DDiceCubes();
  renderPawns();
  updateTurnAndScoreboardUI();

  if (players[0].isBot) {
    gameState.botActionTimeout = setTimeout(() => {
      handleRollDice();
    }, 900);
  }
}

// Fungsi Tambah Pemain Susulan di Tengah Permainan (Mid-Game Join)
function addMidGamePlayer() {
  if (gameState.players.length >= 4) {
    showToast("⚠️ Maksimal 4 pemain dalam 1 permainan!", "warning");
    return;
  }

  const nameInput = document.getElementById("midGameNewName");
  const typeSelect = document.getElementById("midGameNewType");
  const newSlotIndex = gameState.players.length;

  const rawType = typeSelect.value;
  const isBot = rawType !== "human";
  const botDiff = rawType === "bot-pintar" ? "pintar" : "santai";

  let cleanName = (nameInput.value || "").trim();
  if (!cleanName) {
    cleanName = isBot
      ? `Bot AI ${newSlotIndex + 1} (${botDiff === "pintar" ? "Pintar" : "Santai"})`
      : `Pemain ${newSlotIndex + 1}`;
  }

  const usedPawnIds = new Set(gameState.players.map((p) => p.theme.id));
  const freeTheme =
    PAWN_THEMES.find((p) => !usedPawnIds.has(p.id)) ||
    PAWN_THEMES[newSlotIndex];

  const newPlayer = {
    id: `player-${newSlotIndex}-${Date.now()}`,
    name: cleanName,
    isBot,
    botDiff,
    theme: freeTheme,
    position: 1,
    score: 0,
    correctCount: 0,
    answeredCount: 0,
  };

  gameState.players.push(newPlayer);

  gameState.playerCount = gameState.players.length;
  gameState.setupConfigs[newSlotIndex] = {
    name: cleanName,
    pawnId: freeTheme.id,
    isBot,
    botDiff,
  };

  nameInput.value = "";
  document.getElementById("midGameAddForm").classList.add("hidden");
  document.getElementById("btnOpenMidGameAdd").classList.remove("hidden");

  SoundEngine.event();
  renderPawns(newPlayer.id);
  updateTurnAndScoreboardUI();
  addActivityLog(
    `✨ <strong>${newPlayer.name}</strong> bergabung sebagai pemain ke-${gameState.players.length} mulai dari <strong>Petak 1</strong>!`,
    "event",
  );
  showToast(`🎉 ${newPlayer.name} bergabung ke papan permainan!`, "success");
}

function returnToSetupScreen() {
  clearTimeout(gameState.botActionTimeout);
  clearInterval(gameState.quizTimerInterval);
  gameState.isBusy = false;
  gameState.gameOver = false;
  gameState.activeQuiz = null;

  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("victoryModal").classList.add("hidden");
  document.getElementById("quizModal").classList.add("hidden");
  document.getElementById("btnBackToSetup").classList.add("hidden");
  document.getElementById("setupScreen").classList.remove("hidden");
  renderSetupPlayers();
}

document.addEventListener("DOMContentLoaded", () => {
  renderSetupPlayers();
  renderBankSoalModal();
  updateBoomboxUI();

  // Auto-start musik ceria saat klik pertama pengguna di halaman
  const unlockAudioOnFirstClick = () => {
    if (SoundEngine.tryAutoStartBgm()) {
      updateBoomboxUI();
    }
    document.removeEventListener("pointerdown", unlockAudioOnFirstClick);
  };
  document.addEventListener("pointerdown", unlockAudioOnFirstClick);

  // Kontrol Mini Boombox BGM & Mixer Volume
  document.getElementById("btnBgmPlayPause").addEventListener("click", (e) => {
    e.stopPropagation();
    const isNowPlaying = SoundEngine.toggleBgm();
    updateBoomboxUI();
    showToast(
      isNowPlaying
        ? `🎵 Memutar: ${SoundEngine.getTrackName()}`
        : "⏸ Musik latar dijeda",
      "info",
    );
  });

  document.getElementById("bgmTrackSelect").addEventListener("change", (e) => {
    const trackName = SoundEngine.setTrack(e.target.value);
    if (!SoundEngine.isBgmPlaying()) SoundEngine.startBgm();
    updateBoomboxUI();
    showToast(`🎶 Lagu diganti: ${trackName}`, "info");
  });

  document.getElementById("btnNextTrack").addEventListener("click", () => {
    SoundEngine.nextTrack();
    updateBoomboxUI();
    showToast(`🎶 Lagu berikutnya: ${SoundEngine.getTrackName()}`, "info");
  });

  document.getElementById("btnToggleMixer").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("audioMixerPopover").classList.toggle("hidden");
  });

  document.getElementById("btnCloseMixer").addEventListener("click", () => {
    document.getElementById("audioMixerPopover").classList.add("hidden");
  });

  document.getElementById("bgmVolumeSlider").addEventListener("input", (e) => {
    const val = Number(e.target.value);
    SoundEngine.setBgmVolume(val);
    document.getElementById("bgmVolLabel").textContent = `${val}%`;
  });

  document.getElementById("sfxVolumeSlider").addEventListener("input", (e) => {
    const val = Number(e.target.value);
    SoundEngine.setSfxVolume(val);
    document.getElementById("sfxVolLabel").textContent = `${val}%`;
  });

  document.getElementById("btnMuteAllAudio").addEventListener("click", () => {
    const muted = SoundEngine.toggleMuteAll();
    updateBoomboxUI();
    showToast(
      muted ? "🔇 Semua suara dibisukan" : "🔊 Suara permainan aktif kembali!",
      "info",
    );
  });

  // Tambah Pemain Susulan (In-Game)
  document.getElementById("btnOpenMidGameAdd").addEventListener("click", () => {
    document.getElementById("btnOpenMidGameAdd").classList.add("hidden");
    document.getElementById("midGameAddForm").classList.remove("hidden");
    const nextNum = gameState.players.length + 1;
    const input = document.getElementById("midGameNewName");
    input.value = `Pemain ${nextNum}`;
    input.focus();
  });

  document
    .getElementById("btnCancelMidGameAdd")
    .addEventListener("click", () => {
      document.getElementById("midGameAddForm").classList.add("hidden");
      document.getElementById("btnOpenMidGameAdd").classList.remove("hidden");
    });

  document
    .getElementById("btnConfirmMidGameAdd")
    .addEventListener("click", addMidGamePlayer);

  // Tombol Utama Permainan
  document
    .getElementById("btnStartGame")
    .addEventListener("click", startNewGame);
  document
    .getElementById("btnRollDesktop")
    .addEventListener("click", handleRollDice);
  document
    .getElementById("btnRollMobile")
    .addEventListener("click", handleRollDice);
  document
    .getElementById("btnContinueAfterQuiz")
    .addEventListener("click", continueAfterQuiz);

  // Tombol Modal Kemenangan & Reset
  document
    .getElementById("btnPlayAgainSame")
    .addEventListener("click", startNewGame);
  document
    .getElementById("btnPlayAgainSetup")
    .addEventListener("click", returnToSetupScreen);
  document
    .getElementById("btnBackToSetup")
    .addEventListener("click", returnToSetupScreen);

  // Modal Cara Main & Bank Soal
  document.getElementById("btnRules").addEventListener("click", () => {
    document.getElementById("rulesModal").classList.remove("hidden");
  });
  document.getElementById("btnQuestionBank").addEventListener("click", () => {
    renderBankSoalModal();
    document.getElementById("bankSoalModal").classList.remove("hidden");
  });
  document.querySelectorAll(".close-modal-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      if (targetId) document.getElementById(targetId).classList.add("hidden");
    });
  });

  // Pintasan Keyboard (Spasi untuk Kocok Dadu, A/B/C/D atau 1/2/3/4 untuk Kuis)
  document.addEventListener("keydown", (e) => {
    const gameVisible = !document
      .getElementById("gameScreen")
      .classList.contains("hidden");
    const quizModal = document.getElementById("quizModal");
    const quizVisible = !quizModal.classList.contains("hidden");
    const rulesHidden = document
      .getElementById("rulesModal")
      .classList.contains("hidden");
    const bankHidden = document
      .getElementById("bankSoalModal")
      .classList.contains("hidden");
    const victoryHidden = document
      .getElementById("victoryModal")
      .classList.contains("hidden");

    if (!gameVisible || !rulesHidden || !bankHidden || !victoryHidden) return;

    if (quizVisible && gameState.activeQuiz) {
      const q = gameState.activeQuiz;
      if (!q.player.isBot && !q.answered) {
        const keyMap = {
          KeyA: 0,
          Digit1: 0,
          KeyB: 1,
          Digit2: 1,
          KeyC: 2,
          Digit3: 2,
          KeyD: 3,
          Digit4: 3,
        };
        if (e.code in keyMap) {
          e.preventDefault();
          submitQuizAnswer(keyMap[e.code]);
        }
      } else if (q.answered && (e.code === "Enter" || e.code === "Space")) {
        e.preventDefault();
        continueAfterQuiz();
      }
      return;
    }

    if (e.code === "Space") {
      const current = gameState.players[gameState.currentPlayerIndex];
      if (
        current &&
        !current.isBot &&
        !gameState.isBusy &&
        !gameState.gameOver
      ) {
        e.preventDefault();
        handleRollDice();
      }
    }
  });
});
