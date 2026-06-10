import "./Bubbles.css";

const bubbles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 30 + 14,         // 14–44 px — clearly visible
  left: Math.random() * 96 + 2,           // 2–98 %
  delay: Math.random() * 14,              // 0–14 s stagger
  duration: Math.random() * 8 + 14,      // 14–22 s
  opacity: Math.random() * 0.35 + 0.55,  // 0.55–0.90 — bold
}));

const Bubbles = () => (
  <div className="bubbles-layer" aria-hidden="true">
    {bubbles.map((b) => (
      <span
        key={b.id}
        className="bubble"
        style={{
          width:  b.size,
          height: b.size,
          left:   `${b.left}%`,
          animationDelay:    `${b.delay}s`,
          animationDuration: `${b.duration}s`,
          opacity: b.opacity,
        }}
      />
    ))}
  </div>
);

export default Bubbles;
