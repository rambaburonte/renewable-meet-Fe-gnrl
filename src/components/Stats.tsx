import React, { useEffect, useRef, useState } from "react";

const stats = [
  { value: 2500, label: "EXHIBITION ATTENDEES" },
  { value: 250, label: "GLOBAL EXHIBITORS" },
  { value: 1000, label: "CONFERENCE DELEGATES" },
  { value: 500, label: "EXPERT SPEAKERS" },
  { value: 120, label: "CONFERENCE SESSIONS" },
  { value: 110, label: "PARTICIPATING COUNTRIES" },
];

function useOnScreen(ref: React.RefObject<HTMLElement>, rootMargin = "0px") {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, rootMargin]);
  return isIntersecting;
}

function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<number>();

  useEffect(() => {
    if (!start || hasAnimated) return;
    let current = 0;
    const step = Math.ceil(target / (duration / 16));
    function tick() {
      current += step;
      if (current >= target) {
        setCount(target);
        setHasAnimated(true);
        return;
      }
      setCount(current);
      ref.current = window.requestAnimationFrame(tick);
    }
    ref.current = window.requestAnimationFrame(tick);
    return () => {
      if (ref.current !== undefined) {
        window.cancelAnimationFrame(ref.current);
      }
    };
  }, [target, duration, start, hasAnimated]);
  return count;
}

const StatItem = ({ value, label, start }: { value: number; label: string; start: boolean }) => {
  const count = useCountUp(value, 1500, start);
  return (
    <div className="flex flex-col items-start px-6 py-8 border-l border-white/60 min-w-[180px]">
      <div className="text-3xl md:text-4xl font-bold text-white">
        {count.toLocaleString()} <span className="text-2xl font-semibold">+</span>
      </div>
      <div className="text-xs md:text-sm text-white/80 font-medium mt-2 whitespace-pre-line uppercase">
        {label}
      </div>
    </div>
  );
};

const Stats: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(sectionRef, "-100px");
  return (
    <section ref={sectionRef} className="w-full bg-gradient-to-r from-[#39737b] to-[#0ea7b5] py-8 md:py-12">
      <div className="flex flex-wrap justify-center items-stretch max-w-7xl mx-auto divide-x divide-white/60">
        {stats.map((stat, i) => (
          <StatItem key={i} value={stat.value} label={stat.label} start={isVisible} />
        ))}
      </div>
    </section>
  );
};

export default Stats;
