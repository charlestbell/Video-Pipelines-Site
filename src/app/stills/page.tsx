"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, useEffect } from "react";
import { getImageUrl } from "../../utils/getImageUrl";
import { ImageType } from "../../types/ImageType";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Stills = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const [thumbnailRef, thumbnailInstanceRef] = useKeenSlider({
    initial: 0,
    slides: {
      perView: 6,
      spacing: 10,
    },
  });

  const handleThumbnailClick = (idx: number) => {
    instanceRef.current?.moveToIdx(idx);
    thumbnailInstanceRef.current?.moveToIdx(idx);
  };

  const handlePrevClick = () => {
    if (currentSlide > 0) {
      instanceRef.current?.prev();
      thumbnailInstanceRef.current?.prev();
    }
  };

  const handleNextClick = () => {
    if (currentSlide < images.length - 1) {
      instanceRef.current?.next();
      thumbnailInstanceRef.current?.next();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      handlePrevClick();
    } else if (event.key === "ArrowRight") {
      handleNextClick();
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/images");
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();
        if (data.images && Array.isArray(data.images)) {
          setImages(data.images);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!images.length) return <div>No images available</div>;

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 max-w-6xl mx-auto relative">
      <div ref={sliderRef} className="keen-slider h-[80vh] bg-[#1E2124]">
        {images.map((image) => (
          <div key={image.id} className="keen-slider__slide">
            <img
              src={getImageUrl(image.id, false)}
              alt={image.name}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      <div ref={thumbnailRef} className="keen-slider mt-4">
        {images.map((image, idx) => (
          <div
            key={image.id}
            onClick={() => handleThumbnailClick(idx)}
            className="keen-slider__slide h-[120px] w-[213.33px] cursor-pointer"
          >
            <img
              src={getImageUrl(image.id, true)}
              alt={image.name}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handlePrevClick}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        onClick={handleNextClick}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Stills;
