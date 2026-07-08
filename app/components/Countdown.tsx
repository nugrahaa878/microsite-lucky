"use client";

import { useEffect, useState } from "react";

function getTimeParts(targetIso: string) {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const ZERO_PARTS = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [parts, setParts] = useState(ZERO_PARTS);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync real time from clock on mount
    setParts(getTimeParts(targetDate));
    const intervalId = setInterval(() => {
      setParts(getTimeParts(targetDate));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [targetDate]);

  const units: [number, string][] = [
    [parts.days, "Hari"],
    [parts.hours, "Jam"],
    [parts.minutes, "Menit"],
    [parts.seconds, "Detik"],
  ];

  return (
    <div className="countdown-bar">
      <div className="container countdown-inner">
        <span className="countdown-label">Menuju Lucky Draw:</span>
        <div className="countdown-units">
          {units.map(([value, label]) => (
            <div className="countdown-unit" key={label}>
              <span className="countdown-value">{String(value).padStart(2, "0")}</span>
              <span className="countdown-unit-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
