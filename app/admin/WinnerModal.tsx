"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

type Winner = {
  id: string;
  name: string;
  whatsapp: string;
};

export default function WinnerModal({
  winner,
  onClose,
}: {
  winner: Winner;
  onClose: () => void;
}) {
  useEffect(() => {
    const duration = 2500;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.6 },
        colors: ["#ff6b35", "#e8531f", "#1a1a2e", "#ffffff"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.6 },
        colors: ["#ff6b35", "#e8531f", "#1a1a2e", "#ffffff"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
      colors: ["#ff6b35", "#e8531f", "#1a1a2e", "#ffffff"],
    });
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card winner-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Tutup">
          ✕
        </button>
        <span className="draw-winner-label">🏆 Selamat Kepada Pemenang</span>
        <span className="draw-name draw-name-final">{winner.name}</span>
        <div className="winner-modal-details">
          <div className="winner-modal-row">
            <span className="muted">Nomor Peserta</span>
            <strong>{winner.id}</strong>
          </div>
          <div className="winner-modal-row">
            <span className="muted">Nomor WhatsApp</span>
            <strong>{winner.whatsapp}</strong>
          </div>
        </div>
        <button className="btn btn-primary btn-block" onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
}
