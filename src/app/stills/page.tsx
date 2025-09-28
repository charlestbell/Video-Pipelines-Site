'use client'

import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { useState, useEffect, useRef, useCallback } from 'react'
import { getImageUrl } from '../../utils/getImageUrl'
import { ImageType } from '../../types/ImageType'
import { motion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

const Stills = () => {
  const [images, setImages] = useState<ImageType[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const zoomRef = useRef(null)

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
  })

  const [thumbnailRef, thumbnailInstanceRef] = useKeenSlider({
    initial: 0,
    slides: {
      perView: 6,
      spacing: 10,
    },
  })

  const handleThumbnailClick = useCallback((idx: number) => {
    instanceRef.current?.moveToIdx(idx)
    thumbnailInstanceRef.current?.moveToIdx(idx)
  }, [])

  const handlePrevClick = useCallback(() => {
    if (
      currentSlide > 0 &&
      instanceRef.current &&
      thumbnailInstanceRef.current
    ) {
      instanceRef.current.prev()
      thumbnailInstanceRef.current.prev()
    }
  }, [currentSlide])

  const handleNextClick = useCallback(() => {
    if (
      instanceRef.current &&
      thumbnailInstanceRef.current &&
      images.length > 0
    ) {
      const lastIndex = images.length - 1
      if (currentSlide < lastIndex) {
        instanceRef.current.next()
        thumbnailInstanceRef.current.next()
      }
    }
  }, [currentSlide, images.length])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrevClick()
      } else if (event.key === 'ArrowRight') {
        handleNextClick()
      }
    },
    [handlePrevClick, handleNextClick]
  )

  const openLightbox = () => {
    setIsLightboxOpen(true)
  }

  // Load images from the generated images.json file
  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch('/images.json')
        if (response.ok) {
          const data = await response.json()
          if (data.images && Array.isArray(data.images)) {
            // Convert the data to match our ImageType interface
            const loadedImages: ImageType[] = data.images.map((img: any) => ({
              id: img.id,
              name: img.name,
              webContentLink: '', // Not needed for local images
              thumbnailLink: '', // Not needed for local images
            }))

            setImages(loadedImages)
          }
        }
      } catch (error) {
        console.error('Error loading images:', error)
      }
    }

    loadImages()
  }, [])

  // Separate useEffect for keyboard events
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, handlePrevClick, handleNextClick])

  if (!images.length) return <div>No images available</div>

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 max-w-5xl mx-auto relative">
      <div
        ref={sliderRef}
        className="keen-slider h-[70vh] bg-[#1E2124] cursor-pointer"
        onClick={openLightbox}
      >
        {images.map(image => (
          <div key={image.id} className="keen-slider__slide">
            <img
              src={getImageUrl(image.id, false)}
              alt={image.name}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Lightbox component */}
      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={images.map(image => ({ src: getImageUrl(image.id, false) }))}
        index={currentSlide}
        plugins={[Zoom]}
        zoom={{ ref: zoomRef }}
        carousel={{ finite: true }}
        on={{
          view: ({ index }) => {
            if (index !== currentSlide) {
              setCurrentSlide(index)
              instanceRef.current?.moveToIdx(index)
              thumbnailInstanceRef.current?.moveToIdx(index)
            }
          },
        }}
      />

      <div ref={thumbnailRef} className="keen-slider mt-4 p-4">
        {images.map((image, idx) => (
          <motion.div
            key={image.id}
            className="keen-slider__slide h-[120px] w-[213.33px] m-[2px]"
            animate={{
              filter:
                idx === currentSlide
                  ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))'
                  : 'drop-shadow(0 0 0 transparent)',
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <motion.div
              onClick={() => handleThumbnailClick(idx)}
              className="h-full w-full cursor-pointer overflow-hidden rounded"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={getImageUrl(image.id, true)}
                alt={image.name}
                className="h-full w-full object-cover rounded"
              />
            </motion.div>
          </motion.div>
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
  )
}

export default Stills
