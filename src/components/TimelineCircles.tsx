"use client";

import { useEffect, useRef } from "react";

interface TimelineCirclesProps {
  isVisible: boolean;
}

export default function TimelineCircles({ isVisible }: TimelineCirclesProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const circle2Ref = useRef<SVGCircleElement>(null);
  const circle3Ref = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // FIX #3: Initial setup with SHORT dash segment for traveling bolt
    // 42px visible segment + huge gap = traveling bolt around the ring
    const dashSegment = "42 999";
    const circumference = 2 * Math.PI * 24; // ≈ 150.8px

    [circle2Ref.current, circle3Ref.current].forEach((circle) => {
      if (circle) {
        circle.style.strokeDasharray = dashSegment;
        circle.style.strokeDashoffset = `${circumference}`;
      }
    });
  }, []);

  useEffect(() => {
    // FIX #4: Re-read vars when isVisible becomes true (NOT on mount!)
    // Vars are set by geometry measurement after scroll visibility
    if (!isVisible || !svgRef.current) return;

    // Double rAF to guarantee vars exist and geometry is stable
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!svgRef.current) return;

        // FIXED: Read from track wrapper (where vars are set) using data attribute
        const varOwner = svgRef.current.closest('[data-timeline-track="true"]');
        if (!varOwner) return;

        const computedStyle = getComputedStyle(varOwner);

        // Get computed cx/cy values (set by TimelineProcess measurement)
        const cx2 = computedStyle.getPropertyValue('--timeline-cx-2').trim();
        const cy2 = computedStyle.getPropertyValue('--timeline-cy-2').trim();
        const cx3 = computedStyle.getPropertyValue('--timeline-cx-3').trim();
        const cy3 = computedStyle.getPropertyValue('--timeline-cy-3').trim();

        // Debug logging (remove after testing)
        console.log('TimelineCircles - CSS vars:', { cx2, cy2, cx3, cy3 });

        if (circle2Ref.current && cx2 && cy2) {
          circle2Ref.current.setAttribute('cx', cx2);
          circle2Ref.current.setAttribute('cy', cy2);
        }

        if (circle3Ref.current && cx3 && cy3) {
          circle3Ref.current.setAttribute('cx', cx3);
          circle3Ref.current.setAttribute('cy', cy3);
        }
      });
    });
  }, [isVisible]);

  return (
    <svg
      ref={svgRef}
      className="timeline-circles"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible'
      }}
    >
      <defs>
        {/* Gradient for circle energy - using currentColor + opacity */}
        <linearGradient id="circleEnergyGradient">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.7" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Energy layer - animated when scan hits */}
      <g className="circles-energy">
        {/* Circle 2 energy loop */}
        <circle
          ref={circle2Ref}
          className="circle-energy circle-energy--2"
          cx="0"
          cy="0"
          r="24"
          fill="none"
          stroke="red"  /* TEMPORARY DEBUG - revert to url(#circleEnergyGradient) after testing */
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ opacity: 1 }}  /* TEMPORARY DEBUG - remove after testing */
        />

        {/* Circle 3 energy loop */}
        <circle
          ref={circle3Ref}
          className="circle-energy circle-energy--3"
          cx="0"
          cy="0"
          r="24"
          fill="none"
          stroke="lime"  /* TEMPORARY DEBUG - revert to url(#circleEnergyGradient) after testing */
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ opacity: 1 }}  /* TEMPORARY DEBUG - remove after testing */
        />
      </g>
    </svg>
  );
}
