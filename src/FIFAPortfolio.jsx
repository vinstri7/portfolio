import { useState, useEffect, useRef } from "react";


const FONT = "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif";

const COLORS = {
  bg: "#0a0b0f",
  bgCard: "#111219",
  gold: "#d4a843",
  goldLight: "#f0d078",
  goldDark: "#8a6d2b",
  accent: "#00e5a0",
  accentBlue: "#00b4ff",
  text: "#e8e6e3",
  textDim: "#6b6d76",
  cardBorder: "rgba(212, 168, 67, 0.3)",
};

/* Global Styles */
const GlobalStyles = () => (
  <style>{`
    @font-face {
      font-family: 'SF Pro Display';
      src: local('SF Pro Display'), local('SFProDisplay-Regular'), local('.SFNSDisplay-Regular');
      font-weight: 400;
    }
    @font-face {
      font-family: 'SF Pro Display';
      src: local('SF Pro Display Bold'), local('SFProDisplay-Bold'), local('.SFNSDisplay-Bold');
      font-weight: 700;
    }
    @keyframes shimmer {
      0%, 100% { transform: translateX(-100%); }
      50% { transform: translateX(100%); }
    }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(212,168,67,0.1); }
      50% { box-shadow: 0 0 40px rgba(212,168,67,0.25); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    @keyframes cardEntrance {
      from { opacity: 0; transform: translateY(40px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes particleFloat {
      0% { transform: translateY(0) translateX(0); opacity: 0; }
      20% { opacity: 0.6; }
      80% { opacity: 0.3; }
      100% { transform: translateY(-200px) translateX(40px); opacity: 0; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    *::-webkit-scrollbar { width: 6px; }
    *::-webkit-scrollbar-track { background: #0a0b0f; }
    *::-webkit-scrollbar-thumb { background: #2a2b35; border-radius: 3px; }
    *::-webkit-scrollbar-thumb:hover { background: #3a3b45; }
    html, body, #root { font-family: ${FONT}; }
  `}</style>
);

/* FUT Background Texture */
const FUTBackground = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 20%, #15130f 0%, #0a0b0f 50%, #070809 100%)" }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 15%, rgba(212,168,67,0.06) 0%, transparent 50%)" }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 85%, rgba(212,168,67,0.04) 0%, transparent 45%)" }} />
    <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(212,168,67,1) 30px, rgba(212,168,67,1) 31px)" }} />
    <div style={{ position: "absolute", inset: 0, opacity: 0.015, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)" }} />
    <div style={{ position: "absolute", inset: 0, opacity: 0.012, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,67,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)" }} />
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} style={{
        position: "absolute", left: `${8 + (i * 7.5) % 85}%`, bottom: `${-5 + (i * 13) % 20}%`,
        width: 2 + (i % 3), height: 2 + (i % 3), borderRadius: "50%",
        background: `rgba(212,168,67,${0.2 + (i % 4) * 0.1})`,
        animation: `particleFloat ${6 + (i % 5) * 2}s ease-in-out ${i * 0.8}s infinite`,
      }} />
    ))}
  </div>
);

const StatHexagon = ({ stats, size = 280 }) => {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const labels = Object.keys(stats);
  const values = Object.values(stats);
  const n = labels.length;
  const getPoint = (i, radius) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  };
  const outerPoints = labels.map((_, i) => getPoint(i, r));
  const midPoints = labels.map((_, i) => getPoint(i, r * 0.6));
  const innerPoints = labels.map((_, i) => getPoint(i, r * 0.3));
  const valuePoints = values.map((v, i) => getPoint(i, r * (v / 99)));
  const labelPoints = labels.map((_, i) => getPoint(i, r + 24));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[outerPoints, midPoints, innerPoints].map((pts, gi) => (
        <polygon key={gi} points={pts.map(p => p.join(",")).join(" ")} fill="none" stroke="rgba(212,168,67,0.15)" strokeWidth="0.5" />
      ))}
      {outerPoints.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="rgba(212,168,67,0.1)" strokeWidth="0.5" />
      ))}
      <polygon points={valuePoints.map(p => p.join(",")).join(" ")} fill="rgba(0,229,160,0.15)" stroke={COLORS.accent} strokeWidth="1.5" />
      {valuePoints.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={COLORS.accent} />
      ))}
      {labelPoints.map((p, i) => (
        <text key={i} x={p[0]} y={p[1]} textAnchor="middle" dominantBaseline="middle" fill={COLORS.goldLight} fontSize="12" fontFamily={FONT} fontWeight="500" letterSpacing="0.5">{labels[i]}</text>
      ))}
    </svg>
  );
};

const AnimCounter = ({ target, duration = 1200, suffix = "" }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const start = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setVal(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
};

/* Player Card */
const PlayerCard = () => (
  <div style={{ width: 400, minHeight: 560, background: "linear-gradient(160deg, #1c1d28 0%, #0f1015 40%, #1a1610 70%, #252015 100%)", border: "1px solid rgba(212,168,67,0.4)", borderRadius: 12, position: "relative", overflow: "hidden", boxShadow: "0 0 60px rgba(212,168,67,0.1), 0 20px 60px rgba(0,0,0,0.5)" }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 40%, rgba(212,168,67,0.06) 45%, rgba(212,168,67,0.12) 50%, rgba(212,168,67,0.06) 55%, transparent 60%)", animation: "shimmer 3s ease-in-out infinite" }} />
    <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)` }} />
    <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 72, fontWeight: 700, color: COLORS.goldLight, fontFamily: FONT, lineHeight: 1, textShadow: "0 0 30px rgba(212,168,67,0.3)" }}>92</div>
        <div style={{ fontSize: 18, color: COLORS.gold, fontFamily: FONT, letterSpacing: 3, marginTop: 4 }}>DEV</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 12, color: COLORS.textDim, letterSpacing: 2, fontFamily: FONT }}>TOTY</div>
        <div style={{ width: 48, height: 34, marginTop: 4, marginLeft: "auto", background: "linear-gradient(135deg, #c41e3a, #8b0000)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700, fontFamily: FONT, letterSpacing: 1 }}>CU</div>
      </div>
    </div>
    <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ width: 130, height: 130, borderRadius: "50%", background: "linear-gradient(135deg, #1a1b24, #2a2520)", border: "2px solid rgba(212,168,67,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, color: COLORS.gold, fontFamily: FONT, fontWeight: 700, zIndex: 1 }}>SU</div>
      <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,168,67,0.1) 0%, transparent 70%)", zIndex: 0 }} />
    </div>
    <div style={{ textAlign: "center", padding: "0 28px" }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", fontFamily: FONT, letterSpacing: 3, textTransform: "uppercase" }}>Samip Udas</div>
      <div style={{ fontSize: 13, color: COLORS.gold, letterSpacing: 2, fontFamily: FONT, marginTop: 6 }}>COMPUTER SCIENCE  ·  CLASS OF 2026</div>
    </div>
    <div style={{ height: 1, margin: "20px 32px", background: `linear-gradient(90deg, transparent, ${COLORS.cardBorder}, transparent)` }} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", padding: "0 24px 28px", textAlign: "center" }}>
      {[{ label: "PYT", val: 94 }, { label: "JAV", val: 88 }, { label: "SQL", val: 85 }, { label: "DAT", val: 90 }, { label: "ML", val: 86 }, { label: "LDR", val: 91 }].map((s, i) => (
        <div key={i} style={{ padding: "8px 0" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", fontFamily: FONT }}>{s.val}</div>
          <div style={{ fontSize: 11, color: COLORS.goldDark, letterSpacing: 1.5, fontFamily: FONT }}>{s.label}</div>
        </div>
      ))}
    </div>
  </div>
);

/* Section Header */
const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: 40, textAlign: "center" }}>
    <div style={{ fontSize: 13, color: COLORS.gold, letterSpacing: 4, fontFamily: FONT, marginBottom: 8, textTransform: "uppercase" }}>{subtitle}</div>
    <div style={{ fontSize: 44, fontWeight: 700, color: "#fff", fontFamily: FONT, letterSpacing: 2, textTransform: "uppercase" }}>{title}</div>
    <div style={{ width: 60, height: 2, margin: "12px auto 0", background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)` }} />
  </div>
);

/* Back Button */
const BackButton = ({ onClick }) => (
  <button onClick={onClick} style={{
    position: "fixed", top: 20, left: 24, zIndex: 200,
    background: "rgba(20,21,32,0.9)", border: "1px solid rgba(212,168,67,0.3)",
    borderRadius: 8, padding: "10px 20px", cursor: "pointer",
    color: COLORS.goldLight, fontSize: 13, fontWeight: 600, fontFamily: FONT,
    letterSpacing: 1, display: "flex", alignItems: "center", gap: 8,
    backdropFilter: "blur(12px)", transition: "all 0.3s ease",
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,168,67,0.6)"; e.currentTarget.style.background = "rgba(30,31,42,0.95)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,168,67,0.3)"; e.currentTarget.style.background = "rgba(20,21,32,0.9)"; }}
  >
    <span style={{ fontSize: 16 }}>&#8592;</span> BACK TO HUB
  </button>
);

/* Formation Pitch */
const FormationPitch = () => {
  const positions = [
    { name: "Python", rating: 94, pos: "ST", x: 50, y: 12 },
    { name: "Java", rating: 88, pos: "LW", x: 18, y: 18 },
    { name: "JavaScript", rating: 85, pos: "RW", x: 82, y: 18 },
    { name: "SQL", rating: 85, pos: "CM", x: 35, y: 40 },
    { name: "TypeScript", rating: 83, pos: "CM", x: 65, y: 40 },
    { name: "Pandas", rating: 90, pos: "CAM", x: 50, y: 32 },
    { name: "NumPy", rating: 87, pos: "CDM", x: 50, y: 50 },
    { name: "TensorFlow", rating: 86, pos: "CB", x: 30, y: 65 },
    { name: "PyTorch", rating: 84, pos: "CB", x: 70, y: 65 },
    { name: "Git", rating: 88, pos: "CB", x: 50, y: 70 },
    { name: "Excel", rating: 82, pos: "GK", x: 50, y: 88 },
  ];
  return (
    <div style={{ width: "100%", maxWidth: 600, margin: "0 auto", aspectRatio: "3/4", background: "linear-gradient(180deg, #1a5c2a 0%, #14491f 30%, #1a5c2a 50%, #14491f 70%, #1a5c2a 100%)", borderRadius: 12, position: "relative", overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)" }}>
      <div style={{ position: "absolute", left: "10%", right: "10%", top: "50%", height: 1, background: "rgba(255,255,255,0.2)" }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 80, height: 80, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)" }} />
      <div style={{ position: "absolute", left: "25%", right: "25%", top: 0, height: "18%", borderBottom: "1px solid rgba(255,255,255,0.2)", borderLeft: "1px solid rgba(255,255,255,0.2)", borderRight: "1px solid rgba(255,255,255,0.2)" }} />
      <div style={{ position: "absolute", left: "25%", right: "25%", bottom: 0, height: "18%", borderTop: "1px solid rgba(255,255,255,0.2)", borderLeft: "1px solid rgba(255,255,255,0.2)", borderRight: "1px solid rgba(255,255,255,0.2)" }} />
      {positions.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", transition: "transform 0.2s ease" }}
          onMouseEnter={e => e.currentTarget.style.transform = "translate(-50%,-50%) scale(1.15)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translate(-50%,-50%) scale(1)"}
        >
          <div style={{ width: 40, height: 48, background: "linear-gradient(160deg, #1c1d28, #252015)", border: "1px solid rgba(212,168,67,0.5)", borderRadius: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
            <div style={{ fontSize: 7, color: COLORS.gold, fontFamily: FONT, letterSpacing: 1 }}>{p.pos}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: FONT, lineHeight: 1 }}>{p.rating}</div>
          </div>
          <div style={{ fontSize: 8, color: "#fff", fontFamily: FONT, letterSpacing: 1, marginTop: 3, background: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: 2, whiteSpace: "nowrap" }}>{p.name.toUpperCase()}</div>
        </div>
      ))}
    </div>
  );
};

/* Transfer Card */
const TransferCard = ({ job, index }) => (
  <div style={{ background: "linear-gradient(135deg, #141520 0%, #0f1015 100%)", border: "1px solid rgba(212,168,67,0.15)", borderRadius: 10, padding: 24, position: "relative", overflow: "hidden", animation: `fadeSlideUp 0.6s ease ${index * 0.15}s both` }}>
    <div style={{ position: "absolute", top: 16, right: 16, background: "linear-gradient(135deg, rgba(212,168,67,0.2), rgba(212,168,67,0.05))", border: "1px solid rgba(212,168,67,0.3)", borderRadius: 6, padding: "4px 10px", fontSize: 10, color: COLORS.gold, fontFamily: FONT, letterSpacing: 2 }}>{job.season}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: FONT, letterSpacing: 1, marginBottom: 4 }}>{job.title}</div>
    <div style={{ fontSize: 15, color: COLORS.gold, fontFamily: FONT, marginBottom: 4 }}>{job.club}</div>
    <div style={{ fontSize: 12, color: COLORS.textDim, fontFamily: FONT, marginBottom: 16 }}>{job.location}  ·  {job.date}</div>
    <div style={{ display: "flex", gap: 16, marginBottom: 16, borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "12px 0" }}>
      {job.stats.map((s, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.accent, fontFamily: FONT }}>{s.val}</div>
          <div style={{ fontSize: 9, color: COLORS.textDim, letterSpacing: 1, fontFamily: FONT }}>{s.label}</div>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {job.highlights.map((h, i) => (
        <div key={i} style={{ fontSize: 15, color: COLORS.text, fontFamily: FONT, lineHeight: 1.5, paddingLeft: 16, position: "relative" }}>
          <span style={{ position: "absolute", left: 0, color: COLORS.accent, fontSize: 11 }}>&#9656;</span>{h}
        </div>
      ))}
    </div>
  </div>
);

/* Match Card */
const MatchCard = ({ project, index }) => (
  <div style={{ background: "linear-gradient(135deg, #141520 0%, #0f1015 100%)", border: "1px solid rgba(212,168,67,0.15)", borderRadius: 10, overflow: "hidden", animation: `fadeSlideUp 0.6s ease ${index * 0.15}s both` }}>
    <div style={{ background: "linear-gradient(90deg, rgba(212,168,67,0.1), transparent)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(212,168,67,0.1)" }}>
      <div style={{ fontSize: 11, color: COLORS.gold, fontFamily: FONT, letterSpacing: 2 }}>{project.type}</div>
      <div style={{ background: project.result === "W" ? "rgba(0,229,160,0.15)" : "rgba(0,180,255,0.15)", color: project.result === "W" ? COLORS.accent : COLORS.accentBlue, padding: "2px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: FONT, letterSpacing: 1 }}>{project.result === "W" ? "COMPLETED" : "IN PROGRESS"}</div>
    </div>
    <div style={{ padding: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: FONT, letterSpacing: 1, marginBottom: 12 }}>{project.name}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {project.tech.map((t, i) => (
          <span key={i} style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.2)", color: COLORS.goldLight, padding: "3px 10px", borderRadius: 4, fontSize: 10, fontFamily: FONT, letterSpacing: 1 }}>{t}</span>
        ))}
      </div>
      {project.highlights.map((h, i) => (
        <div key={i} style={{ fontSize: 15, color: COLORS.text, fontFamily: FONT, lineHeight: 1.5, marginBottom: 6, paddingLeft: 16, position: "relative" }}>
          <span style={{ position: "absolute", left: 0, color: COLORS.gold, fontSize: 14 }}>&#9679;</span>{h}
        </div>
      ))}
    </div>
  </div>
);


const LandingPage = ({ onNavigate }) => {
  const boxes = [
    { id: "overview", title: "OVERVIEW", subtitle: "PLAYER PROFILE", description: "Player card, key attributes, and performance radar", rating: "92", accent: COLORS.goldLight },
    { id: "career", title: "CAREER", subtitle: "CLUB HISTORY & SQUAD", description: "Education, work experience, and technical skill formation", rating: "88", accent: COLORS.accent },
    { id: "matches", title: "MATCHES", subtitle: "HIGHLIGHTS & CAPTAIN", description: "Project showcase, match results, and leadership record", rating: "90", accent: COLORS.accentBlue },
  ];

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 40px" }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 64, animation: "fadeSlideUp 0.7s ease both" }}>
          <div style={{ fontSize: 13, color: COLORS.gold, letterSpacing: 6, fontFamily: FONT, marginBottom: 12 }}>WELCOME TO</div>
          <h1 style={{ fontSize: 72, fontWeight: 700, color: "#fff", fontFamily: FONT, letterSpacing: 4, lineHeight: 1.05 }}>
            SAMIP <span style={{ color: COLORS.goldLight }}>UDAS</span>
          </h1>
          <div style={{ fontSize: 15, color: COLORS.textDim, fontFamily: FONT, marginTop: 12, letterSpacing: 1 }}>
            Computer Science  ·  Caldwell University  ·  Class of 2026
          </div>
        </div>

        {/* 3 Navigation Boxes */}
        <div style={{ display: "flex", gap: 24, maxWidth: 1100, width: "100%", justifyContent: "center", flexWrap: "wrap" }}>
          {boxes.map((box, i) => (
            <div
              key={box.id}
              onClick={() => onNavigate(box.id)}
              style={{
                flex: "1 1 300px", maxWidth: 340, minHeight: 280,
                position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: 12,
                background: "linear-gradient(160deg, #1c1d28 0%, #0f1015 40%, #1a1610 80%, #201c12 100%)",
                border: "1px solid rgba(212,168,67,0.25)",
                animation: `cardEntrance 0.6s ease ${0.2 + i * 0.15}s both`,
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                e.currentTarget.style.borderColor = "rgba(212,168,67,0.6)";
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(212,168,67,0.15), 0 0 40px rgba(212,168,67,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.borderColor = "rgba(212,168,67,0.25)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Shimmer */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 40%, rgba(212,168,67,0.04) 45%, rgba(212,168,67,0.09) 50%, rgba(212,168,67,0.04) 55%, transparent 60%)", animation: "shimmer 4s ease-in-out infinite", animationDelay: `${i * 0.5}s` }} />
              {/* Top accent line */}
              <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${box.accent}, transparent)` }} />
              {/* Content */}
              <div style={{ padding: "28px 24px", position: "relative" }}>
                {/* Faded rating */}
                <div style={{ position: "absolute", top: 16, right: 20, fontSize: 44, fontWeight: 700, color: COLORS.goldLight, fontFamily: FONT, lineHeight: 1, opacity: 0.12 }}>{box.rating}</div>
                {/* Subtitle */}
                <div style={{ fontSize: 11, color: box.accent, letterSpacing: 3, fontFamily: FONT, marginBottom: 12, fontWeight: 500 }}>{box.subtitle}</div>
                {/* Title */}
                <div style={{ fontSize: 34, fontWeight: 700, color: "#fff", fontFamily: FONT, letterSpacing: 3, marginBottom: 16 }}>{box.title}</div>
                {/* Divider */}
                <div style={{ width: 40, height: 2, marginBottom: 16, background: `linear-gradient(90deg, ${box.accent}, transparent)` }} />
                {/* Description */}
                <div style={{ fontSize: 14, color: COLORS.textDim, fontFamily: FONT, lineHeight: 1.6, marginBottom: 28 }}>{box.description}</div>
                {/* Enter */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: COLORS.goldLight, fontFamily: FONT, letterSpacing: 2, fontWeight: 600 }}>
                  ENTER <span style={{ fontSize: 16 }}>&#8594;</span>
                </div>
              </div>
              {/* Bottom line */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${box.accent}44, transparent)` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Transfer / Contact */}
      <div style={{ padding: "80px 24px 60px" }}>
        <SectionHeader title="Get in Touch" subtitle="Submit Transfer Bid" />
        <div style={{ maxWidth: 560, margin: "0 auto", background: "linear-gradient(135deg, #141520 0%, #0f1015 100%)", border: "1px solid rgba(212,168,67,0.2)", borderRadius: 12, padding: 36, textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", fontFamily: FONT, letterSpacing: 2, marginBottom: 8 }}>OPEN TO OPPORTUNITIES</div>
          <div style={{ fontSize: 14, color: COLORS.textDim, fontFamily: FONT, lineHeight: 1.6, marginBottom: 32 }}>
            Interested in data engineering, software development, and ML roles.<br />Available from May 2026.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[{ label: "EMAIL", value: "sudas@caldwell.edu", href: "mailto:sudas@caldwell.edu" }, { label: "PHONE", value: "+1 (973) 641-9399", href: "tel:+19736419399" }].map((c, i) => (
              <a key={i} href={c.href} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", textDecoration: "none", background: "rgba(212,168,67,0.05)", border: "1px solid rgba(212,168,67,0.15)", borderRadius: 8, transition: "all 0.3s ease", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,168,67,0.1)"; e.currentTarget.style.borderColor = "rgba(212,168,67,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(212,168,67,0.05)"; e.currentTarget.style.borderColor = "rgba(212,168,67,0.15)"; }}
              >
                <div style={{ textAlign: "left", flex: 1 }}>
                  <div style={{ fontSize: 10, color: COLORS.textDim, letterSpacing: 2, fontFamily: FONT }}>{c.label}</div>
                  <div style={{ fontSize: 16, color: COLORS.goldLight, fontWeight: 500, fontFamily: FONT, marginTop: 2 }}>{c.value}</div>
                </div>
                <span style={{ color: COLORS.gold, fontSize: 16 }}>&#8594;</span>
              </a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28 }}>
            {[
              { label: 'GitHub', href: 'https://github.com/vinstri7' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/samipudas' }
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`, border: "none", borderRadius: 8, padding: "12px 32px", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#0a0b0f", fontFamily: FONT, letterSpacing: 2, transition: "all 0.3s ease", textDecoration: "none", display: "inline-block" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >{s.label.toUpperCase()}</a>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ padding: "24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: 11, color: COLORS.textDim, fontFamily: FONT, letterSpacing: 2 }}>
        SAMIP UDAS  ·  2025  ·  BUILT WITH PASSION
      </footer>
    </div>
  );
};


const OverviewPage = ({ onBack }) => (
  <div style={{ position: "relative", zIndex: 1, animation: "fadeIn 0.4s ease" }}>
    <BackButton onClick={onBack} />
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "80px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 100, maxWidth: 1200, width: "100%", flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ animation: "float 4s ease-in-out infinite" }}><PlayerCard /></div>
        <div style={{ flex: 1, minWidth: 300, animation: "fadeSlideUp 0.8s ease 0.3s both" }}>
          <div style={{ fontSize: 13, color: COLORS.gold, letterSpacing: 5, fontFamily: FONT, marginBottom: 8 }}>TEAM OF THE YEAR NOMINEE</div>
          <h1 style={{ fontSize: 64, fontWeight: 700, color: "#fff", fontFamily: FONT, letterSpacing: 3, lineHeight: 1.1, marginBottom: 16 }}>
            SAMIP<br /><span style={{ color: COLORS.goldLight }}>UDAS</span>
          </h1>
          <p style={{ fontSize: 17, color: COLORS.textDim, fontFamily: FONT, lineHeight: 1.7, maxWidth: 460, marginBottom: 40 }}>
            Computer Science undergraduate building data-driven systems and reliable software solutions. Strong background in Python, data structures, and analytical problem-solving.
          </p>
          <StatHexagon stats={{ PYT: 94, JAV: 88, SQL: 85, DAT: 90, ML: 86, LDR: 91 }} size={280} />
        </div>
      </div>
    </section>
  </div>
);


const CareerPage = ({ onBack }) => {
  const jobs = [
    { title: "IT TECHNICIAN", club: "Caldwell University", location: "Caldwell, NJ", date: "Feb 2023 – Present", season: "SZN 23-26", stats: [{ val: "15-30", label: "TICKETS/WK" }, { val: "5+", label: "STUDENTS/WK" }, { val: "3", label: "DAYS/WK" }], highlights: ["Resolved 15-30 IT support tickets per week spanning hardware failures, software errors, and access issues", "Provided Blackboard LMS and campus Wi-Fi support, diagnosing login, configuration, and connectivity issues", "Worked with internal IT and academic technology teams to escalate and resolve complex issues", "Communicated technical solutions clearly to non-technical users, ensuring adoption and satisfaction"] },
    { title: "STUDENT RESEARCHER", club: "Caldwell University  ·  cogAI Lab", location: "Caldwell, NJ", date: "May 2024 – Aug 2024", season: "SZN 24", stats: [{ val: "ML", label: "DOMAIN" }, { val: "CV", label: "FOCUS" }, { val: "3mo", label: "DURATION" }], highlights: ["Built and evaluated Python-based data pipelines for image and video analysis", "Worked with large datasets, validating inputs and outputs for consistency across model runs", "Gained experience with production-style ML frameworks and structured experimentation workflows"] },
  ];

  return (
    <div style={{ position: "relative", zIndex: 1, animation: "fadeIn 0.4s ease" }}>
      <BackButton onClick={onBack} />
      <div style={{ padding: "80px 24px" }}>
        <SectionHeader title="Education" subtitle="Club History" />
        <div style={{ maxWidth: 820, margin: "0 auto 80px", background: "linear-gradient(135deg, #141520 0%, #0f1015 100%)", border: "1px solid rgba(212,168,67,0.15)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg, #c41e3a 0%, #8b0000 100%)", padding: "28px 30px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", fontFamily: FONT, letterSpacing: 2 }}>CALDWELL UNIVERSITY</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontFamily: FONT, marginTop: 4 }}>Caldwell, New Jersey  ·  B.S. Computer Science</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontFamily: FONT, letterSpacing: 2 }}>EXPECTED</div>
              <div style={{ fontSize: 18, color: "#fff", fontWeight: 700, fontFamily: FONT }}>MAY 2026</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, padding: "30px 24px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, fontWeight: 700, color: COLORS.goldLight, fontFamily: FONT, lineHeight: 1 }}><AnimCounter target={392} /></div>
              <div style={{ fontSize: 12, color: COLORS.textDim, letterSpacing: 1, fontFamily: FONT, marginTop: 4 }}>GPA (3.92)</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, fontWeight: 700, color: COLORS.accent, fontFamily: FONT, lineHeight: 1 }}><AnimCounter target={7} />x</div>
              <div style={{ fontSize: 12, color: COLORS.textDim, letterSpacing: 1, fontFamily: FONT, marginTop: 4 }}>DEAN'S LIST</div>
            </div>
          </div>
          <div style={{ padding: "0 24px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20 }}>
            <div style={{ fontSize: 11, color: COLORS.gold, letterSpacing: 2, fontFamily: FONT, marginBottom: 12 }}>TRAINING MODULES</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Data Structures & Algorithms", "Artificial Intelligence", "Probability & Statistics", "Database Management", "Business Spreadsheet Apps"].map((c, i) => (
                <span key={i} style={{ background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)", color: COLORS.accent, padding: "5px 14px", borderRadius: 6, fontSize: 12, fontFamily: FONT }}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        <SectionHeader title="Work Experience" subtitle="Transfer History" />
        <div style={{ maxWidth: 820, margin: "0 auto 80px", display: "flex", flexDirection: "column", gap: 20 }}>
          {jobs.map((job, i) => <TransferCard key={i} job={job} index={i} />)}
        </div>

        <SectionHeader title="Technical Skills" subtitle="Squad Builder" />
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <FormationPitch />
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: COLORS.textDim, fontFamily: FONT, letterSpacing: 2 }}>FORMATION: 3-4-3  ·  TEAM RATING: 87</div>
        </div>
      </div>
    </div>
  );
};


const MatchesPage = ({ onBack }) => {
  const projects = [
    { name: "MULTI-SOURCE FINANCIAL DATA RECONCILIATION", type: "FEATURED MATCH", result: "W", tech: ["PYTHON", "PANDAS", "NUMPY", "OPENPYXL"], highlights: ["Built system to ingest and reconcile financial data from multiple sources including market prices, portfolio holdings, and trade records", "Implemented normalization logic to detect and resolve discrepancies across inconsistent source schemas", "Implemented reconciliation checks and threshold-based alerts to flag abnormal variances", "Generated structured Excel reports for downstream analytics and client-facing delivery"] },
    { name: "FOOD RECOGNITION & WEIGHT ESTIMATION", type: "CUP MATCH", result: "W", tech: ["PYTHON", "CHATGPT API", "MASK R-CNN"], highlights: ["Developed application to identify food items from images using ChatGPT's API for classification", "Applied Mask R-CNN for object segmentation and 3D dimension estimation", "Estimated food weight based on calculated dimensions for nutritional tracking and dietary analysis"] },
  ];

  return (
    <div style={{ position: "relative", zIndex: 1, animation: "fadeIn 0.4s ease" }}>
      <BackButton onClick={onBack} />
      <div style={{ padding: "80px 24px" }}>
        <SectionHeader title="Projects" subtitle="Match Highlights" />
        <div style={{ maxWidth: 820, margin: "0 auto 80px", display: "flex", flexDirection: "column", gap: 20 }}>
          {projects.map((p, i) => <MatchCard key={i} project={p} index={i} />)}
        </div>

        <SectionHeader title="Leadership" subtitle="Captain's Armband" />
        <div style={{ maxWidth: 720, margin: "0 auto", background: "linear-gradient(135deg, #141520 0%, #0f1015 100%)", border: "1px solid rgba(212,168,67,0.2)", borderRadius: 12, overflow: "hidden", animation: "pulseGlow 3s ease-in-out infinite" }}>
          <div style={{ background: "linear-gradient(135deg, rgba(212,168,67,0.15), rgba(212,168,67,0.05))", padding: "20px 24px", borderBottom: "1px solid rgba(212,168,67,0.15)", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#0a0b0f", fontFamily: FONT, boxShadow: "0 0 20px rgba(212,168,67,0.3)" }}>C</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: FONT, letterSpacing: 1 }}>PRESIDENT</div>
              <div style={{ fontSize: 15, color: COLORS.gold, fontFamily: FONT }}>Nepalese Student Organization  ·  Caldwell University</div>
            </div>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 12, color: COLORS.textDim, letterSpacing: 2, fontFamily: FONT, marginBottom: 16 }}>AUG 2023 – AUG 2024</div>
            <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
              {[{ val: "$5000+", label: "BUDGET" }, { val: "500+", label: "ATTENDEES" }, { val: "TIHAR", label: "FLAGSHIP" }].map((s, i) => (
                <div key={i} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.goldLight, fontFamily: FONT }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: COLORS.textDim, letterSpacing: 1, fontFamily: FONT, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {["Led planning and execution of large-scale events, managing logistics, budgets, and timelines", "Organized Tihar, one of the largest campus events, coordinating fundraising and team collaboration for 500+ attendees"].map((h, i) => (
              <div key={i} style={{ fontSize: 15, color: COLORS.text, fontFamily: FONT, lineHeight: 1.6, paddingLeft: 16, position: "relative", marginBottom: 8 }}>
                <span style={{ position: "absolute", left: 0, color: COLORS.gold }}>&#9656;</span>{h}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default function FIFAPortfolio() {
  const [page, setPage] = useState("landing");

  const navigate = (target) => {
    setPage(target);
    window.scrollTo({ top: 0 });
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: COLORS.bg, fontFamily: FONT, overflow: "auto", position: "relative" }}>
      <GlobalStyles />
      <FUTBackground />
      {page === "landing" && <LandingPage onNavigate={navigate} />}
      {page === "overview" && <OverviewPage onBack={() => navigate("landing")} />}
      {page === "career" && <CareerPage onBack={() => navigate("landing")} />}
      {page === "matches" && <MatchesPage onBack={() => navigate("landing")} />}
    </div>
  );
}
