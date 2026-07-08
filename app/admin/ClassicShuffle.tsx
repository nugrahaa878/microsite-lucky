"use client";

import { useState } from "react";
import { Participant } from "../lib/participants";

type DrawState =
  | { kind: "idle" }
  | { kind: "shuffling"; name: string }
  | { kind: "none-eligible" };

export default function ClassicShuffle({
  eligible,
  isDrawing,
  onDrawStart,
  onWinner,
}: {
  eligible: Participant[];
  isDrawing: boolean;
  onDrawStart: () => void;
  onWinner: (picked: Participant) => void;
}) {
  const [drawState, setDrawState] = useState<DrawState>({ kind: "idle" });

  function handleDraw() {
    if (isDrawing) return;

    if (eligible.length === 0) {
      setDrawState({ kind: "none-eligible" });
      return;
    }

    onDrawStart();

    const shuffleDurationMs = 2500;
    const shuffleIntervalMs = 80;
    let elapsed = 0;

    const intervalId = setInterval(() => {
      const randomPick = eligible[Math.floor(Math.random() * eligible.length)];
      setDrawState({ kind: "shuffling", name: randomPick.name });
      elapsed += shuffleIntervalMs;

      if (elapsed >= shuffleDurationMs) {
        clearInterval(intervalId);
        setDrawState({ kind: "idle" });
        const picked = eligible[Math.floor(Math.random() * eligible.length)];
        onWinner(picked);
      }
    }, shuffleIntervalMs);
  }

  const isShuffling = drawState.kind === "shuffling";

  return (
    <div className="draw-stage">
      <div className={`draw-display${isShuffling ? " shuffling" : ""}`}>
        {drawState.kind === "idle" && (
          <span className="draw-placeholder">Tekan tombol untuk mulai undian</span>
        )}
        {drawState.kind === "none-eligible" && (
          <span className="draw-placeholder">
            Tidak ada peserta yang memenuhi syarat untuk diundi.
          </span>
        )}
        {drawState.kind === "shuffling" && <span className="draw-name">{drawState.name}</span>}
      </div>
      <button className="btn btn-primary btn-lg" onClick={handleDraw} disabled={isDrawing}>
        {isDrawing ? "Mengundi..." : "🎉 Undi Pemenang"}
      </button>
    </div>
  );
}
