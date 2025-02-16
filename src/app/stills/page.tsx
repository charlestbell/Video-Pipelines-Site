"use client";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface ImageFile {
  id: string;
  name: string;
  webContentLink: string;
  thumbnailLink?: string;
}

const getImageUrl = (id: string, isThumbnail?: boolean) => {
  return `/api/image/${id}${isThumbnail ? "?thumbnail=true" : ""}`;
};

export default function Stills() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [thumbnailsLoaded, setThumbnailsLoaded] = useState(false);

  const [mainViewportRef, emblaMainApi] = useEmblaCarousel({
    skipSnaps: false,
  });
  const [thumbViewportRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: false,
    dragFree: true,
    axis: "x",
    watchDrag: true,
    skipSnaps: false,
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

  useEffect(() => {
    if (images.length > 0 && !thumbnailsLoaded) {
      Promise.all(
        images.map((image) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = getImageUrl(image.id, true);
          });
        })
      )
        .then(() => {
          setThumbnailsLoaded(true);
          console.log("All thumbnails preloaded");
        })
        .catch((error) => {
          console.error("Error preloading thumbnails:", error);
        });
    }
  }, [images, thumbnailsLoaded]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    const index = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(index);

    // Force a reflow of the thumbnail carousel
    requestAnimationFrame(() => {
      emblaThumbsApi.reInit();
      emblaThumbsApi.scrollTo(index, true);
    });
  }, [emblaMainApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    emblaMainApi.on("select", onSelect);
    return () => {
      emblaMainApi.off("select", onSelect);
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

  useEffect(() => {
    const transformScroll = (event: WheelEvent) => {
      console.log("WHEEL EVENT", event);
      event.stopPropagation();
      event.preventDefault();

      const container = document.querySelector(".thumbnail-strip");
      if (container && event.deltaY) {
        container.scrollLeft += event.deltaY;
      }
    };

    const thumbContainer = document.querySelector(".thumbnail-strip");
    if (thumbContainer) {
      thumbContainer.addEventListener(
        "wheel",
        transformScroll as EventListener,
        { capture: true, passive: false }
      );
    }

    return () => {
      const thumbContainer = document.querySelector(".thumbnail-strip");
      if (thumbContainer) {
        thumbContainer.removeEventListener(
          "wheel",
          transformScroll as EventListener,
          { capture: true }
        );
      }
    };
  }, [emblaThumbsApi]);

  useEffect(() => {
    if (emblaMainApi && emblaThumbsApi) {
      emblaMainApi.on("select", () => {
        const index = emblaMainApi.selectedScrollSnap();
        setSelectedIndex(index);
        emblaThumbsApi.scrollTo(index); // Ensure thumbnails follow main image
      });
    }
  }, [emblaMainApi, emblaThumbsApi]);

  // Add this effect to handle thumbnail scrolling
  useEffect(() => {
    if (!emblaThumbsApi) return;

    const handleScroll = () => {
      requestAnimationFrame(() => {
        emblaThumbsApi.reInit();
      });
    };

    emblaThumbsApi.on("scroll", handleScroll);
    return () => {
      emblaThumbsApi.off("scroll", handleScroll);
    };
  }, [emblaThumbsApi]);

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
      className="min-h-screen pt-32 pb-16 px-4 max-w-6xl mx-auto"
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
          <div className="thumbnail-strip flex gap-2 cursor-grab active:cursor-grabbing whitespace-nowrap">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                onClick={() => onThumbClick(index)}
                className={`relative flex-[0_0_100px] h-[60px] shrink-0 ${
                  index === selectedIndex ? "ring-2 ring-white" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={getImageUrl(image.id, true)}
                  alt={`Thumbnail ${image.name}`}
                  className="w-full h-full object-cover rounded"
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                  sizes="100px"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
