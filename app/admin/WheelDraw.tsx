"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  getPrizes,
  decrementPrizeStock,
  addDrawRecord,
} from "../lib/prizes";
import { Participant, getParticipants, saveParticipants } from "../lib/participants";

const Wheel = dynamic(() => import("react-custom-roulette").then((mod) => mod.Wheel), {
  ssr: false,
});

const WHEEL_COLORS = ["#ff6b35", "#1a1a2e", "#e8531f", "#2d2d55", "#2e7d55", "#4a4a6a"];

export default function WheelDraw({
  isDrawing,
  onDrawStart,
  onWinner,
}: {
  isDrawing: boolean;
  onDrawStart: () => void;
  onWinner: (winner: { participant: Participant; prize: { id: string; name: string } }) => void;
}) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [nonePrize, setNonePrize] = useState(false);
  const [prizes, setPrizes] = useState<{ id: string; name: string; emoji: string; color: string; remainingStock: number }[]>([]);
  const [eligible, setEligible] = useState<Participant[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync initial state from localStorage on mount
    setPrizes(getPrizes().filter((p) => p.remainingStock > 0));
    setEligible(getParticipants().filter((p) => !p.hasWon));
  }, []);

  const wheelData = prizes.map((p, idx) => ({
    option: p.emoji ? `${p.emoji} ${p.name}` : p.name,
    style: {
      backgroundColor: p.color || WHEEL_COLORS[idx % WHEEL_COLORS.length],
      textColor: "#ffffff",
    },
  }));

  function weightedRandomIndex(items: typeof prizes): number {
    const totalStock = items.reduce((sum, p) => sum + p.remainingStock, 0);
    if (totalStock <= 0) return 0;
    let random = Math.random() * totalStock;
    for (let i = 0; i < items.length; i++) {
      random -= items[i].remainingStock;
      if (random <= 0) return i;
    }
    return items.length - 1;
  }

  function handleSpin() {
    if (isDrawing || mustSpin) return;

    if (prizes.length === 0) {
      setNonePrize(true);
      return;
    }
    setNonePrize(false);

    if (eligible.length === 0) {
      return;
    }

    const winnerIndex = weightedRandomIndex(prizes);
    setPrizeNumber(winnerIndex);
    onDrawStart();
    setMustSpin(true);
  }

  function handleStopSpinning() {
    setMustSpin(false);
    const prize = prizes[prizeNumber];
    if (!prize) return;

    const updatedPrize = decrementPrizeStock(prize.id);
    if (!updatedPrize) return;

    const winnerIndex = Math.floor(Math.random() * eligible.length);
    const participant = eligible[winnerIndex];

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

  return (
    <div className="draw-stage">
      {prizes.length === 0 ? (
        <div className="draw-display">
          <span className="draw-placeholder">
            {nonePrize
              ? "Tidak ada hadiah tersedia untuk diundi."
              : "Tekan tombol untuk mulai undian"}
          </span>
        </div>
      ) : (
        <div className="wheel-wrap">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={wheelData}
            onStopSpinning={handleStopSpinning}
            backgroundColors={wheelData.map((d) => (d.style?.backgroundColor as string) || "#ff6b35")}
            textColors={["#ffffff"]}
            outerBorderColor="#1a1a2e"
            outerBorderWidth={4}
            radiusLineColor="#ffffff"
            radiusLineWidth={1}
            fontSize={14}
            spinDuration={0.6}
          />
        </div>
      )}
      <button className="btn btn-primary btn-lg" onClick={handleSpin} disabled={isDrawing || mustSpin || prizes.length === 0 || eligible.length === 0}>
        {mustSpin ? "Memutar..." : "🎡 Putar Wheel"}
      </button>
    </div>
  );
}
