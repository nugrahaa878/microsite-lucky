import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">✦ Sasa</div>
            <p className="footer-tagline">
              Melezatkan setiap masakanmu sejak dulu. Ikuti event ini untuk kenali produk,
              coba resepnya, dan menangkan hadiahnya.
            </p>
          </div>

          <div className="footer-col">
            <h4>Jelajahi</h4>
            <ul>
              <li><a href="#product">Product Knowledge</a></li>
              <li><a href="#recipes">Recipes</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#terms">Syarat &amp; Ketentuan</a></li>
              <li><a href="#register">Daftar Lucky Draw</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Kontak</h4>
            <address>
              <span>WhatsApp: 0812-3456-7890</span>
              <span>Email: cs@sasa.co.id</span>
              <span>Jam Layanan: Senin–Jumat, 09.00–17.00 WIB</span>
            </address>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Sasa Event Microsite — Demo build (dummy data, tanpa database).</p>
          <Link href="/admin">Admin Dashboard →</Link>
        </div>
      </div>
    </footer>
  );
}
