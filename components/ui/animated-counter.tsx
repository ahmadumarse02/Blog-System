"use client";

import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  delay?: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, delay = 0, duration = 1000, className = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log('AnimatedCounter: Starting animation for value:', value);
    
    const timer = setTimeout(() => {
      setIsVisible(true);
      let start = 0;
      const increment = value / (duration / 50);
      
      const counter = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(counter);
          console.log('AnimatedCounter: Animation complete');
        } else {
          setCount(Math.floor(start));
        }
      }, 50);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, duration]);

  return (
    <span 
      className={`inline-block ${isVisible ? 'animate-counter-up' : 'opacity-0'} ${className}`}
    >
      {count}
    </span>
  );
}