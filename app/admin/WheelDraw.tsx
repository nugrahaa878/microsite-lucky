"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Participant } from "../lib/participants";

const Wheel = dynamic(() => import("react-custom-roulette").then((mod) => mod.Wheel), {
  ssr: false,
});

const WHEEL_COLORS = ["#ff6b35", "#1a1a2e", "#e8531f", "#2d2d55"];

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0];
}

export default function WheelDraw({
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
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [noneEligible, setNoneEligible] = useState(false);

  const wheelData = eligible.map((p, idx) => ({
    option: firstName(p.name),
    style: {
      backgroundColor: WHEEL_COLORS[idx % WHEEL_COLORS.length],
      textColor: "#ffffff",
    },
  }));

  function handleSpin() {
    if (isDrawing || mustSpin) return;

    if (eligible.length === 0) {
      setNoneEligible(true);
      return;
    }
    setNoneEligible(false);

    const winnerIndex = Math.floor(Math.random() * eligible.length);
    setPrizeNumber(winnerIndex);
    onDrawStart();
    setMustSpin(true);
  }

  function handleStopSpinning() {
    setMustSpin(false);
    onWinner(eligible[prizeNumber]);
  }

  return (
    <div className="draw-stage">
      {eligible.length === 0 ? (
        <div className="draw-display">
          <span className="draw-placeholder">
            {noneEligible
              ? "Tidak ada peserta yang memenuhi syarat untuk diundi."
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
            backgroundColors={WHEEL_COLORS}
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
      <button className="btn btn-primary btn-lg" onClick={handleSpin} disabled={isDrawing || mustSpin}>
        {mustSpin ? "Memutar..." : "🎡 Putar Wheel"}
      </button>
    </div>
  );
}
