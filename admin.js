/* ============================================================
   Event Microsite — Admin Dashboard Logic
   Pure front-end demo: dummy data + localStorage (no backend/DB)
   ============================================================ */

const STORAGE_KEY = "microsite_participants";

const DUMMY_NAMES = [
  "Ari Nugraha", "Siti Rahma", "Budi Santoso", "Dewi Lestari", "Andi Wijaya",
  "Putri Ayu", "Rizky Pratama", "Nadia Salsabila", "Fajar Ramadhan", "Intan Permata",
  "Yusuf Hidayat", "Melati Sari", "Bagus Prasetyo", "Ayu Kusuma", "Dimas Saputra"
];

// ---------- Storage Helpers ----------

function getParticipants() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveParticipants(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function randomPhone() {
  let n = "08";
  for (let i = 0; i < 10; i++) n += Math.floor(Math.random() * 10);
  return n;
}

function randomPastDate() {
  const now = Date.now();
  const past = now - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000); // up to 5 days ago
  return new Date(past).toISOString();
}

function seedDummyData() {
  const existing = getParticipants();
  const usedPhones = new Set(existing.map(p => p.whatsapp));
  const newEntries = [];

  DUMMY_NAMES.forEach((name, i) => {
    let phone = randomPhone();
    while (usedPhones.has(phone)) phone = randomPhone();
    usedPhones.add(phone);

    newEntries.push({
      id: "P" + String(existing.length + newEntries.length + 1).padStart(4, "0"),
      name: name,
      whatsapp: phone,
      registeredAt: randomPastDate(),
      hasWon: false
    });
  });

  const combined = existing.concat(newEntries);
  saveParticipants(combined);
  return combined;
}

// ---------- Rendering ----------

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

function renderAll() {
  const participants = getParticipants();
  renderTable(participants);
  renderStats(participants);
  renderWinners(participants);
}

function renderTable(participants) {
  const body = document.getElementById("participantBody");
  const emptyState = document.getElementById("emptyState");

  if (participants.length === 0) {
    body.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  body.innerHTML = participants.map((p, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${p.id}</td>
      <td>${escapeHtml(p.name)}</td>
      <td>${escapeHtml(p.whatsapp)}</td>
      <td>${formatDate(p.registeredAt)}</td>
      <td>${p.hasWon ? '<span class="badge badge-win">Pemenang</span>' : '<span class="badge">Terdaftar</span>'}</td>
    </tr>
  `).join("");
}

function renderStats(participants) {
  const winners = participants.filter(p => p.hasWon);
  document.getElementById("statTotal").textContent = participants.length;
  document.getElementById("statWinners").textContent = winners.length;
  document.getElementById("statEligible").textContent = participants.length - winners.length;
}

function renderWinners(participants) {
  const ul = document.getElementById("winnersUl");
  const winners = participants.filter(p => p.hasWon);

  if (winners.length === 0) {
    ul.innerHTML = '<li class="muted">Belum ada pemenang.</li>';
    return;
  }

  ul.innerHTML = winners.map(w => `
    <li><strong>${escapeHtml(w.name)}</strong> — ${escapeHtml(w.whatsapp)} <span class="muted">(${w.id})</span></li>
  `).join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- CSV Export ----------

function exportCsv() {
  const participants = getParticipants();

  if (participants.length === 0) {
    alert("Belum ada data peserta untuk di-export.");
    return;
  }

  const headers = ["No", "ID", "Nama", "No WhatsApp", "Waktu Daftar", "Status"];
  const rows = participants.map((p, idx) => [
    idx + 1,
    p.id,
    p.name,
    p.whatsapp,
    formatDate(p.registeredAt),
    p.hasWon ? "Pemenang" : "Terdaftar"
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(csvEscape).join(","))
    .join("\r\n");

  const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `peserta-lucky-draw-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// ---------- Lucky Draw ----------

let isDrawing = false;

function runLuckyDraw() {
  if (isDrawing) return;

  const participants = getParticipants();
  const eligible = participants.filter(p => !p.hasWon); // 1 pax / win rule

  const drawDisplay = document.getElementById("drawDisplay");
  const drawBtn = document.getElementById("drawBtn");

  if (eligible.length === 0) {
    drawDisplay.innerHTML = '<span class="draw-placeholder">Tidak ada peserta yang memenuhi syarat untuk diundi.</span>';
    return;
  }

  isDrawing = true;
  drawBtn.disabled = true;
  drawBtn.textContent = "Mengundi...";
  drawDisplay.classList.add("shuffling");

  const shuffleDurationMs = 2500;
  const shuffleIntervalMs = 80;
  let elapsed = 0;

  const intervalId = setInterval(() => {
    const randomPick = eligible[Math.floor(Math.random() * eligible.length)];
    drawDisplay.innerHTML = `<span class="draw-name">${escapeHtml(randomPick.name)}</span>`;
    elapsed += shuffleIntervalMs;

    if (elapsed >= shuffleDurationMs) {
      clearInterval(intervalId);
      finalizeWinner(eligible);
    }
  }, shuffleIntervalMs);
}

function finalizeWinner(eligible) {
  const winner = eligible[Math.floor(Math.random() * eligible.length)];
  const participants = getParticipants();
  const updated = participants.map(p =>
    p.id === winner.id ? { ...p, hasWon: true } : p
  );
  saveParticipants(updated);

  const drawDisplay = document.getElementById("drawDisplay");
  const drawBtn = document.getElementById("drawBtn");

  drawDisplay.classList.remove("shuffling");
  drawDisplay.classList.add("winner-reveal");
  drawDisplay.innerHTML = `
    <span class="draw-winner-label">🏆 Pemenang</span>
    <span class="draw-name draw-name-final">${escapeHtml(winner.name)}</span>
    <span class="draw-winner-phone">${escapeHtml(winner.whatsapp)}</span>
  `;

  drawBtn.disabled = false;
  drawBtn.textContent = "🎉 Undi Pemenang";
  isDrawing = false;

  setTimeout(() => drawDisplay.classList.remove("winner-reveal"), 1200);

  renderAll();
}

// ---------- Reset ----------

function resetData() {
  const confirmed = confirm("Hapus semua data peserta dan pemenang? Tindakan ini tidak bisa dibatalkan.");
  if (!confirmed) return;
  localStorage.removeItem(STORAGE_KEY);
  const drawDisplay = document.getElementById("drawDisplay");
  drawDisplay.innerHTML = '<span class="draw-placeholder">Tekan tombol untuk mulai undian</span>';
  renderAll();
}

// ---------- Event Bindings ----------

document.getElementById("exportBtn").addEventListener("click", exportCsv);
document.getElementById("drawBtn").addEventListener("click", runLuckyDraw);
document.getElementById("resetBtn").addEventListener("click", resetData);
document.getElementById("seedBtn").addEventListener("click", () => {
  seedDummyData();
  renderAll();
});

// ---------- Init ----------

renderAll();
