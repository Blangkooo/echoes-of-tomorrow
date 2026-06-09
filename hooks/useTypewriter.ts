"use client";

import { useState, useEffect, useCallback } from "react";

export function useTypewriter(text: string, speed = 30, startDelay = 0) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const reset = useCallback(() => {
    setDisplayText("");
    setIsComplete(false);
    setIsStarted(false);
  }, []);

  useEffect(() => {
    if (!text) return;

    setDisplayText("");
    setIsComplete(false);
    setIsStarted(false);

    const startTimer = setTimeout(() => {
      setIsStarted(true);
      let index = 0;
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          setIsComplete(true);
          clearInterval(timer);
        }
      }, speed);
      return () => clearInterval(timer);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [text, speed, startDelay]);

  return { displayText, isComplete, isStarted, reset };
}
