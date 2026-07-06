/* ============================================================
   Event Microsite — Landing Page Logic
   Pure front-end demo: dummy data + localStorage (no backend/DB)
   ============================================================ */

const STORAGE_KEY = "microsite_participants";

// ---------- Dummy Content ----------

const PRODUCTS = [
  {
    emoji: "🧴",
    name: "Product Aqua Glow",
    desc: "Formula ringan dengan kandungan hyaluronic acid untuk kulit yang lebih lembap sepanjang hari."
  },
  {
    emoji: "🌿",
    name: "Product Herbal Fresh",
    desc: "Diracik dari ekstrak herbal alami, cocok untuk pemakaian harian tanpa efek lengket."
  },
  {
    emoji: "✨",
    name: "Product Radiance Boost",
    desc: "Membantu mencerahkan tampilan kulit kusam hanya dalam pemakaian rutin 14 hari."
  }
];

const RECIPES = [
  {
    emoji: "🥗",
    title: "Salad Segar Sehari-hari",
    desc: "Kombinasi sayur segar dengan dressing ringan, cocok untuk menu diet harian."
  },
  {
    emoji: "🍲",
    title: "Sup Hangat Keluarga",
    desc: "Resep sup rumahan yang simpel, hangat, dan cocok dinikmati bersama keluarga."
  },
  {
    emoji: "🥤",
    title: "Smoothie Energi Pagi",
    desc: "Campuran buah-buahan segar untuk menemani aktivitas pagi harimu."
  }
];

// ---------- Render Dummy Content ----------

function renderCards(containerId, items, titleKey) {
  const container = document.getElementById(containerId);
  container.innerHTML = items.map(item => `
    <div class="card">
      <div class="card-emoji">${item.emoji}</div>
      <h3>${item[titleKey]}</h3>
      <p>${item.desc}</p>
    </div>
  `).join("");
}

renderCards("productGrid", PRODUCTS, "name");
renderCards("recipeGrid", RECIPES, "title");

// ---------- Participants Storage Helpers ----------

function getParticipants() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveParticipants(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function normalizePhone(phone) {
  return phone.replace(/[\s\-()]/g, "");
}

// ---------- Registration Form ----------

const regForm = document.getElementById("regForm");
const formError = document.getElementById("formError");
const registerFormWrap = document.getElementById("registerForm");
const thankYouWrap = document.getElementById("thankYou");

regForm.addEventListener("submit", function (e) {
  e.preventDefault();
  formError.textContent = "";

  const fullName = document.getElementById("fullName").value.trim();
  const waRaw = document.getElementById("waNumber").value.trim();
  const wa = normalizePhone(waRaw);

  if (!fullName || !wa) {
    formError.textContent = "Nama dan nomor WhatsApp wajib diisi.";
    return;
  }

  if (!/^\d{8,15}$/.test(wa)) {
    formError.textContent = "Format nomor WhatsApp tidak valid.";
    return;
  }

  const participants = getParticipants();
  const isDuplicate = participants.some(p => p.whatsapp === wa);

  if (isDuplicate) {
    formError.textContent = "Nomor WhatsApp ini sudah terdaftar. Satu nomor hanya bisa daftar sekali.";
    return;
  }

  const entry = {
    id: "P" + String(participants.length + 1).padStart(4, "0"),
    name: fullName,
    whatsapp: wa,
    registeredAt: new Date().toISOString(),
    hasWon: false
  };

  participants.push(entry);
  saveParticipants(participants);

  // Show thank-you screen
  document.getElementById("thankName").textContent = entry.name;
  document.getElementById("entryCode").textContent = entry.id;
  registerFormWrap.classList.add("hidden");
  thankYouWrap.classList.remove("hidden");
  regForm.reset();
});

document.getElementById("registerAnotherBtn").addEventListener("click", function () {
  thankYouWrap.classList.add("hidden");
  registerFormWrap.classList.remove("hidden");
});
