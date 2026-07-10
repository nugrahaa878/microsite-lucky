import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../components/Footer";
import { PRODUCTS } from "../../data";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <Link href="/" className="logo">
            <Image src="https://www.sasa.co.id/themes/v1/assets/img/logo_white.png" alt="Sasa" width={90} height={28} className="logo-img" />
          </Link>
          <nav>
            <Link href="/#product">Product</Link>
            <Link href="/#recipes">Recipes</Link>
            <Link href="/#faq">FAQ</Link>
            <Link href="/#register">Daftar Lucky Draw</Link>
          </nav>
        </div>
      </header>

      <section className="section detail-section">
        <div className="container">
          <Link href="/#product" className="back-link">← Kembali ke Product Knowledge</Link>

          <div className="detail-grid">
            <div className="detail-image-wrap">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 860px) 100vw, 50vw"
                className="detail-image"
              />
              <span className="card-emoji-badge">{product.emoji}</span>
            </div>

            <div className="detail-body">
              <h1>{product.name}</h1>
              <p className="detail-lead">{product.longDesc}</p>

              <h3>Keunggulan</h3>
              <ul className="detail-highlights">
                {product.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>

              <h3>Spesifikasi</h3>
              <dl className="detail-specs">
                {product.specs.map((s) => (
                  <div className="detail-spec-row" key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>

              <Link href="/#register" className="btn btn-primary">
                Daftar Lucky Draw
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
