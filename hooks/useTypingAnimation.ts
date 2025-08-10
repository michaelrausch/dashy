"use client";

import { useState, useEffect } from 'react';

interface TypingAnimationOptions {
  strings: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetweenStrings?: number;
  loop?: boolean;
}

export const useTypingAnimation = ({
  strings,
  typeSpeed = 100,
  deleteSpeed = 50,
  delayBetweenStrings = 2000,
  loop = true
}: TypingAnimationOptions) => {
  const [currentText, setCurrentText] = useState('');
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (strings.length === 0) return;

    const currentString = strings[currentStringIndex];
    
    if (isWaiting) {
      const waitTimer = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, delayBetweenStrings);
      
      return () => clearTimeout(waitTimer);
    }

    if (isDeleting) {
      if (currentText.length === 0) {
        setIsDeleting(false);
        setCurrentStringIndex((prev) => {
          const nextIndex = prev + 1;
          return loop && nextIndex >= strings.length ? 0 : nextIndex;
        });
        return;
      }

      const deleteTimer = setTimeout(() => {
        setCurrentText(currentString.substring(0, currentText.length - 1));
      }, deleteSpeed);

      return () => clearTimeout(deleteTimer);
    } else {
      if (currentText === currentString) {
        if (loop || currentStringIndex < strings.length - 1) {
          setIsWaiting(true);
        }
        return;
      }

      const typeTimer = setTimeout(() => {
        setCurrentText(currentString.substring(0, currentText.length + 1));
      }, typeSpeed);

      return () => clearTimeout(typeTimer);
    }
  }, [currentText, currentStringIndex, isDeleting, isWaiting, strings, typeSpeed, deleteSpeed, delayBetweenStrings, loop]);

  return {
    displayText: currentText + (currentText.length > 0 ? '|' : ''),
    isDeleting,
    currentStringIndex
  };
};