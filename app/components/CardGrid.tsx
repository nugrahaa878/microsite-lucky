import Image from "next/image";

type CardItem = {
  emoji: string;
  desc: string;
  image: string;
  [key: string]: string;
};

export default function CardGrid({
  items,
  titleKey,
}: {
  items: CardItem[];
  titleKey: string;
}) {
  return (
    <div className="grid grid-3">
      {items.map((item, idx) => (
        <div className="card" key={idx}>
          <div className="card-image-wrap">
            <Image
              src={item.image}
              alt={item[titleKey]}
              fill
              sizes="(max-width: 860px) 100vw, 33vw"
              className="card-image"
            />
            <span className="card-emoji-badge">{item.emoji}</span>
          </div>
          <div className="card-body">
            <h3>{item[titleKey]}</h3>
            <p>{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
