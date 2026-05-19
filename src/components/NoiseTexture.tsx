"use client"

import { useId, type ComponentProps } from "react"

export interface NoiseTextureProps extends ComponentProps<"svg"> {
  frequency?: number
  octaves?: number
  slope?: number
  noiseOpacity?: number
}

export function NoiseTexture({
  className,
  frequency = 0.4,
  octaves = 6,
  slope = 0.15,
  noiseOpacity = 0.6,
  ...props
}: NoiseTextureProps) {
  const filterId = useId()

  return (
    <svg
      className={[
        "pointer-events-none absolute inset-0 z-0 size-full select-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={frequency}
          numOctaves={octaves}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="linear" slope={slope} />
          <feFuncG type="linear" slope={slope} />
          <feFuncB type="linear" slope={slope} />
        </feComponentTransfer>
      </filter>
      <rect
        width="100%"
        height="100%"
        filter={`url(#${filterId})`}
        opacity={noiseOpacity}
      />
    </svg>
  )
}
