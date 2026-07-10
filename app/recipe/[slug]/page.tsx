import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../components/Footer";
import { RECIPES } from "../../data";

export function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.slug }));
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = RECIPES.find((r) => r.slug === slug);
  if (!recipe) notFound();

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
          <Link href="/#recipes" className="back-link">← Kembali ke Recipes</Link>

          <div className="detail-grid">
            <div className="detail-image-wrap">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                sizes="(max-width: 860px) 100vw, 50vw"
                className="detail-image"
              />
              <span className="card-emoji-badge">{recipe.emoji}</span>
            </div>

            <div className="detail-body">
              <h1>{recipe.title}</h1>
              <p className="detail-lead">{recipe.desc}</p>

              <div className="recipe-meta">
                <span><strong>{recipe.duration}</strong><br />Waktu Masak</span>
                <span><strong>{recipe.servings}</strong><br />Porsi</span>
                <span><strong>{recipe.difficulty}</strong><br />Tingkat Kesulitan</span>
              </div>

              <h3>Bahan-bahan</h3>
              <ul className="detail-highlights">
                {recipe.ingredients.map((ing) => (
                  <li key={ing}>{ing}</li>
                ))}
              </ul>

              <h3>Cara Membuat</h3>
              <ol className="detail-steps">
                {recipe.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>

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
