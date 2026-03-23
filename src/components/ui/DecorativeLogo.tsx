"use client";

import Image from "next/image";

interface DecorativeLogoProps {
  /** Size in px */
  size?: number;
  /** Extra classes for positioning */
  className?: string;
  /** Opacity from 0 to 1 */
  opacity?: number;
  /** Enable slow spin */
  spin?: boolean;
  /** Enable floating */
  float?: boolean;
  /** Enable pulse glow */
  pulse?: boolean;
}

export default function DecorativeLogo({
  size = 80,
  className = "",
  opacity = 0.07,
  spin = false,
  float = false,
  pulse = false,
}: DecorativeLogoProps) {
  const animations = [
    spin && "logo-spin-slow",
    float && "logo-float",
    pulse && "logo-pulse-bg",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`pointer-events-none select-none ${animations} ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <Image
        src="/imagens/logos/logo.png"
        alt=""
        width={size}
        height={size}
        className="object-contain"
        style={{
          width: size,
          height: size,
          filter: `drop-shadow(0 0 ${size / 4}px rgba(212,175,55,0.3))`,
        }}
      />
    </div>
  );
}
