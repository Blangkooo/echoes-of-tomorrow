"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const stars: Star[] = [];
    const NUM_STARS = 180;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < NUM_STARS; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        twinkleSpeed: Math.random() * 0.01 + 0.003,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // Constellation connections (a few random pairs)
    const connections: [number, number][] = [];
    for (let i = 0; i < 12; i++) {
      const a = Math.floor(Math.random() * NUM_STARS);
      const b = Math.floor(Math.random() * NUM_STARS);
      const dx = stars[a].x - stars[b].x;
      const dy = stars[a].y - stars[b].y;
      if (Math.sqrt(dx * dx + dy * dy) < 200) {
        connections.push([a, b]);
      }
    }

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw constellation lines
      connections.forEach(([a, b]) => {
        const starA = stars[a];
        const starB = stars[b];
        const opA = starA.opacity * (0.5 + 0.5 * Math.sin(time * starA.twinkleSpeed * 100 + starA.twinkleOffset));
        const opB = starB.opacity * (0.5 + 0.5 * Math.sin(time * starB.twinkleSpeed * 100 + starB.twinkleOffset));
        const lineOp = Math.min(opA, opB) * 0.2;

        ctx.beginPath();
        ctx.moveTo(starA.x, starA.y);
        ctx.lineTo(starB.x, starB.y);
        ctx.strokeStyle = `rgba(250, 204, 21, ${lineOp})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Draw stars
      stars.forEach((star) => {
        const twinkle = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed * 100 + star.twinkleOffset);
        const opacity = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();

        // Gold tint for a few stars
        if (star.opacity > 0.4) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(250, 204, 21, ${opacity * 0.15})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="starfield"
      style={{ background: "#0A0A0A" }}
    />
  );
}
