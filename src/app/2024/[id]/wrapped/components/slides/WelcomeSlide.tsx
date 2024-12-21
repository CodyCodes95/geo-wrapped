import { motion } from "framer-motion";

export const WelcomeSlide = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex min-h-screen flex-col items-center justify-center bg-[#191414] text-center"
  >
    <h1 className="bg-gradient-to-r from-[#1DB954] to-[#169c46] bg-clip-text text-6xl font-bold text-transparent">
      Your 2023 in Music
    </h1>
    <div className="mt-4 text-xl text-green-400">
      {/* Let's explore your musical journey */}
    </div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-12 text-gray-400"
    >
      Press Space to begin
    </motion.div>
  </motion.div>
);
