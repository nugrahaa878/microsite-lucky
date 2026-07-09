"use client";

import { useEffect, useState } from "react";
import { getPrizes, decrementPrizeStock, addDrawRecord } from "../lib/prizes";
import { getParticipants, saveParticipants } from "../lib/participants";

type DrawState =
  | { kind: "idle" }
  | { kind: "shuffling"; name: string }
  | { kind: "none-eligible" }
  | { kind: "none-prize" };

export default function ClassicShuffle({
  isDrawing,
  onDrawStart,
  onWinner,
}: {
  isDrawing: boolean;
  onDrawStart: () => void;
  onWinner: (winner: { participant: { id: string; name: string; nik: string }; prize: { id: string; name: string } }) => void;
}) {
  const [drawState, setDrawState] = useState<DrawState>({ kind: "idle" });
  const [prizes, setPrizes] = useState<{ id: string; name: string; remainingStock: number }[]>([]);
  const [eligible, setEligible] = useState<{ id: string; name: string; nik: string }[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync initial state from localStorage on mount
    setPrizes(getPrizes().filter((p) => p.remainingStock > 0));
    setEligible(getParticipants().filter((p) => !p.hasWon));
  }, []);

  function handleDraw() {
    if (isDrawing) return;

    if (prizes.length === 0) {
      setDrawState({ kind: "none-prize" });
      return;
    }

    if (eligible.length === 0) {
      setDrawState({ kind: "none-eligible" });
      return;
    }

    onDrawStart();

    const shuffleDurationMs = 2500;
    const shuffleIntervalMs = 80;
    let elapsed = 0;

    const intervalId = setInterval(() => {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setDrawState({ kind: "shuffling", name: randomPrize.name });
      elapsed += shuffleIntervalMs;

      if (elapsed >= shuffleDurationMs) {
        clearInterval(intervalId);
        setDrawState({ kind: "idle" });

        const winnerIndex = Math.floor(Math.random() * prizes.length);
        const prize = prizes[winnerIndex];
        const updatedPrize = decrementPrizeStock(prize.id);
        if (!updatedPrize) return;

        const participantIndex = Math.floor(Math.random() * eligible.length);
        const participant = eligible[participantIndex];

        const updatedParticipants = getParticipants().map((p) =>
          p.id === participant.id ? { ...p, hasWon: true } : p
        );
        saveParticipants(updatedParticipants);

        addDrawRecord({
          participantId: participant.id,
          participantName: participant.name,
          participantNik: participant.nik,
          prizeId: updatedPrize.id,
          prizeName: updatedPrize.name,
          drawnAt: new Date().toISOString(),
          stockAfter: updatedPrize.remainingStock,
        });

        onWinner({ participant, prize: { id: updatedPrize.id, name: updatedPrize.name } });
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
        {drawState.kind === "none-prize" && (
          <span className="draw-placeholder">
            Tidak ada hadiah tersedia untuk diundi.
          </span>
        )}
        {drawState.kind === "shuffling" && <span className="draw-name">{drawState.name}</span>}
      </div>
      <button className="btn btn-primary btn-lg" onClick={handleDraw} disabled={isDrawing}>
        {isDrawing ? "Mengundi..." : "🎉 Undi Hadiah"}
      </button>
    </div>
  );
}
