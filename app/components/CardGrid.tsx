import Image from "next/image";
import Link from "next/link";

type CardItem = {
  slug: string;
  emoji: string;
  desc: string;
  image: string;
  [key: string]: unknown;
};

export default function CardGrid({
  items,
  titleKey,
  basePath,
}: {
  items: CardItem[];
  titleKey: string;
  basePath: string;
}) {
  return (
    <div className="grid grid-3">
      {items.map((item) => {
        const title = String(item[titleKey]);
        return (
          <Link href={`${basePath}/${item.slug}`} className="card card-link" key={item.slug}>
            <div className="card-image-wrap">
              <Image
                src={item.image}
                alt={title}
                fill
                sizes="(max-width: 860px) 100vw, 33vw"
                className="card-image"
              />
              <span className="card-emoji-badge">{item.emoji}</span>
            </div>
            <div className="card-body">
              <h3>{title}</h3>
              <p>{item.desc}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
