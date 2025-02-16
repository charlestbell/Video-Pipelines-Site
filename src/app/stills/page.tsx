"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, useEffect } from "react";
import { getImageUrl } from "../../utils/getImageUrl";
import { ImageType } from "../../types/ImageType";

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

  const [thumbnailRef] = useKeenSlider({
    initial: 0,
    slides: {
      perView: 6,
      spacing: 10,
    },
  });

  const handleThumbnailClick = (idx: number) => {
    instanceRef.current?.moveToIdx(idx);
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
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!images.length) return <div>No images available</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div ref={sliderRef} className="keen-slider h-[80vh] bg-black">
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
            className="keen-slider__slide h-[60px] cursor-pointer"
          >
            <img
              src={getImageUrl(image.id, true)}
              alt={image.name}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stills;
