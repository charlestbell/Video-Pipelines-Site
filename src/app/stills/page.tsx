"use client";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface ImageFile {
  id: string;
  name: string;
  webContentLink: string;
}

const getImageUrl = (id: string) => {
  return `/api/image/${id}`;
};

export default function Stills() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [mainViewportRef, emblaMainApi] = useEmblaCarousel({
    skipSnaps: false,
  });
  const [thumbViewportRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    axis: "x",
  });

  useEffect(() => {
    console.log("HIT");
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/images");
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();
        console.log("DATA", data);
        setImages(data.images);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    emblaMainApi.on("select", onSelect);
    return () => {
      emblaMainApi.off("select", onSelect) || false;
    };
  }, [emblaMainApi, onSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!emblaMainApi) return;
      if (e.key === "ArrowLeft") emblaMainApi.scrollPrev();
      if (e.key === "ArrowRight") emblaMainApi.scrollNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emblaMainApi]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-4 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 px-4 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-32 pb-16 px-4 max-w-7xl mx-auto"
    >
      <div className="relative mb-8">
        {/* Main Carousel */}
        <div className="overflow-hidden" ref={mainViewportRef}>
          <div className="flex">
            {images.map((image) => (
              <div key={image.id} className="relative flex-[0_0_100%]">
                <div className="relative flex items-center justify-center h-[70vh]">
                  <img
                    src={getImageUrl(image.id)}
                    alt={image.name}
                    className="max-h-full max-w-full h-auto w-auto object-contain"
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Failed to load image: ${image.name}`);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() => emblaMainApi?.scrollPrev()}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => emblaMainApi?.scrollNext()}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>

        {/* Thumbnails */}
        <div className="mt-4 overflow-hidden" ref={thumbViewportRef}>
          <div className="flex gap-2 cursor-grab active:cursor-grabbing">
            {images.map((image, index) => {
              console.log(
                "IMAGE",
                image.name,
                `https://lh3.googleusercontent.com/d/${image.id}=w300?authuser=0`
              );
              return (
                <motion.div
                  key={image.id}
                  onClick={() => onThumbClick(index)}
                  className={`relative flex-[0_0_100px] h-[60px] ${
                    index === selectedIndex ? "ring-2 ring-white" : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={getImageUrl(image.id)}
                    alt={`Thumbnail ${image.name}`}
                    className="w-full h-full object-cover rounded"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      console.error(`Failed to load thumbnail: ${image.name}`);
                      target.src = "/placeholder-image.jpg"; // You might want to add a placeholder image
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
