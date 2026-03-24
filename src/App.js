import React from "react";
import { useState, useEffect, useRef } from "react";

const LEVELS = [
  { id: 1, name: "Start", emoji: "🌱", color: "#4ade80", bg: "#052e16", desc: "Quick revision to kick things off", xpReward: 50, days: "3–5 days", scene: "🏠", unlocks: "GPA Mission", motivation: "Every legend starts somewhere. This is your day one. 🌱" },
  { id: 2, name: "GPA Boost", emoji: "📚", color: "#facc15", bg: "#1c1917", desc: "Math & Physics mastery", xpReward: 100, days: "4–6 weeks", scene: "🏫", unlocks: "Coding Sprint", motivation: "Your GPA is your passport. Stamp it with excellence. 📚" },
  { id: 3, name: "Coding Sprint", emoji: "💻", color: "#fb923c", bg: "#1c0a00", desc: "Build small features daily", xpReward: 150, days: "Ongoing", scene: "🖥️", unlocks: "First Project", motivation: "Engineer mode unlocked 🔥 Code is your new language." },
  { id: 4, name: "First Project", emoji: "🛠️", color: "#60a5fa", bg: "#0c1a3a", desc: "Build a real app (Clean Egypt)", xpReward: 200, days: "6–8 weeks", scene: "🧪", unlocks: "Summer Level", motivation: "You're building something real. This is where ideas become apps. 🛠️" },
  { id: 5, name: "Summer Level", emoji: "☀️", color: "#c084fc", bg: "#1a0533", desc: "Polish & expand your project", xpReward: 300, days: "Summer", scene: "🌴", unlocks: "STEM Year", motivation: "You're getting closer to the scholarship 💛 Keep going." },
  { id: 6, name: "STEM Year", emoji: "🔬", color: "#f43f5e", bg: "#1f0010", desc: "Advanced math, bigger project, competitions", xpReward: 400, days: "Full year", scene: "🏆", unlocks: "Scholarship", motivation: "You're in the top tier now. The scholarship can smell you coming. 🔬" },
  { id: 7, name: "Scholarship", emoji: "🎓", color: "#fbbf24", bg: "#1c1100", desc: "CV, interviews & presentation", xpReward: 500, days: "Final Boss", scene: "✨", unlocks: "Your Future!", motivation: "This is it. Everything you've worked for leads HERE. 🎓✨" },
];

// Project checklists per level (for levels 4 and 5 especially)
const PROJECTS = {
  4: {
    name: "Clean Egypt App",
    emoji: "🗺️",
    color: "#60a5fa",
    tasks: [
      { id: "p4_1", title: "Design the app wireframe", icon: "🖊️", done: false },
      { id: "p4_2", title: "Build the Login page", icon: "🔐", done: false },
      { id: "p4_3", title: "Create map UI component", icon: "🗺️", done: false },
      { id: "p4_4", title: "Add report upload feature", icon: "📸", done: false },
      { id: "p4_5", title: "Connect to a backend/API", icon: "🔌", done: false },
      { id: "p4_6", title: "Test on mobile screen", icon: "📱", done: false },
      { id: "p4_7", title: "Deploy & share link", icon: "🚀", done: false },
    ]
  },
  5: {
    name: "Summer Polish",
    emoji: "☀️",
    color: "#c084fc",
    tasks: [
      { id: "p5_1", title: "Fix all known bugs", icon: "🐛", done: false },
      { id: "p5_2", title: "Add animations & transitions", icon: "✨", done: false },
      { id: "p5_3", title: "Improve mobile responsiveness", icon: "📱", done: false },
      { id: "p5_4", title: "Write a README file", icon: "📄", done: false },
      { id: "p5_5", title: "Record a demo video", icon: "🎬", done: false },
      { id: "p5_6", title: "Get 3 friends to test it", icon: "👥", done: false },
    ]
  },
  7: {
    name: "Scholarship Application",
    emoji: "🎓",
    color: "#fbbf24",
    tasks: [
      { id: "p7_1", title: "Build your CV", icon: "📋", done: false },
      { id: "p7_2", title: "Write your personal statement", icon: "✍️", done: false },
      { id: "p7_3", title: "Prepare project presentation", icon: "🖥️", done: false },
      { id: "p7_4", title: "Practice interview answers", icon: "🎤", done: false },
      { id: "p7_5", title: "Submit application", icon: "📬", done: false },
    ]
  }
};

const DEFAULT_STUDY = [
  { id: "sq1", title: "Study 1 Hour", icon: "⏱️", xp: 10 },
  { id: "sq2", title: "Solve Past Exam", icon: "📝", xp: 25 },
  { id: "sq3", title: "Review a Lesson", icon: "📖", xp: 15 },
];
const DEFAULT_CODING = [
  { id: "cq1", title: "Build Login Page", icon: "🔐", xp: 30 },
  { id: "cq2", title: "Create UI Component", icon: "🧩", xp: 30 },
  { id: "cq3", title: "Add Button Feature", icon: "🖱️", xp: 30 },
];

// Weekly requirements: 3 study + 2 coding minimum
const WEEKLY_REQ = { study: 3, coding: 2 };

const LUCK_CARDS = [
  { emoji: "🛌", title: "Rest Day", desc: "No penalty today — recharge!", color: "#818cf8" },
  { emoji: "💡", title: "New Idea", desc: "Try a totally different approach!", color: "#34d399" },
  { emoji: "🎮", title: "Fun Mode", desc: "Learn something you enjoy today!", color: "#fb923c" },
  { emoji: "⚡", title: "Double XP", desc: "Next quest gives 2× XP!", color: "#facc15" },
];

const TITLES = ["Beginner", "Builder", "Developer", "Engineer", "Scholar"];
function getTitle(xp) {
  if (xp < 100) return TITLES[0];
  if (xp < 300) return TITLES[1];
  if (xp < 600) return TITLES[2];
  if (xp < 1000) return TITLES[3];
  return TITLES[4];
}

function StarBg() {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    x: (i * 37 + 11) % 100, y: (i * 53 + 7) % 100,
    size: (i % 3) + 0.5, delay: (i % 5) * 0.6,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: "50%",
          background: "white", opacity: 0.4,
          animation: `twinkle 3s ${s.delay}s infinite alternate`
        }} />
      ))}
    </div>
  );
}

function SectionHeader({ label, color, onAdd }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>{label}</div>
      <button onClick={onAdd} style={{ background: `${color}22`, border: `1px solid ${color}66`, borderRadius: 14, padding: "4px 12px", color, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Add</button>
    </div>
  );
}

function QuestRow({ quest, done, onComplete, onDelete, color }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onComplete}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: 12, background: done ? `${color}11` : "rgba(255,255,255,0.03)", border: `1px solid ${done ? color : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: "12px 14px", marginBottom: 9, cursor: "pointer", transition: "all 0.2s" }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>{quest.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, textDecoration: done ? "line-through" : "none", color: done ? "rgba(255,255,255,0.4)" : "white" }}>{quest.title}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>+{quest.xp} XP</div>
      </div>
      {hov && (
        <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{ background: "rgba(244,63,94,0.15)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: 10, padding: "3px 8px", color: "#f87171", fontSize: 11, cursor: "pointer" }}>✕</button>
      )}
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: done ? color : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, transition: "background 0.2s" }}>{done ? "✓" : "○"}</div>
    </div>
  );
}

function AddQuestForm({ icon, setIcon, title, setTitle, xp, setXp, onSave, onCancel, color }) {
  const ICONS = ["⏱️","📝","📖","💻","🔐","🧩","🖱️","🎯","🔬","📐","🖊️","🌐","🔧","📊","🧠","✏️","🎓","🔑","⚡","🏃"];
  return (
    <div style={{ background: `${color}0d`, border: `1px solid ${color}44`, borderRadius: 18, padding: 16, marginBottom: 12, animation: "fadeUp 0.2s ease" }}>
      <div style={{ fontSize: 11, color, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>✨ New Quest</div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>Pick icon</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {ICONS.map(e => (
            <span key={e} onClick={() => setIcon(e)} style={{ fontSize: 20, cursor: "pointer", display: "inline-block", opacity: icon === e ? 1 : 0.35, transform: icon === e ? "scale(1.35)" : "scale(1)", transition: "all 0.15s" }}>{e}</span>
          ))}
        </div>
      </div>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Quest title..." style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "9px 12px", color: "white", fontSize: 13, boxSizing: "border-box", marginBottom: 10, outline: "none" }} />
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>XP:</div>
        {[5, 10, 15, 20, 25, 30].map(v => (
          <button key={v} onClick={() => setXp(v)} style={{ background: xp === v ? color : "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "4px 10px", color: xp === v ? "#000" : "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{v}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onSave} style={{ flex: 1, background: `linear-gradient(90deg,${color},${color}aa)`, border: "none", borderRadius: 14, padding: "9px", color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Add Quest ✓</button>
        <button onClick={onCancel} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 14, padding: "9px 16px", color: "rgba(255,255,255,0.55)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

// ── NEW: Weekly Progress Counter ──────────────────────────────
function WeeklyCounter({ weeklyStudy, weeklyCoding, color }) {
  const studyOk = weeklyStudy >= WEEKLY_REQ.study;
  const codingOk = weeklyCoding >= WEEKLY_REQ.coding;
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "14px 16px", marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>📅 This Week's Target</div>
      <div style={{ display: "flex", gap: 12 }}>
        {/* Study */}
        <div style={{ flex: 1, background: studyOk ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${studyOk ? "#4ade80" : "rgba(255,255,255,0.08)"}`, borderRadius: 14, padding: "10px 12px" }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>📚</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: studyOk ? "#4ade80" : "white" }}>{weeklyStudy}<span style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>/{WEEKLY_REQ.study}</span></div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Study sessions</div>
          <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
            {Array.from({ length: WEEKLY_REQ.study }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < weeklyStudy ? "#4ade80" : "rgba(255,255,255,0.1)" }} />
            ))}
          </div>
          {studyOk && <div style={{ fontSize: 10, color: "#4ade80", marginTop: 5, fontWeight: 700 }}>✓ DONE!</div>}
        </div>
        {/* Coding */}
        <div style={{ flex: 1, background: codingOk ? "rgba(96,165,250,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${codingOk ? "#60a5fa" : "rgba(255,255,255,0.08)"}`, borderRadius: 14, padding: "10px 12px" }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>💻</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: codingOk ? "#60a5fa" : "white" }}>{weeklyCoding}<span style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>/{WEEKLY_REQ.coding}</span></div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Coding sessions</div>
          <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
            {Array.from({ length: WEEKLY_REQ.coding }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < weeklyCoding ? "#60a5fa" : "rgba(255,255,255,0.1)" }} />
            ))}
          </div>
          {codingOk && <div style={{ fontSize: 10, color: "#60a5fa", marginTop: 5, fontWeight: 700 }}>✓ DONE!</div>}
        </div>
      </div>
      {(!studyOk || !codingOk) && (
        <div style={{ marginTop: 10, fontSize: 12, color: "rgba(251,191,36,0.8)", textAlign: "center" }}>
          ⚠️ Complete weekly targets to unlock level progress
        </div>
      )}
      {studyOk && codingOk && (
        <div style={{ marginTop: 10, fontSize: 13, color: "#4ade80", textAlign: "center", fontWeight: 700 }}>
          🎉 Weekly targets crushed! XP progress unlocked.
        </div>
      )}
    </div>
  );
}

// ── NEW: Project Mode ─────────────────────────────────────────
function ProjectMode({ levelId, projectState, onToggleTask }) {
  const proj = PROJECTS[levelId];
  if (!proj) return null;
  const tasks = projectState[levelId] || proj.tasks;
  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div style={{ background: `${proj.color}0a`, border: `1px solid ${proj.color}33`, borderRadius: 20, padding: 18, marginBottom: 20, animation: "fadeUp 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: proj.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>🛠️ Project Mode</div>
          <div style={{ fontSize: 17, fontWeight: 900, marginTop: 2 }}>{proj.emoji} {proj.name}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: proj.color }}>{pct}%</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{done}/{total} done</div>
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${proj.color},${proj.color}99)`, borderRadius: 10, transition: "width 0.6s ease" }} />
      </div>
      {/* Tasks */}
      {tasks.map(task => (
        <div key={task.id} onClick={() => onToggleTask(levelId, task.id)}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", marginBottom: 6, borderRadius: 13, background: task.done ? `${proj.color}18` : "rgba(255,255,255,0.03)", border: `1px solid ${task.done ? proj.color + "55" : "rgba(255,255,255,0.07)"}`, cursor: "pointer", transition: "all 0.2s" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{task.icon}</span>
          <span style={{ flex: 1, fontSize: 13, fontWeight: 600, textDecoration: task.done ? "line-through" : "none", color: task.done ? "rgba(255,255,255,0.4)" : "white" }}>{task.title}</span>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: task.done ? proj.color : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, fontWeight: 700, color: task.done ? "#000" : "rgba(255,255,255,0.4)", transition: "all 0.2s" }}>{task.done ? "✓" : "○"}</div>
        </div>
      ))}
      {pct === 100 && (
        <div style={{ marginTop: 10, textAlign: "center", fontSize: 14, fontWeight: 800, color: proj.color, animation: "popIn 0.4s ease" }}>
          🏆 Project Complete! Ready for next level!
        </div>
      )}
    </div>
  );
}

// ── NEW: Map with moving avatar ───────────────────────────────
function JourneyMap({ currentLevel, onPlay, animatingLevel }) {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: 3, textTransform: "uppercase" }}>Your Journey</div>
        <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>The Software Engineer's Path</div>
      </div>
      <div style={{ position: "relative", paddingLeft: 40 }}>
        {/* Vertical path line */}
        <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,#4ade80,#fbbf24,#f43f5e)", opacity: 0.25 }} />

        {LEVELS.map((lv, idx) => {
          const isUnlocked = lv.id <= currentLevel;
          const isCurrent = lv.id === currentLevel;
          const isDoneLevel = lv.id < currentLevel;
          const isAnimating = animatingLevel === lv.id;

          return (
            <div key={lv.id} style={{ display: "flex", gap: 16, marginBottom: 18, position: "relative" }}>
              {/* Avatar dot — shows on current level, animates on level-up */}
              {isCurrent && (
                <div style={{
                  position: "absolute",
                  left: -21,
                  top: 0,
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  zIndex: 10,
                  animation: isAnimating ? "avatarBounce 0.6s ease, glow 1.5s infinite" : "float 2.5s ease-in-out infinite",
                  filter: `drop-shadow(0 0 10px ${lv.color})`
                }}>👩‍💻</div>
              )}

              {/* Node circle */}
              <div onClick={() => isUnlocked && onPlay()} style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0, marginLeft: -20,
                background: isDoneLevel ? "#1a2e1a" : isCurrent ? `radial-gradient(circle,${lv.color}33,${lv.bg})` : "rgba(255,255,255,0.04)",
                border: `2px solid ${isUnlocked ? lv.color : "rgba(255,255,255,0.1)"}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                cursor: isUnlocked ? "pointer" : "default",
                boxShadow: isCurrent ? `0 0 20px ${lv.color}66` : "none",
                transition: "all 0.5s ease",
                opacity: isCurrent ? 0 : 1  // hide behind avatar on current
              }}>{isDoneLevel ? "✅" : lv.emoji}</div>

              {/* Level card */}
              <div style={{
                flex: 1,
                background: isCurrent ? `linear-gradient(135deg,${lv.bg},rgba(255,255,255,0.04))` : "rgba(255,255,255,0.03)",
                border: isCurrent ? `1px solid ${lv.color}55` : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16, padding: "12px 16px",
                opacity: isUnlocked ? 1 : 0.35,
                transition: "all 0.5s ease",
                boxShadow: isCurrent ? `0 4px 30px ${lv.color}22` : "none"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 11, color: lv.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Level {lv.id} · {lv.days}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>{lv.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>{lv.desc}</div>
                  </div>
                  <div style={{ fontSize: 26 }}>{lv.scene}</div>
                </div>
                {isCurrent && (
                  <>
                    {/* Motivational message */}
                    <div style={{ marginTop: 8, padding: "8px 12px", background: `${lv.color}15`, borderRadius: 12, fontSize: 12, color: lv.color, fontStyle: "italic", lineHeight: 1.5 }}>
                      "{lv.motivation}"
                    </div>
                    <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Reward: <span style={{ color: "#fbbf24", fontWeight: 700 }}>+{lv.xpReward} XP</span></div>
                      <button onClick={onPlay} style={{ background: `linear-gradient(90deg,${lv.color},${lv.color}aa)`, border: "none", borderRadius: 20, padding: "5px 14px", color: "#000", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>Play →</button>
                    </div>
                  </>
                )}
                {isDoneLevel && (
                  <div style={{ marginTop: 6, fontSize: 11, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
                    Unlocked: {lv.unlocks} ✅
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── localStorage helpers ──────────────────────────────────────
function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// Custom hook: useState that automatically persists to localStorage
function useSaved(key, fallback) {
  const [value, setValue] = useState(() => load(key, fallback));
  function setAndSave(next) {
    setValue(prev => {
      const resolved = typeof next === "function" ? next(prev) : next;
      save(key, resolved);
      return resolved;
    });
  }
  return [value, setAndSave];
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [xp, setXp] = useSaved("sq_xp", 0);
  const [currentLevel, setCurrentLevel] = useSaved("sq_level", 1);
  const [screen, setScreen] = useState("map");
  const [luckCard, setLuckCard] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [animatingLevel, setAnimatingLevel] = useState(null);
  const [streak, setStreak] = useSaved("sq_streak", 0);
  const [notification, setNotification] = useState(null);
  const [avatarColor, setAvatarColor] = useSaved("sq_avatarColor", "#60a5fa");
  const [hijabColor, setHijabColor] = useSaved("sq_hijabColor", "#1e40af");

  // Per-level quest lists
  const [studyQuests, setStudyQuests] = useSaved("sq_studyQuests", { 1: [...DEFAULT_STUDY] });
  const [codingQuests, setCodingQuests] = useSaved("sq_codingQuests", { 1: [...DEFAULT_CODING] });

  // Completions per level — Sets can't serialize to JSON, store as arrays
  const [completionsRaw, setCompletionsRaw] = useSaved("sq_completions", {});
  const completions = Object.fromEntries(
    Object.entries(completionsRaw).map(([k, v]) => [k, new Set(v)])
  );
  function setCompletions(updater) {
    setCompletionsRaw(prev => {
      const prevSets = Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, new Set(v)]));
      const next = typeof updater === "function" ? updater(prevSets) : updater;
      return Object.fromEntries(Object.entries(next).map(([k, v]) => [k, [...v]]));
    });
  }

  // Weekly tracking
  const [weeklyStudy, setWeeklyStudy] = useSaved("sq_weeklyStudy", 0);
  const [weeklyCoding, setWeeklyCoding] = useSaved("sq_weeklyCoding", 0);

  // Activity log
  const [log, setLog] = useSaved("sq_log", []);

  // Project task state
  const [projectState, setProjectState] = useSaved("sq_projects", () => {
    const init = {};
    Object.keys(PROJECTS).forEach(lvl => {
      init[lvl] = PROJECTS[lvl].tasks.map(t => ({ ...t }));
    });
    return init;
  });

  const [showLogForm, setShowLogForm] = useState(false);
  const [logText, setLogText] = useState("");
  const [logEmoji, setLogEmoji] = useState("✅");

  // Add quest form state
  const [addingType, setAddingType] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newXp, setNewXp] = useState(15);
  const [newIcon, setNewIcon] = useState("🎯");

  const title = getTitle(xp);
  const xpToNext = (Math.floor(xp / 100) + 1) * 100;
  const xpProgress = ((xp % 100) / 100) * 100;
  const level = LEVELS[currentLevel - 1];

  const sQuests = studyQuests[currentLevel] || [];
  const cQuests = codingQuests[currentLevel] || [];
  const totalQuests = sQuests.length + cQuests.length;
  const doneSet = completions[currentLevel] || new Set();
  const doneCount = doneSet.size;

  const weeklyMet = weeklyStudy >= WEEKLY_REQ.study && weeklyCoding >= WEEKLY_REQ.coding;

  function notify(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2800);
  }

  function isDone(qid) { return doneSet.has(qid); }

  function completeQuest(quest, type) {
    if (isDone(quest.id)) return;

    // Update completions
    setCompletions(prev => {
      const s = new Set(prev[currentLevel] || []);
      s.add(quest.id);
      return { ...prev, [currentLevel]: s };
    });

    // Track weekly counts
    if (type === "study") setWeeklyStudy(w => w + 1);
    if (type === "coding") setWeeklyCoding(w => w + 1);

    const gained = quest.xp;
    const newXp = xp + gained;
    setXp(newXp);
    setLog(prev => [{ text: `Completed: ${quest.title}`, emoji: quest.icon, xp: gained, time: nowStr() }, ...prev]);
    notify(`+${gained} XP! "${quest.title}" ✅`);

    // Level up check — only if weekly targets are met
    const thresholds = [0, 50, 150, 300, 500, 800, 1200, 1700];
    if (weeklyMet && newXp >= thresholds[currentLevel] && currentLevel < 7) {
      setTimeout(() => {
        const nl = currentLevel + 1;
        setAnimatingLevel(nl);
        setCurrentLevel(nl);
        setStudyQuests(prev => ({ ...prev, [nl]: prev[nl] || [...DEFAULT_STUDY] }));
        setCodingQuests(prev => ({ ...prev, [nl]: prev[nl] || [...DEFAULT_CODING] }));
        setShowLevelUp(true);
        setTimeout(() => { setShowLevelUp(false); setAnimatingLevel(null); }, 3000);
        notify(`🎉 ${LEVELS[nl - 1]?.motivation}`);
      }, 800);
    } else if (!weeklyMet && newXp >= thresholds[currentLevel]) {
      notify("⚠️ Complete weekly targets first to level up!");
    }
  }

  function resetDay() {
    setCompletions(prev => ({ ...prev, [currentLevel]: new Set() }));
    setStreak(s => s + 1);
    setLog(prev => [{ text: "Started a new day 🌅", emoji: "🌅", xp: 0, time: nowStr() }, ...prev]);
    notify("New day! Streak +1 🔥 Quests reset 🌅");
  }

  function resetWeek() {
    setWeeklyStudy(0);
    setWeeklyCoding(0);
    notify("New week started! Weekly targets reset 📅");
  }

  function addQuest() {
    if (!newTitle.trim()) return;
    const quest = { id: `c_${Date.now()}`, title: newTitle.trim(), icon: newIcon, xp: Number(newXp) };
    if (addingType === "study") setStudyQuests(prev => ({ ...prev, [currentLevel]: [...(prev[currentLevel] || []), quest] }));
    else setCodingQuests(prev => ({ ...prev, [currentLevel]: [...(prev[currentLevel] || []), quest] }));
    notify(`"${quest.title}" added! 🎉`);
    setNewTitle(""); setNewXp(15); setNewIcon("🎯"); setAddingType(null);
  }

  function removeQuest(type, qid) {
    if (type === "study") setStudyQuests(prev => ({ ...prev, [currentLevel]: (prev[currentLevel] || []).filter(q => q.id !== qid) }));
    else setCodingQuests(prev => ({ ...prev, [currentLevel]: (prev[currentLevel] || []).filter(q => q.id !== qid) }));
  }

  function toggleProjectTask(levelId, taskId) {
    setProjectState(prev => ({
      ...prev,
      [levelId]: prev[levelId].map(t => t.id === taskId ? { ...t, done: !t.done } : t)
    }));
    notify("Project task updated! 🛠️");
  }

  function addLogEntry() {
    if (!logText.trim()) return;
    setLog(prev => [{ text: logText.trim(), emoji: logEmoji, xp: 5, time: nowStr() }, ...prev]);
    setXp(x => x + 5);
    notify("+5 XP for logging progress! 📓");
    setLogText(""); setLogEmoji("✅"); setShowLogForm(false);
  }

  function nowStr() { return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }

  const hasProject = !!PROJECTS[currentLevel];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0015 0%,#050020 50%,#0a0010 100%)", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "white", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes twinkle{from{opacity:0.2}to{opacity:0.8}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes slideIn{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes popIn{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(251,191,36,0.4)}50%{box-shadow:0 0 20px 8px rgba(251,191,36,0.2)}}
        @keyframes fadeUp{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes avatarBounce{0%{transform:translateY(0) scale(1)}30%{transform:translateY(-24px) scale(1.3)}60%{transform:translateY(-12px) scale(1.1)}100%{transform:translateY(0) scale(1)}}
        @keyframes glow{0%,100%{filter:drop-shadow(0 0 6px #fbbf24)}50%{filter:drop-shadow(0 0 18px #fbbf24) drop-shadow(0 0 30px #f59e0b)}}
        @keyframes slideRight{from{transform:translateX(-30px);opacity:0}to{transform:translateX(0);opacity:1}}
        .nav-btn:hover{opacity:1!important;transform:translateY(-2px)}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:4px}
      `}</style>
      <StarBg />

      {/* Toast */}
      {notification && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg,#fbbf24,#f59e0b)", color: "#1c1100", padding: "10px 24px", borderRadius: 50, fontWeight: 700, fontSize: 14, zIndex: 999, animation: "slideIn 0.3s ease", whiteSpace: "nowrap", boxShadow: "0 4px 24px rgba(251,191,36,0.4)", maxWidth: "90vw", textAlign: "center" }}>
          {notification}
        </div>
      )}

      {/* Level Up overlay */}
      {showLevelUp && (
        <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 998, background: "rgba(0,0,0,0.85)" }}>
          <div style={{ textAlign: "center", animation: "popIn 0.5s ease", background: "linear-gradient(135deg,#1c1100,#2d1a00)", border: "2px solid #fbbf24", borderRadius: 24, padding: "48px 64px" }}>
            <div style={{ fontSize: 72, animation: "float 1.5s ease-in-out infinite" }}>🏆</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#fbbf24", marginTop: 12 }}>Level Up!</div>
            <div style={{ fontSize: 20, color: "#fde68a", marginTop: 8 }}>Welcome to <b>{LEVELS[currentLevel - 1]?.name}</b></div>
            <div style={{ fontSize: 48, marginTop: 16 }}>{LEVELS[currentLevel - 1]?.emoji}</div>
            <div style={{ marginTop: 16, padding: "12px 20px", background: "rgba(251,191,36,0.1)", borderRadius: 16, fontSize: 14, color: "#fbbf24", fontStyle: "italic", maxWidth: 280, lineHeight: 1.5 }}>
              "{LEVELS[currentLevel - 1]?.motivation}"
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ position: "relative", zIndex: 10, background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%,${avatarColor},#1e3a5f)`, border: `2px solid ${hijabColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, animation: "float 3s ease-in-out infinite" }}>👩‍💻</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>{title}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Level {currentLevel}</div>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>XP · {xp} / {xpToNext}</div>
          <div style={{ width: 130, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${xpProgress}%`, background: "linear-gradient(90deg,#fbbf24,#f59e0b)", borderRadius: 10, transition: "width 0.5s ease" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 13 }}>🔥{streak}</span>
          <button onClick={() => { setLuckCard(LUCK_CARDS[Math.floor(Math.random() * LUCK_CARDS.length)]); setScreen("card"); }} style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 20, padding: "6px 12px", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>🎴</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 5, maxWidth: 480, margin: "0 auto", padding: "20px 16px 100px", overflowY: "auto", maxHeight: "calc(100vh - 130px)" }}>

        {/* MAP — with moving avatar */}
        {screen === "map" && (
          <JourneyMap
            currentLevel={currentLevel}
            onPlay={() => setScreen("quests")}
            animatingLevel={animatingLevel}
          />
        )}

        {/* QUESTS */}
        {screen === "quests" && (
          <div style={{ animation: "slideIn 0.3s ease" }}>
            {/* Level card */}
            <div style={{ background: `linear-gradient(135deg,${level.bg},rgba(255,255,255,0.02))`, border: `1px solid ${level.color}44`, borderRadius: 20, padding: "16px 20px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: level.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Level {level.id} · Active</div>
                <div style={{ fontSize: 20, fontWeight: 900, marginTop: 2 }}>{level.emoji} {level.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{doneCount}/{totalQuests} quests done today</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                <button onClick={resetDay} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "7px 12px", color: "white", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>🌅 New Day</button>
                <button onClick={resetWeek} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "5px 12px", color: "rgba(255,255,255,0.5)", fontSize: 10, cursor: "pointer" }}>📅 New Week</button>
              </div>
            </div>

            {/* Motivational banner */}
            <div style={{ background: `${level.color}12`, border: `1px solid ${level.color}33`, borderRadius: 14, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: level.color, fontStyle: "italic", lineHeight: 1.5, animation: "fadeUp 0.4s ease" }}>
              💛 "{level.motivation}"
            </div>

            {/* Weekly counter */}
            <WeeklyCounter weeklyStudy={weeklyStudy} weeklyCoding={weeklyCoding} color={level.color} />

            {/* Daily progress bar */}
            <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden", marginBottom: 22 }}>
              <div style={{ height: "100%", width: totalQuests ? `${(doneCount / totalQuests) * 100}%` : "0%", background: `linear-gradient(90deg,${level.color},${level.color}88)`, borderRadius: 10, transition: "width 0.5s" }} />
            </div>

            {/* Project Mode — shown for levels that have projects */}
            {hasProject && (
              <ProjectMode
                levelId={currentLevel}
                projectState={projectState}
                onToggleTask={toggleProjectTask}
              />
            )}

            {/* Study */}
            <SectionHeader label="📚 Study Quests" color="#4ade80" onAdd={() => { setAddingType("study"); setNewTitle(""); setNewIcon("📖"); setNewXp(15); }} />
            {sQuests.map(q => <QuestRow key={q.id} quest={q} done={isDone(q.id)} onComplete={() => completeQuest(q, "study")} onDelete={() => removeQuest("study", q.id)} color="#4ade80" />)}
            {addingType === "study" && <AddQuestForm icon={newIcon} setIcon={setNewIcon} title={newTitle} setTitle={setNewTitle} xp={newXp} setXp={setNewXp} onSave={addQuest} onCancel={() => setAddingType(null)} color="#4ade80" />}

            {/* Weekly lock warning */}
            {!weeklyMet && (
              <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 14, padding: "10px 14px", marginTop: 8, marginBottom: 8, fontSize: 12, color: "#fbbf24" }}>
                ⚠️ Level progress locked until weekly targets are met. Keep going!
              </div>
            )}

            {/* Coding */}
            <div style={{ marginTop: 22 }}>
              <SectionHeader label="💻 Coding Quests" color="#60a5fa" onAdd={() => { setAddingType("code"); setNewTitle(""); setNewIcon("💻"); setNewXp(30); }} />
              {cQuests.map(q => <QuestRow key={q.id} quest={q} done={isDone(q.id)} onComplete={() => completeQuest(q, "coding")} onDelete={() => removeQuest("code", q.id)} color="#60a5fa" />)}
              {addingType === "code" && <AddQuestForm icon={newIcon} setIcon={setNewIcon} title={newTitle} setTitle={setNewTitle} xp={newXp} setXp={setNewXp} onSave={addQuest} onCancel={() => setAddingType(null)} color="#60a5fa" />}
            </div>

            {/* Log section */}
            <div style={{ marginTop: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>📓 What I Did</div>
                <button onClick={() => setShowLogForm(v => !v)} style={{ background: showLogForm ? "rgba(255,255,255,0.08)" : "linear-gradient(90deg,#fbbf24,#f59e0b)", border: "none", borderRadius: 16, padding: "5px 14px", color: showLogForm ? "rgba(255,255,255,0.6)" : "#1c1100", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                  {showLogForm ? "Cancel" : "+ Log Entry"}
                </button>
              </div>

              {showLogForm && (
                <div style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.22)", borderRadius: 18, padding: 16, marginBottom: 14, animation: "fadeUp 0.2s ease" }}>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>How was it?</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {["✅","📝","💡","🔧","📖","🎯","🚀","💪","🌟","🧠","😅","🔥"].map(e => (
                        <span key={e} onClick={() => setLogEmoji(e)} style={{ fontSize: 22, cursor: "pointer", display: "inline-block", opacity: logEmoji === e ? 1 : 0.35, transform: logEmoji === e ? "scale(1.3)" : "scale(1)", transition: "all 0.15s" }}>{e}</span>
                      ))}
                    </div>
                  </div>
                  <textarea value={logText} onChange={e => setLogText(e.target.value)} placeholder="What did you accomplish? e.g. finished 2 chapters, fixed a bug, studied for 2 hours..." rows={3} style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 12px", color: "white", fontSize: 13, resize: "none", boxSizing: "border-box", outline: "none" }} />
                  <button onClick={addLogEntry} style={{ marginTop: 10, background: "linear-gradient(90deg,#fbbf24,#f59e0b)", border: "none", borderRadius: 14, padding: "9px", color: "#1c1100", fontWeight: 800, fontSize: 13, cursor: "pointer", width: "100%" }}>
                    Save Entry (+5 XP) ✨
                  </button>
                </div>
              )}

              {log.length === 0
                ? <div style={{ textAlign: "center", color: "rgba(255,255,255,0.18)", fontSize: 13, padding: "20px 0" }}>Nothing logged yet — start doing things! 🚀</div>
                : log.slice(0, 20).map((entry, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, marginBottom: 8, animation: "fadeUp 0.2s ease" }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{entry.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", lineHeight: 1.4 }}>{entry.text}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginTop: 3 }}>{entry.time}{entry.xp > 0 ? ` · +${entry.xp} XP` : ""}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* PROFILE */}
        {screen === "profile" && (
          <div style={{ animation: "slideIn 0.3s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 100, height: 100, borderRadius: "50%", margin: "0 auto", background: `radial-gradient(circle at 40% 35%,${avatarColor},#1e3a5f)`, border: `3px solid ${hijabColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, animation: "float 3s ease-in-out infinite", boxShadow: `0 0 40px ${avatarColor}44` }}>👩‍💻</div>
              <div style={{ fontSize: 24, fontWeight: 900, marginTop: 16 }}>Engineer Girl</div>
              <div style={{ display: "inline-block", marginTop: 8, background: "linear-gradient(90deg,#fbbf24,#f59e0b)", color: "#1c1100", borderRadius: 20, padding: "4px 16px", fontSize: 13, fontWeight: 800 }}>{title}</div>
              {/* Motivational quote on profile */}
              <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.5)", fontStyle: "italic", padding: "0 20px", lineHeight: 1.6 }}>
                "{level.motivation}"
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
              {[{ label: "XP", value: xp, icon: "⭐" }, { label: "Level", value: currentLevel, icon: "🏅" }, { label: "Streak", value: `${streak}🔥`, icon: "📅" }].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "14px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 22 }}>{s.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, marginTop: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Weekly summary on profile */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>📅 This Week</div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: weeklyStudy >= WEEKLY_REQ.study ? "#4ade80" : "white" }}>{weeklyStudy}/{WEEKLY_REQ.study}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>📚 Study</div>
                </div>
                <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: weeklyCoding >= WEEKLY_REQ.coding ? "#60a5fa" : "white" }}>{weeklyCoding}/{WEEKLY_REQ.coding}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>💻 Coding</div>
                </div>
                <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 26 }}>{weeklyMet ? "✅" : "⏳"}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Status</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700 }}>Title Track</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TITLES.map((t, i) => (<div key={t} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: TITLES.indexOf(title) >= i ? "linear-gradient(90deg,#fbbf24,#f59e0b)" : "rgba(255,255,255,0.06)", color: TITLES.indexOf(title) >= i ? "#1c1100" : "rgba(255,255,255,0.3)", border: TITLES.indexOf(title) === i ? "2px solid #fbbf24" : "1px solid transparent" }}>{t}</div>))}
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🎨 Customize Avatar</div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Outfit Color</div>
                <div style={{ display: "flex", gap: 10 }}>{["#60a5fa","#4ade80","#fb923c","#c084fc","#f43f5e"].map(c => (<div key={c} onClick={() => setAvatarColor(c)} style={{ width: 32, height: 32, borderRadius: "50%", background: c, cursor: "pointer", border: avatarColor === c ? "3px solid white" : "2px solid transparent", transition: "border 0.2s" }} />))}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Hijab Color</div>
                <div style={{ display: "flex", gap: 10 }}>{["#1e40af","#7c3aed","#065f46","#92400e","#881337"].map(c => (<div key={c} onClick={() => setHijabColor(c)} style={{ width: 32, height: 32, borderRadius: "50%", background: c, cursor: "pointer", border: hijabColor === c ? "3px solid white" : "2px solid transparent", transition: "border 0.2s" }} />))}</div>
              </div>
            </div>
          </div>
        )}

        {/* LUCK CARD */}
        {screen === "card" && luckCard && (
          <div style={{ animation: "popIn 0.4s ease", textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 40 }}>🎴 Luck Card Drawn</div>
            <div style={{ background: `linear-gradient(135deg,${luckCard.color}22,rgba(255,255,255,0.04))`, border: `2px solid ${luckCard.color}66`, borderRadius: 28, padding: "48px 32px", maxWidth: 300, margin: "0 auto", boxShadow: `0 0 60px ${luckCard.color}33` }}>
              <div style={{ fontSize: 80 }}>{luckCard.emoji}</div>
              <div style={{ fontSize: 28, fontWeight: 900, marginTop: 20, color: luckCard.color }}>{luckCard.title}</div>
              <div style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", marginTop: 12, lineHeight: 1.6 }}>{luckCard.desc}</div>
            </div>
            <button onClick={() => setScreen("map")} style={{ marginTop: 32, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "12px 32px", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Back to Journey</button>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, zIndex: 20, background: "rgba(10,0,21,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-around", padding: "12px 0 18px" }}>
        {[{ id: "map", icon: "🗺️", label: "Map" }, { id: "quests", icon: "⚔️", label: "Quests" }, { id: "profile", icon: "👩‍💻", label: "Profile" }].map(nav => (
          <button key={nav.id} className="nav-btn" onClick={() => setScreen(nav.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: screen === nav.id ? 1 : 0.4, transition: "all 0.2s", color: screen === nav.id ? "#fbbf24" : "white" }}>
            <span style={{ fontSize: 24 }}>{nav.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700 }}>{nav.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}