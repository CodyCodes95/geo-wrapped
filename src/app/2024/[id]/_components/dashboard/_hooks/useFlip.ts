import { useState } from "react";

export const useFlip = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flip = () => setIsFlipped(!isFlipped);
  return { isFlipped, flip };
};
