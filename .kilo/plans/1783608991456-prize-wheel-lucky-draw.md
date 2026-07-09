# Lucky Draw v2 — Prize-Based Wheel + NIK Registration

## Goal
Ubah sistem lucky draw dari "undian 1 peserta dari wheel nama" menjadi "wheel hadiah + stok + tracking history". Pendaftaran pakai NIK + nama (tanpa WhatsApp). Maks 1000 peserta.

---

## Current State
- Registration: nama + WhatsApp → entry code `P0001`
- Admin: 2 metode undian (Classic Shuffle + Wheel) → pilih peserta dari daftar eligible
- Winner modal: nama, ID, nomor WhatsApp
- Data: localStorage (participants + dummy seed + CSV export)
- Wheel menampilkan **nama peserta**

## Target State
- Registration: NIK + nama (NIK unique), max 1000 peserta
- Admin: Prize registry + stock management + per-prize history
- Wheel menampilkan **jenis hadiah** dengan probability weighted by sisa stok
- Setelah wheel berhenti → auto-pick peserta eligible → peserta menang + hadiah berkurang
- History: setiap hadiah tercatat siapa yang menang, kapan, sisa stok berapa

---

## Data Model

### Participant (app/lib/participants.ts)
```
id: string        // P0001, P0002 ...
nik: string       // NIK karyawan (unique)
name: string      // nama lengkap
registeredAt: string (ISO)
hasWon: boolean   // true jika sudah pernah menang
```

### Prize (app/lib/prizes.ts — new)
```
id: string
name: string      // ex: "Tumbler Sasa", "Voucher Belanja 50K"
emoji: string     // emoji untuk wheel
color: string     // warna segmen wheel
totalStock: number // stok awal
remainingStock: number // sisa stok saat ini
```

### DrawRecord (app/lib/prizes.ts — new)
```
id: string
participantId: string
participantName: string
participantNik: string
prizeId: string
prizeName: string
drawnAt: string (ISO)
stockAfter: number // sisa stok setelah draw
```

### Storage Keys
- `microsite_participants` — existing, keep same key
- `microsite_prizes` — new, default empty array
- `microsite_draw_history` — new, default empty array

---

## Files to Change

### 1. app/lib/participants.ts
- Rename `whatsapp` → `nik`
- Remove `normalizePhone`, replace with `normalizeNik` (trim, uppercase, strip spaces)
- Keep `formatDate`, `getParticipants`, `saveParticipants`, `clearParticipants`

### 2. app/lib/prizes.ts (NEW)
- `getPrizes()`, `savePrizes()`, `clearPrizes()`
- `getDrawHistory()`, `saveDrawHistory()`, `clearDrawHistory()`
- `createPrize(prize)`, `updatePrizeStock(id, newStock)` — helper functions
- Default seed prizes: `[{ name: "Tumbler Sasa", emoji: "🥤", color: "#ff6b35", totalStock: 10, remainingStock: 10 }, { name: "Voucher Belanja", emoji: "🎫", color: "#1a1a2e", totalStock: 100, remainingStock: 100 }]`

### 3. app/lib/adminHelpers.ts
- Update `seedDummyData()` — generate NIK instead of phone, ensure uniqueness
- Update `exportCsv()` — headers: No, ID, NIK, Nama, Waktu Daftar, Status (hapus kolom WhatsApp)

### 4. app/components/RegisterSection.tsx
- Ganti field WhatsApp → NIK (input type="text", placeholder "cth. 1234567890123456")
- Validasi: tidak kosong, format numerik 10-20 digit, unique terhadap NIK yang sudah ada
- Quota check: batas 1000 peserta, tampilkan sisa kuota
- Success state: tampilkan NIK + entry code

### 5. app/admin/page.tsx
- Tambah section **Daftar Hadiah**: tabel/list prize dengan nama, emoji, total stok, sisa stok, aksi edit/delete
- Tambah form/tambah hadiah baru: name, emoji, total stock
- Tambah section **History per Hadiah**: klik prize → tampilkan history siapa yang menang
- Update stats: total peserta, total hadiah tersedia, peserta belum menang
- Draw section: setelah wheel berhenti, auto-pick peserta eligible, simpan record ke history
- Winner modal: tampilkan nama + NIK + hadiah yang didapat (hapus WhatsApp)

### 6. app/admin/WheelDraw.tsx
- Wheel data = prizes dengan `remainingStock > 0`
- Weighted random selection: probability = `prize.remainingStock / totalRemainingStock`
- Setelah wheel berhenti:
  1. Tentukan hadiah berdasarkan weighted random
  2. Auto-pick peserta eligible random
  3. Decrement `remainingStock` hadiah
  4. Tandai peserta `hasWon = true`
  5. Simpan draw record ke history
  6. Tampilkan WinnerModal dengan { peserta, hadiah }

### 7. app/admin/ClassicShuffle.tsx
- Keep metode ini, tapi ubah isinya: shuffle **nama hadiah** (bukan nama peserta)
- Setelah berhenti: auto-pick peserta eligible + hadiah yang ditampilkan
- Sama logic dengan WheelDraw: decrement stock, mark winner, save history

### 8. app/admin/WinnerModal.tsx
- Ganti props: dari `{ id, name, whatsapp }` → `{ id, name, nik, prizeName }`
- Tampilkan: Nama, NIK, Nomor Peserta, Hadiah yang Didapat
- Hapus bagian WhatsApp

### 9. app/globals.css
- Tambah styles untuk admin prize management (tabel prize, badge stok habis, history list)
- Tambah style untuk quota indicator (ex: "Kuota: 342/1000")

### 10. app/data.ts
- No changes to existing products/recipes
- Optional: tambah default prizes di sini atau biar di prizes.ts saja

---

## Flow

```
Pendaftaran (homepage)
  ├─ Input NIK (unique, max 1000)
  ├─ Input Nama
  ├─ Submit → generate P0001, simpan ke localStorage
  └─ Show: "Pendaftaran berhasil! Nomor undian: P0001"

Admin Panel (/admin)
  ├─ Statistik: total peserta, hadiah tersedia, belum menang
  ├─ Daftar Hadiah
  │   ├─ List prize (nama, emoji, total stok, sisa stok)
  │   ├─ Tambah hadiah baru
  │   └─ Edit stok hadiah
  ├─ History Hadiah (per prize)
  │   └─ Siapa menang apa, kapan, sisa stok
  ├─ Draw Section
  │   ├─ Pilih metode: Wheel / Classic Shuffle
  │   ├─ Spin → wheel hadiah (weighted by stok)
  │   ├─ Auto-pick peserta eligible
  │   ├─ Decrement stok hadiah
  │   ├─ Mark peserta hasWon = true
  │   └─ Winner Modal: { nama, NIK, hadiah }
  └─ Data Peserta (table + CSV export)
```

---

## Edge Cases
1. **Stok hadiah habis**: hadiah otomatis hilang dari wheel, pesan "Tidak ada hadiah tersedia"
2. **Semua peserta sudah menang**: draw disabled, pesan "Semua peserta sudah mendapatkan hadiah"
3. **Kuota 1000 penuh**: form pendaftaran disabled, pesan "Kuota sudah penuh"
4. **NIK duplicate**: tolak pendaftaran, pesan "NIK sudah terdaftar"
5. **Tidak ada hadiah di wheel**: Classic Shuffle menampilkan "Tidak ada hadiah tersedia untuk diundi"
6. **Stok hadiah = 0 tetapi masih ada di daftar**: tampilkan badge "Habis", tidak termasuk di wheel

---

## Validation Checklist
- [ ] Registration: NIK unique, max 1000, valid format
- [ ] Wheel: probability correct (lower stock = less likely)
- [ ] Prize with 0 stock excluded from wheel
- [ ] Winner correctly marked hasWon=true
- [ ] Stock decrements after each draw
- [ ] History record saved with correct data
- [ ] CSV export columns: No, ID, NIK, Nama, Waktu Daftar, Status
- [ ] Classic Shuffle shows prize names, not participant names
- [ ] Winner modal shows prize instead of WhatsApp

---

## Out of Scope (skip untuk prototype)
- Backend/database — semua localStorage
- Real-time sync antar device
- Authentication admin panel
- Payment/voucher redemption logic
- Print nomor undian/QR code
