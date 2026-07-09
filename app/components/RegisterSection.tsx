"use client";

import { useEffect, useState } from "react";
import { getParticipants, saveParticipants, normalizeNik } from "../lib/participants";

const QUOTA = 1000;

export default function RegisterSection() {
  const [submitted, setSubmitted] = useState(false);
  const [thankName, setThankName] = useState("");
  const [entryCode, setEntryCode] = useState("");
  const [formError, setFormError] = useState("");
  const [fullName, setFullName] = useState("");
  const [nik, setNik] = useState("");
  const [quotaLeft, setQuotaLeft] = useState(QUOTA);
  const [isQuotaFull, setIsQuotaFull] = useState(false);

  useEffect(() => {
    const participants = getParticipants();
    const left = Math.max(0, QUOTA - participants.length);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync initial state from localStorage on mount
    setQuotaLeft(left);
    setIsQuotaFull(left <= 0);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const name = fullName.trim();
    const normalizedNik = normalizeNik(nik.trim());

    if (!name || !normalizedNik) {
      setFormError("Nama dan NIK wajib diisi.");
      return;
    }

    if (!/^\d{10,20}$/.test(normalizedNik)) {
      setFormError("Format NIK tidak valid. Masukkan 10-20 digit angka.");
      return;
    }

    const currentParticipants = getParticipants();

    if (currentParticipants.some((p) => p.nik === normalizedNik)) {
      setFormError("NIK ini sudah terdaftar. Satu NIK hanya bisa daftar sekali.");
      return;
    }

    if (currentParticipants.length >= QUOTA) {
      setFormError("Kuota pendaftaran sudah penuh (maks 1000 peserta).");
      return;
    }

    const entry = {
      id: "P" + String(currentParticipants.length + 1).padStart(4, "0"),
      nik: normalizedNik,
      name,
      registeredAt: new Date().toISOString(),
      hasWon: false,
    };

    const updated = currentParticipants.concat(entry);
    saveParticipants(updated);

    setThankName(entry.name);
    setEntryCode(entry.id);
    setSubmitted(true);
    setFullName("");
    setNik("");
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
              {isQuotaFull
                ? "Mohon maaf, kuota pendaftaran sudah penuh."
                : `Isi NIK dan nama lengkap kamu. Sisa kuota: ${quotaLeft} dari ${QUOTA} peserta.`}
            </p>

            {!isQuotaFull && (
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
                  NIK Karyawan
                  <input
                    type="text"
                    placeholder="cth. 1234567890123456"
                    required
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                  />
                </label>
                <p className="form-error">{formError}</p>
                <button type="submit" className="btn btn-primary btn-block">
                  Daftar Sekarang
                </button>
              </form>
            )}
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
