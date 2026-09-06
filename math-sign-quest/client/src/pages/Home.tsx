/*
  Crayon Carnival design note: this page is a playful classroom-collage game surface.
  Keep the visual hierarchy bold, warm, and forgiving: the child should always know
  the level, the timer, the current question, and what to do next.
*/
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  Heart,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

type LevelId = "easy" | "medium" | "hard";
type Operator = "+" | "−" | "×" | "÷";
type GameView = "home" | "quiz" | "results";
type Feedback = "correct" | "wrong" | "timeout" | null;

type Level = {
  id: LevelId;
  name: string;
  eyebrow: string;
  description: string;
  timer: number;
  accent: string;
  accentSoft: string;
  icon: string;
  badge: string;
};

type Question = {
  left: number;
  right: number;
  operator: Operator;
  answer: number;
};

const ASSETS = {
  logo: "/manus-storage/math-sign-quest-logo_6fe4e314.png",
  hero: "/manus-storage/math-sign-quest-hero_ad22a66e.png",
  mascot: "/manus-storage/math-sign-quest-mascot_948d670f.png",
  confetti: "/manus-storage/math-sign-quest-confetti_6a9678ad.png",
};

const LEVELS: Level[] = [
  {
    id: "easy",
    name: "Easy",
    eyebrow: "Warm-up round",
    description: "Small numbers, big confidence. A relaxed start for your brain.",
    timer: 15,
    accent: "#F36A5A",
    accentSoft: "#FFF0EC",
    icon: "☀️",
    badge: "Start here",
  },
  {
    id: "medium",
    name: "Medium",
    eyebrow: "Brain stretch",
    description: "A little quicker, a little trickier. Keep your thinking nimble.",
    timer: 11,
    accent: "#4C9DD4",
    accentSoft: "#EAF7FD",
    icon: "🚀",
    badge: "Most played",
  },
  {
    id: "hard",
    name: "Hard",
    eyebrow: "Speed sprint",
    description: "Trust your first smart thought and race the clock like a pro.",
    timer: 8,
    accent: "#8C6CCF",
    accentSoft: "#F1ECFF",
    icon: "⚡",
    badge: "Super challenge",
  },
];

const OPERATORS: Operator[] = ["+", "−", "×", "÷"];
const OPERATOR_LABELS: Record<Operator, string> = {
  "+": "Add",
  "−": "Subtract",
  "×": "Multiply",
  "÷": "Divide",
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildQuestion(level: LevelId, index: number): Question {
  const operator = OPERATORS[(index + (level === "medium" ? 1 : level === "hard" ? 2 : 0)) % OPERATORS.length];
  const max = level === "easy" ? 5 : 9;
  let left = randomInt(1, max);
  let right = randomInt(1, max);

  if (operator === "−" && left < right) {
    [left, right] = [right, left];
  }

  if (operator === "÷") {
    right = randomInt(1, level === "easy" ? 4 : 9);
    const quotient = randomInt(1, level === "easy" ? 5 : 9);
    left = right * quotient;
    return { left, right, operator, answer: quotient };
  }

  const answer = operator === "+" ? left + right : operator === "−" ? left - right : left * right;
  return { left, right, operator, answer };
}

function buildQuestions(level: LevelId) {
  return Array.from({ length: 10 }, (_, index) => buildQuestion(level, index));
}

function formatScore(score: number) {
  return String(score).padStart(2, "0");
}

export default function Home() {
  const [view, setView] = useState<GameView>("home");
  const [selectedLevel, setSelectedLevel] = useState<LevelId>("easy");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LEVELS[0].timer);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [chosenOperator, setChosenOperator] = useState<Operator | null>(null);

  const level = useMemo(
    () => LEVELS.find((entry) => entry.id === selectedLevel) ?? LEVELS[0],
    [selectedLevel],
  );
  const question = questions[questionIndex];
  const progress = view === "quiz" ? ((questionIndex + 1) / 10) * 100 : 0;
  const timerProgress = question ? (timeLeft / level.timer) * 100 : 100;

  const startGame = useCallback((levelId: LevelId) => {
    const nextLevel = LEVELS.find((entry) => entry.id === levelId) ?? LEVELS[0];
    setSelectedLevel(levelId);
    setQuestions(buildQuestions(levelId));
    setQuestionIndex(0);
    setTimeLeft(nextLevel.timer);
    setScore(0);
    setAnswered(0);
    setFeedback(null);
    setChosenOperator(null);
    setView("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goToNextQuestion = useCallback(() => {
    if (questionIndex >= 9) {
      setView("results");
      setFeedback(null);
      setChosenOperator(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setQuestionIndex((current) => current + 1);
    setTimeLeft(level.timer);
    setFeedback(null);
    setChosenOperator(null);
  }, [level.timer, questionIndex]);

  const resolveAnswer = useCallback(
    (operator: Operator | null) => {
      if (!question || feedback) return;

      const isCorrect = operator === question.operator;
      setChosenOperator(operator);
      setFeedback(operator === null ? "timeout" : isCorrect ? "correct" : "wrong");
      setAnswered((current) => current + 1);
      if (isCorrect) {
        setScore((current) => current + 1);
      }

      window.setTimeout(goToNextQuestion, 950);
    },
    [feedback, goToNextQuestion, question],
  );

  useEffect(() => {
    if (view !== "quiz" || feedback || !question) return;

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.setTimeout(() => resolveAnswer(null), 0);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [feedback, question, resolveAnswer, view]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (view !== "quiz" || feedback) return;
      const operatorByKey: Record<string, Operator> = { "1": "+", "2": "−", "3": "×", "4": "÷" };
      const operator = operatorByKey[event.key];
      if (operator) resolveAnswer(operator);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [feedback, resolveAnswer, view]);

  const restartSameLevel = () => startGame(selectedLevel);

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand-lockup" onClick={() => setView("home")} aria-label="Go to Math Sign Quest home">
          <span className="brand-mark"><img src={ASSETS.logo} alt="" /></span>
          <span className="brand-copy">
            <strong>Math Sign</strong>
            <span>Quest</span>
          </span>
        </button>
        <div className="header-note"><Sparkles size={16} /> Mental math, made merry.</div>
        <div className="header-score"><Star size={15} fill="currentColor" /> <span>{formatScore(score)}</span></div>
      </header>

      {view === "home" && (
        <main className="home-view">
          <section className="hero-section">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> A quick-thinking game for bright minds</div>
              <h1>Which sign makes it <em>click?</em></h1>
              <p className="hero-lede">Two numbers. One answer. Your job is to spot the missing math sign before the clock gives a tiny ring.</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => startGame("easy")}>
                  Play easy round <ArrowRight size={19} />
                </button>
                <div className="micro-proof"><div className="avatar-stack"><span>✦</span><span>★</span><span>✚</span></div><span>10 questions per level</span></div>
              </div>
              <div className="hero-stat-row">
                <div><strong>03</strong><span>levels</span></div>
                <div><strong>30</strong><span>puzzles</span></div>
                <div><strong>∞</strong><span>ways to practice</span></div>
              </div>
            </div>
            <div className="hero-art-wrap" aria-hidden="true">
              <img className="hero-art" src={ASSETS.hero} alt="" />
              <div className="hero-sticker sticker-one"><span>+</span><small>think</small></div>
              <div className="hero-sticker sticker-two"><span>×</span><small>play</small></div>
              <div className="hero-mascot-bubble"><img src={ASSETS.mascot} alt="" /></div>
            </div>
          </section>

          <section className="level-section" aria-labelledby="level-heading">
            <div className="section-heading">
              <div><span className="section-kicker">Choose your quest</span><h2 id="level-heading">Pick a level. Pick a pace.</h2></div>
              <p>Every quest has 10 questions. The sign choices stay the same — the clock gets bolder.</p>
            </div>
            <div className="level-grid">
              {LEVELS.map((entry) => (
                <button key={entry.id} className={`level-card level-${entry.id}`} onClick={() => startGame(entry.id)}>
                  <span className="level-card-top"><span className="level-icon">{entry.icon}</span><span className="level-badge">{entry.badge}</span></span>
                  <span className="level-eyebrow">{entry.eyebrow}</span>
                  <span className="level-title-row"><span className="level-title">{entry.name}</span><ChevronRight size={22} /></span>
                  <span className="level-description">{entry.description}</span>
                  <span className="level-symbols" aria-hidden="true"><span>+</span><span>−</span><span>×</span><span>÷</span></span>
                  <span className="level-footer"><span><Clock3 size={14} /> {entry.timer}s each</span><span>10 rounds</span></span>
                </button>
              ))}
            </div>
          </section>

          <section className="how-section">
            <div className="how-card">
              <img className="how-brand-stamp" src={ASSETS.logo} alt="" aria-hidden="true" />
              <div className="how-number">01</div><div><span className="section-kicker">How to play</span><h2>Read the equation. Trust your brain.</h2><p>Choose the sign that makes the two numbers equal the answer. Add, subtract, multiply, or divide — it’s your call.</p></div>
              <div className="sign-tray" aria-hidden="true"><span>+</span><span>−</span><span>×</span><span>÷</span></div>
            </div>
            <div className="tip-card"><span className="tip-stamp" aria-hidden="true">=</span><Lightbulb size={22} /><div><strong>Little tip</strong><p>Look for the fastest clue first: division always makes the number smaller.</p></div></div>
          </section>
        </main>
      )}

      {view === "quiz" && question && (
        <main className="quiz-view">
          <div className="quiz-topline"><button className="back-button" onClick={() => setView("home")}><ArrowLeft size={17} /> Change level</button><div className="quiz-level-label"><span className="level-dot" style={{ background: level.accent }} /> {level.name} quest</div><div className="question-count"><strong>{String(questionIndex + 1).padStart(2, "0")}</strong><span>/ 10</span></div></div>
          <div className="progress-track"><span style={{ width: `${progress}%`, background: level.accent }} /></div>

          <div className="quiz-layout">
            <aside className="quiz-rail">
              <div className="rail-card timer-rail-card" style={{ background: level.accentSoft }}>
                <div className="rail-label"><Clock3 size={16} /> Time left</div>
                <div className="timer-number" style={{ color: level.accent }}>{String(timeLeft).padStart(2, "0")}<span>s</span></div>
                <div className="timer-track"><span style={{ width: `${timerProgress}%`, background: level.accent }} /></div>
                <p>Think quick, smile quicker.</p>
              </div>
              <div className="rail-card score-rail-card"><div className="rail-label"><Trophy size={16} /> Your score</div><div className="rail-score">{formatScore(score)} <span>stars</span></div><div className="mini-stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill={index < Math.min(score, 5) ? "#F9C74F" : "none"} color={index < Math.min(score, 5) ? "#F9C74F" : "#C8C1BC"} />)}</div></div>
              <div className="rail-shortcut"><Zap size={16} /><span>Keyboard player?<br /><strong>Press 1, 2, 3, or 4</strong></span></div>
            </aside>

            <section className="question-stage">
              <div className="question-kicker"><span className="question-number">Question {questionIndex + 1}</span><span className="question-dots">{Array.from({ length: 10 }, (_, index) => <span key={index} className={index < questionIndex ? "done" : index === questionIndex ? "current" : ""} />)}</span></div>
              <div className={`question-card ${feedback ? `has-${feedback}` : ""}`}>
                <span className="card-tab">Find the missing sign</span>
                <div className="equation" aria-label={`${question.left} missing sign ${question.right} equals ${question.answer}`}><span>{question.left}</span><span className="missing-sign">?</span><span>{question.right}</span><span className="equals">=</span><span>{question.answer}</span></div>
                <p className="question-prompt">Which sign makes this true?</p>
                <div className="answer-grid">
                  {OPERATORS.map((operator, index) => {
                    const isSelected = chosenOperator === operator;
                    const isAnswer = question.operator === operator;
                    const stateClass = feedback && isAnswer ? "is-answer" : feedback && isSelected ? "is-wrong" : "";
                    return <button key={operator} className={`answer-button answer-${index + 1} ${stateClass}`} onClick={() => resolveAnswer(operator)} disabled={Boolean(feedback)}><span className="answer-key">{index + 1}</span><span className="answer-symbol">{operator}</span><span className="answer-label">{OPERATOR_LABELS[operator]}</span>{feedback && isAnswer && <Check className="answer-check" size={20} />}</button>;
                  })}
                </div>
                {feedback && <div className={`feedback-note feedback-${feedback}`}><span className="feedback-icon">{feedback === "correct" ? "✦" : feedback === "timeout" ? "⌛" : "↺"}</span><span>{feedback === "correct" ? "Nice one — your brain is on fire!" : feedback === "timeout" ? `Time's up! The answer was ${question.operator}.` : `Almost! The sign you needed was ${question.operator}.`}</span></div>}
              </div>
              <div className="question-footer"><span><Heart size={16} fill="#F36A5A" color="#F36A5A" /> Keep going — you’re building your math muscles.</span><span className="footer-confetti"><img src={ASSETS.confetti} alt="" /></span></div>
            </section>
          </div>
        </main>
      )}

      {view === "results" && (
        <main className="results-view">
          <section className="results-card">
            <img className="results-confetti" src={ASSETS.confetti} alt="" aria-hidden="true" />
            <div className="results-mascot"><img src={ASSETS.mascot} alt="" /></div>
            <span className="section-kicker">Quest complete</span>
            <h1>You made math <em>move!</em></h1>
            <p className="results-lede">That was a brilliant {level.name.toLowerCase()} round. Here’s your star count.</p>
            <div className="score-orbit"><div className="score-orbit-inner"><strong>{score}</strong><span>out of 10</span></div></div>
            <div className="results-stats"><div><strong>{answered}</strong><span>answered</span></div><div><strong>{score === 10 ? "100%" : `${score * 10}%`}</strong><span>accuracy</span></div><div><strong>{level.name}</strong><span>level</span></div></div>
            <div className="results-actions"><button className="primary-button" onClick={restartSameLevel}><RotateCcw size={18} /> Play again</button><button className="secondary-button" onClick={() => setView("home")}>Choose another level <ArrowRight size={17} /></button></div>
          </section>
        </main>
      )}

      <footer className="site-footer"><span>Made for curious minds</span><span className="footer-rule" /><span>Math Sign Quest <span className="footer-spark">✦</span></span></footer>
    </div>
  );
}
