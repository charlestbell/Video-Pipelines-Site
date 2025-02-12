"use client";
import { motion } from "framer-motion";

const content = [
  {
    title: "my video",
    description: "my description",
    url: `<iframe src="https://drive.google.com/file/d/17yySkKi9AcX9Wa6esURGzQNrJzy8urX0/preview" width="640" height="480" allow="autoplay"></iframe>`,
  },
  {
    title: "my video 2",
    description: "my description 2",
    url: `<iframe src="https://drive.google.com/file/d/17z3j6dK2ZfbzyFZMjAewQAn7hJ1_oOoG/preview" width="640" height="480" allow="autoplay"></iframe>`,
  },

  {
    title: "my video 3",
    description: "my description 3",
    url: `https://www.youtube.com/watch?v=pXJ7gD09ujM`,
  },
];

const VideoCard = ({
  item,
  index,
}: {
  item: (typeof content)[0];
  index: number;
}) => {
  // Convert YouTube URLs to embed URLs
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1];
      return `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>`;
    }
    // Modify Google Drive embed code to be responsive and allow fullscreen
    if (url.includes("drive.google.com")) {
      return url.replace(
        'width="640" height="480" allow="autoplay"',
        'style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" allow="autoplay" allowfullscreen'
      );
    }
    return url;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="w-full max-w-4xl bg-[#282C30] rounded-lg overflow-hidden shadow-lg mb-12"
    >
      <div className="relative w-full pt-[56.25%]">
        {" "}
        {/* 16:9 aspect ratio */}
        <div
          className="absolute top-0 left-0 w-full h-full"
          dangerouslySetInnerHTML={{ __html: getEmbedUrl(item.url) }}
        />
      </div>
      <div className="p-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
          className="text-2xl font-bold text-gray-100 mb-2"
        >
          {item.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
          className="text-gray-300"
        >
          {item.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen pt-32 pb-16 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {content.map((item, index) => (
          <VideoCard key={index} item={item} index={index} />
        ))}
      </motion.div>
    </div>
  );
}
