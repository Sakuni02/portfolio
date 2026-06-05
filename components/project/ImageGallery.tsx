"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    i: number
  ) => {
    const el = containerRefs.current[i];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {images.map((src, i) => (
          <div
            key={src}
            ref={(el) => {
              containerRefs.current[i] = el;
            }}
            className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden"
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => setZoomPos(null)}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
          >
            <Image
              src={src}
              alt={`${title} ${i + 1}`}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {zoomPos && (
              <div
                className="pointer-events-none absolute hidden h-32 w-32 rounded-full border-2 border-sepia/50 md:block"
                style={{
                  left: `${zoomPos.x}%`,
                  top: `${zoomPos.y}%`,
                  transform: "translate(-50%, -50%)",
                  backgroundImage: `url(${src})`,
                  backgroundSize: "300%",
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((src) => ({ src }))}
        plugins={[Zoom]}
      />
    </>
  );
}
