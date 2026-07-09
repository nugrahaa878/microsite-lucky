export type Prize = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  totalStock: number;
  remainingStock: number;
};

export type DrawRecord = {
  id: string;
  participantId: string;
  participantName: string;
  participantNik: string;
  prizeId: string;
  prizeName: string;
  drawnAt: string;
  stockAfter: number;
};

const PRIZES_KEY = "microsite_prizes";
const HISTORY_KEY = "microsite_draw_history";

const DEFAULT_PRIZES: Prize[] = [
  {
    id: "prize-1",
    name: "Tumbler Sasa",
    emoji: "🥤",
    color: "#ff6b35",
    totalStock: 10,
    remainingStock: 10,
  },
  {
    id: "prize-2",
    name: "Voucher Belanja 50K",
    emoji: "🎫",
    color: "#1a1a2e",
    totalStock: 100,
    remainingStock: 100,
  },
  {
    id: "prize-3",
    name: "Eco Bag Sasa",
    emoji: "👜",
    color: "#2e7d55",
    totalStock: 50,
    remainingStock: 50,
  },
];

export function getPrizes(): Prize[] {
  const raw = localStorage.getItem(PRIZES_KEY);
  if (!raw) {
    const seeded = DEFAULT_PRIZES.map((p) => ({ ...p }));
    savePrizes(seeded);
    return seeded;
  }
  return JSON.parse(raw);
}

export function savePrizes(list: Prize[]): void {
  localStorage.setItem(PRIZES_KEY, JSON.stringify(list));
}

export function getDrawHistory(): DrawRecord[] {
  const raw = localStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveDrawHistory(list: DrawRecord[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

export function decrementPrizeStock(prizeId: string): Prize | null {
  const prizes = getPrizes();
  const prize = prizes.find((p) => p.id === prizeId);
  if (!prize || prize.remainingStock <= 0) return null;
  prize.remainingStock -= 1;
  savePrizes(prizes);
  return prize;
}

export function createPrize(prize: Omit<Prize, "id">): Prize {
  const prizes = getPrizes();
  const newPrize: Prize = {
    ...prize,
    id: "prize-" + Date.now(),
  };
  prizes.push(newPrize);
  savePrizes(prizes);
  return newPrize;
}

export function updatePrizeStock(id: string, totalStock: number): Prize | null {
  const prizes = getPrizes();
  const prize = prizes.find((p) => p.id === id);
  if (!prize) return null;
  const diff = totalStock - prize.totalStock;
  prize.totalStock = totalStock;
  prize.remainingStock = Math.max(0, prize.remainingStock + diff);
  savePrizes(prizes);
  return prize;
}

export function deletePrize(id: string): void {
  const prizes = getPrizes().filter((p) => p.id !== id);
  savePrizes(prizes);
}

export function addDrawRecord(record: Omit<DrawRecord, "id">): DrawRecord {
  const history = getDrawHistory();
  const newRecord: DrawRecord = {
    ...record,
    id: "draw-" + Date.now(),
  };
  history.unshift(newRecord);
  saveDrawHistory(history);
  return newRecord;
}

export function getDrawHistoryForPrize(prizeId: string): DrawRecord[] {
  return getDrawHistory().filter((r) => r.prizeId === prizeId);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}
