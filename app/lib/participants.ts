export type Participant = {
  id: string;
  name: string;
  whatsapp: string;
  registeredAt: string;
  hasWon: boolean;
};

const STORAGE_KEY = "microsite_participants";

export function getParticipants(): Participant[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveParticipants(list: Participant[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function clearParticipants(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-()]/g, "");
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}
