"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const CX = 50, CY = 50;
const SUN_R = 15;
const INNER_RADIUS = 28, INNER_R = 4.6;
const OUTER_RADIUS = 42;
const MAX_DRAG_UNITS = 8;

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

const INNER = Array.from({ length: 8 }, (_, i) => {
  const a = (i * 45 * Math.PI) / 180;
  return { id: `i${i}`, angleDeg: i * 45, cx: round(CX + INNER_RADIUS * Math.sin(a)), cy: round(CY - INNER_RADIUS * Math.cos(a)), r: i % 2 === 0 ? INNER_R : round(INNER_R * 0.85) };
});
const OUTER = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180;
  return { id: `o${i}`, angleDeg: i * 30, cx: round(CX + OUTER_RADIUS * Math.sin(a)), cy: round(CY - OUTER_RADIUS * Math.cos(a)), r: i % 2 === 0 ? 3.4 : 2.6 };
});

function readRotationDeg(el: SVGElement | null) {
  if (!el) return 0;
  const t = getComputedStyle(el).transform;
  if (!t || t === "none") return 0;
  const m3d = t.match(/matrix3d\(([^)]+)\)/);
  if (m3d) {
    const v = m3d[1].split(",").map(Number);
    return (Math.atan2(v[1], v[0]) * 180) / Math.PI;
  }
  const m = t.match(/matrix\(([^)]+)\)/);
  if (!m) return 0;
  const [a, b] = m[1].split(",").map(Number);
  return (Math.atan2(b, a) * 180) / Math.PI;
}

function Planet({
  dot,
  groupRef,
  scaleRef,
  setPaused,
}: {
  dot: { id: string; angleDeg: number; cx: number; cy: number; r: number };
  groupRef: React.RefObject<SVGGElement | null>;
  scaleRef: React.RefObject<number | null>;
  setPaused: (v: boolean) => void;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const startRef = useRef({ x: 0, y: 0, totalAngle: 0 });
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPaused(true);
    const totalAngle = readRotationDeg(groupRef.current) + dot.angleDeg;
    startRef.current = { x: e.clientX, y: e.clientY, totalAngle };
    setDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const scale = scaleRef.current || 1;
    const dx = (e.clientX - startRef.current.x) / scale;
    const dy = (e.clientY - startRef.current.y) / scale;
    const rad = (-startRef.current.totalAngle * Math.PI) / 180;
    let lx = dx * Math.cos(rad) - dy * Math.sin(rad);
    let ly = dx * Math.sin(rad) + dy * Math.cos(rad);
    const mag = Math.hypot(lx, ly);
    if (mag > MAX_DRAG_UNITS) {
      lx = (lx / mag) * MAX_DRAG_UNITS;
      ly = (ly / mag) * MAX_DRAG_UNITS;
    }
    setOffset({ x: lx, y: ly });
  };
  const endDrag = (e: React.PointerEvent) => {
    e.stopPropagation();
    setDragging(false);
    setHovered(false);
    setOffset({ x: 0, y: 0 });
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => setPaused(false), 30);
  };

  return (
    <circle
      cx={dot.cx}
      cy={dot.cy}
      r={dot.r}
      fill="currentColor"
      className="cursor-grab"
      style={{
        transformBox: "view-box",
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${dragging ? 1.35 : hovered ? 1.15 : 1})`,
        transformOrigin: `${dot.cx}px ${dot.cy}px`,
        transition: dragging ? "transform 0.12s ease" : "transform 0.4s cubic-bezier(0.2,0.8,0.2,1)",
        touchAction: "none",
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    />
  );
}

export function AhviLogo({ size = 38, className = "text-ink" }: { size?: number; className?: string }) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [innerPaused, setInnerPaused] = useState(false);
  const [outerPaused, setOuterPaused] = useState(false);
  const innerRef = useRef<SVGGElement | null>(null);
  const outerRef = useRef<SVGGElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const scaleRef = useRef<number>(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const animate = mounted && !reduce;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={"shrink-0 " + className}
      onPointerDownCapture={() => {
        scaleRef.current = (svgRef.current?.getBoundingClientRect().width ?? size) / 100;
      }}
    >
      <g
        ref={outerRef}
        style={{
          transformBox: "view-box",
          transformOrigin: "50px 50px",
          animationName: animate ? "ahvi-spin-rev" : "none",
          animationDuration: "9s",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: outerPaused ? "paused" : "running",
        }}
      >
        {OUTER.map((d) => (
          <Planet key={d.id} dot={d} groupRef={outerRef} scaleRef={scaleRef} setPaused={setOuterPaused} />
        ))}
      </g>
      <g
        ref={innerRef}
        style={{
          transformBox: "view-box",
          transformOrigin: "50px 50px",
          animationName: animate ? "ahvi-spin" : "none",
          animationDuration: "5s",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: innerPaused ? "paused" : "running",
        }}
      >
        {INNER.map((d) => (
          <Planet key={d.id} dot={d} groupRef={innerRef} scaleRef={scaleRef} setPaused={setInnerPaused} />
        ))}
      </g>
      <circle cx={CX} cy={CY} r={SUN_R} fill="currentColor" />
      <style jsx global>{`
        @keyframes ahvi-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes ahvi-spin-rev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
      `}</style>
    </svg>
  );
}
