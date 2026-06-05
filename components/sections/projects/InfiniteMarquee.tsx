import Image from "next/image";

interface InfiniteMarqueeProps {
  images: string[];
}

export function InfiniteMarquee({ images }: InfiniteMarqueeProps) {
  const row1 = [...images, ...images];
  const row2 = [...images.slice().reverse(), ...images.slice().reverse()];

  return (
    <section className="overflow-hidden border-y border-sepia/20 py-8">
      <div className="animate-ticker flex gap-4 whitespace-nowrap">
        {row1.map((src, i) => (
          <div
            key={`r1-${i}`}
            className="relative h-24 w-36 shrink-0 overflow-hidden md:h-32 md:w-48"
          >
            <Image src={src} alt="" fill className="object-cover grayscale" sizes="192px" />
          </div>
        ))}
      </div>
      <div className="animate-ticker-reverse mt-4 flex gap-4 whitespace-nowrap">
        {row2.map((src, i) => (
          <div
            key={`r2-${i}`}
            className="relative h-24 w-36 shrink-0 overflow-hidden md:h-32 md:w-48"
          >
            <Image src={src} alt="" fill className="object-cover grayscale" sizes="192px" />
          </div>
        ))}
      </div>
    </section>
  );
}
