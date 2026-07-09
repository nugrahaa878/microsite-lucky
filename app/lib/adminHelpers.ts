import { Participant, getParticipants, saveParticipants, formatDate } from "./participants";

const DUMMY_NAMES = [
  "Ari Nugraha", "Siti Rahma", "Budi Santoso", "Dewi Lestari", "Andi Wijaya",
  "Putri Ayu", "Rizky Pratama", "Nadia Salsabila", "Fajar Ramadhan", "Intan Permata",
  "Yusuf Hidayat", "Melati Sari", "Bagus Prasetyo", "Ayu Kusuma", "Dimas Saputra",
];

function randomNik(): string {
  let n = "";
  for (let i = 0; i < 16; i++) n += Math.floor(Math.random() * 10);
  return n;
}

function randomPastDate(): string {
  const now = Date.now();
  const past = now - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000);
  return new Date(past).toISOString();
}

export function seedDummyData(): Participant[] {
  const existing = getParticipants();
  const usedNiks = new Set(existing.map((p) => p.nik));
  const newEntries: Participant[] = [];

  DUMMY_NAMES.forEach((name) => {
    let nik = randomNik();
    while (usedNiks.has(nik)) nik = randomNik();
    usedNiks.add(nik);

    newEntries.push({
      id: "P" + String(existing.length + newEntries.length + 1).padStart(4, "0"),
      nik,
      name,
      registeredAt: randomPastDate(),
      hasWon: false,
    });
  });

  const combined = existing.concat(newEntries);
  saveParticipants(combined);
  return combined;
}

function csvEscape(value: string | number): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export function exportCsv(participants: Participant[]): void {
  if (participants.length === 0) {
    alert("Belum ada data peserta untuk di-export.");
    return;
  }

  const headers = ["No", "ID", "NIK", "Nama", "Waktu Daftar", "Status"];
  const rows = participants.map((p, idx) => [
    idx + 1,
    p.id,
    p.nik,
    p.name,
    formatDate(p.registeredAt),
    p.hasWon ? "Pemenang" : "Terdaftar",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(","))
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
