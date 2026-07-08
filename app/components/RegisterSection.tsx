"use client";

import { useState } from "react";
import { getParticipants, saveParticipants, normalizePhone } from "../lib/participants";

export default function RegisterSection() {
  const [submitted, setSubmitted] = useState(false);
  const [thankName, setThankName] = useState("");
  const [entryCode, setEntryCode] = useState("");
  const [formError, setFormError] = useState("");
  const [fullName, setFullName] = useState("");
  const [waNumber, setWaNumber] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const name = fullName.trim();
    const wa = normalizePhone(waNumber.trim());

    if (!name || !wa) {
      setFormError("Nama dan nomor WhatsApp wajib diisi.");
      return;
    }

    if (!/^\d{8,15}$/.test(wa)) {
      setFormError("Format nomor WhatsApp tidak valid.");
      return;
    }

    const participants = getParticipants();
    const isDuplicate = participants.some((p) => p.whatsapp === wa);

    if (isDuplicate) {
      setFormError("Nomor WhatsApp ini sudah terdaftar. Satu nomor hanya bisa daftar sekali.");
      return;
    }

    const entry = {
      id: "P" + String(participants.length + 1).padStart(4, "0"),
      name,
      whatsapp: wa,
      registeredAt: new Date().toISOString(),
      hasWon: false,
    };

    participants.push(entry);
    saveParticipants(participants);

    setThankName(entry.name);
    setEntryCode(entry.id);
    setSubmitted(true);
    setFullName("");
    setWaNumber("");
  }

  function handleRegisterAnother() {
    setSubmitted(false);
    setFormError("");
  }

  return (
    <section id="register" className="section">
      <div className="container register-wrap">
        {!submitted ? (
          <div id="registerForm">
            <h2 className="section-title center">Daftar Lucky Draw</h2>
            <p className="section-sub center">
              Cukup isi nama dan nomor WhatsApp kamu. Satu nomor hanya bisa daftar satu kali.
            </p>

            <form className="form-card" noValidate onSubmit={handleSubmit}>
              <label>
                Nama Lengkap
                <input
                  type="text"
                  placeholder="cth. Ari Nugraha"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </label>
              <label>
                Nomor WhatsApp
                <input
                  type="tel"
                  placeholder="cth. 081234567890"
                  required
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                />
              </label>
              <p className="form-error">{formError}</p>
              <button type="submit" className="btn btn-primary btn-block">
                Daftar Sekarang
              </button>
            </form>
          </div>
        ) : (
          <div className="thank-you">
            <div className="thank-icon">✓</div>
            <h2>Pendaftaran Berhasil!</h2>
            <p>
              Terima kasih, <strong>{thankName}</strong>. Nomor undianmu:
            </p>
            <div className="entry-code">{entryCode}</div>
            <p className="muted">
              Simpan nomor ini. Pemenang akan diumumkan langsung di layar saat acara berlangsung.
            </p>
            <button className="btn btn-outline" onClick={handleRegisterAnother}>
              Daftar Nomor Lain
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
