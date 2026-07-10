"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Participant, getParticipants, clearParticipants, formatDate } from "../lib/participants";
import { seedDummyData, exportCsv } from "../lib/adminHelpers";
import {
  Prize,
  getPrizes,
  createPrize,
  updatePrizeStock,
  deletePrize,
  getDrawHistoryForPrize,
} from "../lib/prizes";
import ClassicShuffle from "./ClassicShuffle";
import WheelDraw from "./WheelDraw";
import WinnerModal from "./WinnerModal";

type DrawMethod = "shuffle" | "wheel";

const DRAW_METHODS: { id: DrawMethod; label: string }[] = [
  { id: "shuffle", label: "Classic Shuffle" },
  { id: "wheel", label: "🎡 Wheel of Fortune" },
];

type AdminWinner = {
  participant: { id: string; name: string; nik: string };
  prize: { id: string; name: string };
};

export default function AdminPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<AdminWinner | null>(null);
  const [method, setMethod] = useState<DrawMethod>("wheel");

  const [showPrizeForm, setShowPrizeForm] = useState(false);
  const [newPrizeName, setNewPrizeName] = useState("");
  const [newPrizeEmoji, setNewPrizeEmoji] = useState("🎁");
  const [newPrizeStock, setNewPrizeStock] = useState(10);
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [editStock, setEditStock] = useState(0);
  const [selectedPrizeHistory, setSelectedPrizeHistory] = useState<Prize | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync initial state from localStorage on mount
    setParticipants(getParticipants());
    setPrizes(getPrizes());
  }, []);

  const winners = participants.filter((p) => p.hasWon);
  const eligible = participants.filter((p) => !p.hasWon);
  const eligibleCount = eligible.length;
  const availablePrizes = prizes.filter((p) => p.remainingStock > 0).length;

  function refreshState() {
    setParticipants(getParticipants());
    setPrizes(getPrizes());
  }

  function handleSeed() {
    setParticipants(seedDummyData());
  }

  function handleReset() {
    const confirmed = confirm("Hapus semua data peserta dan pemenang? Tindakan ini tidak bisa dibatalkan.");
    if (!confirmed) return;
    clearParticipants();
    refreshState();
  }

  function handleExport() {
    exportCsv(getParticipants());
  }

  function handleAddPrize() {
    if (!newPrizeName.trim()) return;
    createPrize({
      name: newPrizeName.trim(),
      emoji: newPrizeEmoji.trim() || "🎁",
      color: "#ff6b35",
      totalStock: newPrizeStock,
      remainingStock: newPrizeStock,
    });
    setNewPrizeName("");
    setNewPrizeEmoji("🎁");
    setNewPrizeStock(10);
    setShowPrizeForm(false);
    refreshState();
  }

  function handleUpdatePrizeStock() {
    if (!editingPrize) return;
    updatePrizeStock(editingPrize.id, editStock);
    setEditingPrize(null);
    refreshState();
  }

  function handleDeletePrize(id: string) {
    const confirmed = confirm("Hapus hadiah ini? Stok yang tersisa akan hilang.");
    if (!confirmed) return;
    deletePrize(id);
    if (selectedPrizeHistory?.id === id) setSelectedPrizeHistory(null);
    refreshState();
  }

  function handleWinner(result: AdminWinner) {
    refreshState();
    setIsDrawing(false);
    setWinner(result);
  }

  function openPrizeHistory(prize: Prize) {
    setSelectedPrizeHistory(prize);
  }

  const prizeHistoryRecords = selectedPrizeHistory ? getDrawHistoryForPrize(selectedPrizeHistory.id) : [];

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="logo">
            <Image src="https://www.sasa.co.id/themes/v1/assets/img/logo_white.png" alt="Sasa" width={90} height={28} className="logo-img" />
            <span className="admin-tag">Admin</span>
          </div>
          <nav>
            <Link href="/">← Kembali ke Microsite</Link>
          </nav>
        </div>
      </header>

      <main className="container admin-main">
        <div className="admin-header-row">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="muted">
              Kelola data peserta, hadiah, dan jalankan lucky draw. Data tersimpan lokal di browser ini
              (demo, tanpa database).
            </p>
          </div>
          <div className="admin-actions">
            <button className="btn btn-outline" onClick={handleSeed}>
              Isi Data Dummy
            </button>
            <button className="btn btn-outline btn-danger" onClick={handleReset}>
              Reset Data
            </button>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-card">
            <span className="stat-number">{participants.length}</span>
            <span className="stat-label">Total Peserta</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{availablePrizes}</span>
            <span className="stat-label">Hadiah Tersedia</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{eligibleCount}</span>
            <span className="stat-label">Peserta Belum Menang</span>
          </div>
        </div>

        <section className="panel">
          <div className="panel-header">
            <h2>Daftar Hadiah</h2>
            <button className="btn btn-primary" onClick={() => setShowPrizeForm(!showPrizeForm)}>
              + Tambah Hadiah
            </button>
          </div>

          {showPrizeForm && (
            <form className="prize-form" onSubmit={(e) => { e.preventDefault(); handleAddPrize(); }}>
              <input
                type="text"
                placeholder="Nama hadiah (ex: Tumbler Sasa)"
                value={newPrizeName}
                onChange={(e) => setNewPrizeName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Emoji (ex: 🥤)"
                value={newPrizeEmoji}
                onChange={(e) => setNewPrizeEmoji(e.target.value)}
                maxLength={2}
              />
              <input
                type="number"
                placeholder="Stok"
                value={newPrizeStock}
                onChange={(e) => setNewPrizeStock(Number(e.target.value))}
                min={1}
                required
              />
              <button type="submit" className="btn btn-primary">Simpan</button>
            </form>
          )}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Emoji</th>
                  <th>Nama Hadiah</th>
                  <th>Total Stok</th>
                  <th>Sisa Stok</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {prizes.map((p) => (
                  <tr key={p.id}>
                    <td>{p.emoji}</td>
                    <td>{p.name}</td>
                    <td>{p.totalStock}</td>
                    <td>
                      {editingPrize?.id === p.id ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(Number(e.target.value))}
                          min={0}
                        />
                      ) : (
                        <span className={p.remainingStock === 0 ? "badge badge-empty" : ""}>
                          {p.remainingStock}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingPrize?.id === p.id ? (
                        <>
                          <button className="btn btn-outline" onClick={handleUpdatePrizeStock}>Simpan</button>
                          <button className="btn btn-outline" onClick={() => setEditingPrize(null)}>Batal</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-outline" onClick={() => { setEditingPrize(p); setEditStock(p.totalStock); }}>Edit Stok</button>
                          <button className="btn btn-outline btn-danger" onClick={() => handleDeletePrize(p.id)}>Hapus</button>
                          <button className="btn btn-outline" onClick={() => openPrizeHistory(p)}>History</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {prizes.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <p className="muted empty-state">Belum ada hadiah. Klik &quot;Tambah Hadiah&quot; untuk membuat hadiah baru.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {selectedPrizeHistory && (
          <section className="panel">
            <div className="panel-header">
              <h2>History: {selectedPrizeHistory.emoji} {selectedPrizeHistory.name}</h2>
              <button className="btn btn-outline" onClick={() => setSelectedPrizeHistory(null)}>Tutup</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>ID Peserta</th>
                    <th>Nama</th>
                    <th>NIK</th>
                    <th>Waktu</th>
                    <th>Sisa Stok</th>
                  </tr>
                </thead>
                <tbody>
                  {prizeHistoryRecords.map((r, idx) => (
                    <tr key={r.id}>
                      <td>{idx + 1}</td>
                      <td>{r.participantId}</td>
                      <td>{r.participantName}</td>
                      <td>{r.participantNik}</td>
                      <td>{formatDate(r.drawnAt)}</td>
                      <td>{r.stockAfter}</td>
                    </tr>
                  ))}
                  {prizeHistoryRecords.length === 0 && (
                    <tr>
                      <td colSpan={6}>
                        <p className="muted empty-state">Belum ada history untuk hadiah ini.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="panel">
          <div className="panel-header">
            <h2>Data Peserta</h2>
            <button className="btn btn-primary" onClick={handleExport}>
              ⬇ Export ke CSV
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>ID</th>
                  <th>NIK</th>
                  <th>Nama</th>
                  <th>Waktu Daftar</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, idx) => (
                  <tr key={p.id}>
                    <td>{idx + 1}</td>
                    <td>{p.id}</td>
                    <td>{p.nik}</td>
                    <td>{p.name}</td>
                    <td>{formatDate(p.registeredAt)}</td>
                    <td>
                      {p.hasWon ? (
                        <span className="badge badge-win">Pemenang</span>
                      ) : (
                        <span className="badge">Terdaftar</span>
                      )}
                    </td>
                  </tr>
                ))}
                {participants.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <p className="muted empty-state">Belum ada peserta terdaftar.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel draw-panel">
          <div className="panel-header">
            <h2>Lucky Draw</h2>
            <div className="method-selector">
              {DRAW_METHODS.map((m) => (
                <button
                  key={m.id}
                  className={`method-tab${method === m.id ? " active" : ""}`}
                  onClick={() => setMethod(m.id)}
                  disabled={isDrawing}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {method === "shuffle" && (
            <ClassicShuffle
              isDrawing={isDrawing}
              onDrawStart={() => setIsDrawing(true)}
              onWinner={handleWinner}
            />
          )}
          {method === "wheel" && (
            <WheelDraw
              isDrawing={isDrawing}
              onDrawStart={() => setIsDrawing(true)}
              onWinner={handleWinner}
            />
          )}

          <div className="winners-list">
            <h3>Riwayat Pemenang</h3>
            {winners.length === 0 ? (
              <ul>
                <li className="muted">Belum ada pemenang.</li>
              </ul>
            ) : (
              <ul>
                {winners.map((w) => (
                  <li key={w.id}>
                    <strong>{w.name}</strong> — {w.nik} <span className="muted">({w.id})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      {winner && (
        <WinnerModal
          winner={{
            id: winner.participant.id,
            name: winner.participant.name,
            nik: winner.participant.nik,
            prizeName: winner.prize.name,
          }}
          onClose={() => setWinner(null)}
        />
      )}
    </>
  );
}
