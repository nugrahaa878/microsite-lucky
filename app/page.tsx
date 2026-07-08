import CardGrid from "./components/CardGrid";
import Countdown from "./components/Countdown";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import RegisterSection from "./components/RegisterSection";
import { EVENT_DATE, FAQS, PRODUCTS, RECIPES, TERMS } from "./data";

export default function Home() {
  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="logo">✦ Sasa</div>
          <nav>
            <a href="#product">Product</a>
            <a href="#recipes">Recipes</a>
            <a href="#faq">FAQ</a>
            <a href="#register">Daftar Lucky Draw</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">Special Event · Juli 2026</p>
          <h1>Kenali Produk Kami, Coba Resepnya, Menangkan Hadiahnyaa</h1>
          <p className="hero-sub">
            Jelajahi product knowledge, temukan resep favorit, dan daftarkan dirimu untuk
            kesempatan memenangkan lucky draw.
          </p>
          <a href="#register" className="btn btn-primary">
            Daftar Sekarang
          </a>
        </div>
      </section>

      <section id="product" className="section">
        <div className="container">
          <h2 className="section-title">Product Knowledge</h2>
          <p className="section-sub">Yuk kenalan lebih dekat dengan produk-produk unggulan kami.</p>
          <CardGrid items={PRODUCTS} titleKey="name" basePath="/product" />
        </div>
      </section>

      <section id="recipes" className="section section-alt">
        <div className="container">
          <h2 className="section-title">Recipes</h2>
          <p className="section-sub">Ide olahan simpel yang bisa kamu coba di rumah.</p>
          <CardGrid items={RECIPES} titleKey="title" basePath="/recipe" />
        </div>
      </section>

      <Countdown targetDate={EVENT_DATE} />

      <section id="faq" className="section">
        <div className="container">
          <h2 className="section-title center">Pertanyaan Umum</h2>
          <p className="section-sub center">Hal-hal yang sering ditanyakan seputar lucky draw ini.</p>
          <Faq items={FAQS} />
        </div>
      </section>

      <section id="terms" className="section section-alt">
        <div className="container">
          <h2 className="section-title center">Syarat &amp; Ketentuan</h2>
          <p className="section-sub center">Ketentuan resmi keikutsertaan lucky draw.</p>
          <ol className="terms-list">
            {TERMS.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ol>
        </div>
      </section>

      <RegisterSection />

      <Footer />
    </>
  );
}
