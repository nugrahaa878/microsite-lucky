"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Participant, getParticipants, saveParticipants, clearParticipants, formatDate } from "../lib/participants";
import { seedDummyData, exportCsv } from "../lib/adminHelpers";
import ClassicShuffle from "./ClassicShuffle";
import WheelDraw from "./WheelDraw";
import WinnerModal from "./WinnerModal";

type DrawMethod = "shuffle" | "wheel";

const DRAW_METHODS: { id: DrawMethod; label: string }[] = [
  { id: "shuffle", label: "Classic Shuffle" },
  { id: "wheel", label: "🎡 Wheel of Fortune" },
];

export default function AdminPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [method, setMethod] = useState<DrawMethod>("shuffle");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync initial state from localStorage on mount
    setParticipants(getParticipants());
  }, []);

  const winners = participants.filter((p) => p.hasWon);
  const eligible = participants.filter((p) => !p.hasWon);
  const eligibleCount = eligible.length;

  function handleSeed() {
    setParticipants(seedDummyData());
  }

  function handleReset() {
    const confirmed = confirm("Hapus semua data peserta dan pemenang? Tindakan ini tidak bisa dibatalkan.");
    if (!confirmed) return;
    clearParticipants();
    setParticipants([]);
  }

  function handleExport() {
    exportCsv(getParticipants());
  }

  function handleWinner(picked: Participant) {
    const current = getParticipants();
    const updated = current.map((p) => (p.id === picked.id ? { ...p, hasWon: true } : p));
    saveParticipants(updated);
    setParticipants(updated);
    setIsDrawing(false);
    setWinner(picked);
  }

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="logo">
            ✦ Sasa <span className="admin-tag">Admin</span>
          </div>
          <nav>
            <Link href="/">← Kembali ke Microsite</Link>
          </nav>
        </div>
      </header>

      <main className="container admin-main">
        <div className="admin-header-row">
          <div>
            <h1>Admin Dashboardd</h1>
            <p className="muted">
              Kelola data peserta dan jalankan lucky draw. Data tersimpan lokal di browser ini
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
            <span className="stat-number">{winners.length}</span>
            <span className="stat-label">Total Pemenang</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{eligibleCount}</span>
            <span className="stat-label">Peserta Belum Menang</span>
          </div>
        </div>

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
                  <th>Nama</th>
                  <th>No. WhatsApp</th>
                  <th>Waktu Daftar</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, idx) => (
                  <tr key={p.id}>
                    <td>{idx + 1}</td>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.whatsapp}</td>
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
              </tbody>
            </table>
            {participants.length === 0 && (
              <p className="muted empty-state">Belum ada peserta terdaftar.</p>
            )}
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
              eligible={eligible}
              isDrawing={isDrawing}
              onDrawStart={() => setIsDrawing(true)}
              onWinner={handleWinner}
            />
          )}
          {method === "wheel" && (
            <WheelDraw
              eligible={eligible}
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
                    <strong>{w.name}</strong> — {w.whatsapp} <span className="muted">({w.id})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      {winner && <WinnerModal winner={winner} onClose={() => setWinner(null)} />}
    </>
  );
}
