"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const content = [
  {
    title: "Make It Yours",
    description: "Multi-product campaign",
    url: `<iframe src="https://drive.google.com/file/d/17yySkKi9AcX9Wa6esURGzQNrJzy8urX0/preview" width="640" height="480" allow="autoplay"></iframe>`,
  },
  {
    title: "Triple Run: Our Strongest Stuff Yet",
    description: "Product line promotion",
    url: `https://www.youtube.com/watch?v=pXJ7gD09ujM`,
  },
  {
    title: "Nomad: Adapt To The Mission",
    description: "Product promotion",
    url: `https://www.youtube.com/watch?v=jcEQmqp-iJ4`,
  },
  {
    title: "Tacoma Walkaround",
    description: "Youtube Content",
    url: "https://www.youtube.com/watch?v=2tcVrRuHBic",
  },
  {
    title: "Beginner's Guide to Shocks and Springs",
    description: "Educational Youtube Content",
    url: "https://www.youtube.com/watch?v=oyc1tt6qO94",
  },
  {
    title: "We Guide - Overland Trip VII - West Virginia",
    description: "Adventure Youtube Content",
    url: "https://www.youtube.com/watch?v=dzgcsnf8E_U",
  },
  {
    title: "YakAttack: Stop Motion Ad",
    description: "Multi-product campaign",
    url: `<iframe src="https://drive.google.com/file/d/17z3j6dK2ZfbzyFZMjAewQAn7hJ1_oOoG/preview" width="640" height="480" allow="autoplay"></iframe>`,
  },
];

const VideoCard = ({
  item,
  index,
}: {
  item: (typeof content)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1,
  });

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `<iframe 
        width="100%" 
        height="100%" 
        src="https://www.youtube.com/embed/${videoId}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen 
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 0.3s ease-in;" 
        onload="this.style.opacity = '1'; window.postMessage('iframe-${index}-loaded', '*')"
      ></iframe>`;
    }
    if (url.includes("drive.google.com")) {
      return url.replace(
        'width="640" height="480" allow="autoplay"',
        `style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 0.3s ease-in;" allow="autoplay" allowfullscreen onload="this.style.opacity = '1'; window.postMessage('iframe-${index}-loaded', '*')"`
      );
    }
    return url;
  };

  useEffect(() => {
    const handleIframeLoad = () => {
      console.log("Iframe loaded!");
      setIsLoaded(true);
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.data === `iframe-${index}-loaded`) {
        console.log("Google Drive iframe loaded!");
        setIsLoaded(true);
      }
    };

    const iframe = document.querySelector(`iframe[data-index="${index}"]`);
    iframe?.addEventListener("iframeLoaded", handleIframeLoad);
    window.addEventListener("message", handleMessage);

    return () => {
      iframe?.removeEventListener("iframeLoaded", handleIframeLoad);
      window.removeEventListener("message", handleMessage);
    };
  }, [index]);

  return (
    <div className="w-full mb-16">
      <div className="relative w-full pt-[56.25%] bg-[#1a1d1f] overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse">
            <div className="h-full w-full bg-gradient-to-r from-[#1a1d1f] via-[#282C30] to-[#1a1d1f] bg-[length:200%_100%] animate-shimmer" />
          </div>
        )}

        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -100 }}
          animate={
            isInView && isLoaded
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: -100 }
          }
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: index * 0.4,
          }}
          className="absolute top-0 left-0 w-full h-full"
        >
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{
              __html: getEmbedUrl(item.url).replace(
                "iframe",
                `iframe data-index="${index}"`
              ),
            }}
          />
        </motion.div>
      </div>
      <div className="mt-4 space-y-2">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.6, delay: index * 0.4 + 0.3 }}
          className="text-2xl font-bold text-gray-100"
        >
          {item.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.6, delay: index * 0.4 + 0.4 }}
          className="text-gray-300"
        >
          {item.description}
        </motion.p>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen pt-32 pb-16 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {content.map((item, index) => (
          <VideoCard key={item.url} item={item} index={index} />
        ))}
      </motion.div>
    </div>
  );
}
