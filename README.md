# 🕵️ Case Closed — Detective Mystery Game

<img width="800" height="360" alt="Screen Recording 2026-05-15 165828" src="https://github.com/user-attachments/assets/9d91f4b7-2b16-479e-9eb2-3f17bcd4d584" />

An immersive detective mystery game built with **React + TypeScript** where players investigate a murder case, collect forensic evidence, interrogate suspects, analyze clues, and solve a corporate conspiracy.

---

# 🎮 Game Overview

**Case Closed** is a story-driven detective investigation game set in Mumbai.

You play as a detective investigating the murder of:

> Rajesh Khanna — CEO of Apex Bank

Your mission:

- Investigate crime scenes
- Collect evidence
- Analyze forensic reports
- Interrogate suspects
- Connect clues
- Arrest the real killer before time runs out

---

# ✨ Features

## 🔍 Investigation System
- Explore multiple locations
- Discover hidden evidence
- Dynamic clue progression

## 🧪 Forensic Analysis
- DNA analysis
- Fingerprint matching
- Blood spatter analysis
- Digital evidence investigation

## 🧠 Clue Board
- Visual suspect connections
- Evidence linking system
- Timeline reconstruction

## 🗣 Interrogation Engine
- Interactive suspect questioning
- Pressure system
- Confession mechanics
- AI-style dialogue behavior

## ⏱ Time Pressure Gameplay
- Countdown investigation timer
- Multiple endings
- Reputation & rank system

---

# 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React | UI Framework |
| TypeScript | Type Safety |
| useState | State Management |
| useEffect | Game Lifecycle |
| SVG | Clue Board Visualization |
| Inline CSS | Styling |

---

# 📂 Project Structure

```bash
src/
│
├── detective_game.tsx
│
├── DATABASES
│   ├── EVIDENCE_DB
│   ├── SUSPECTS_DB
│   ├── LOCATIONS_DB
│   └── LOG_TEMPLATES
│
├── COMPONENTS
│   ├── MiniMap
│   ├── EvidenceCard
│   ├── SuspectCard
│   ├── ClueBoard
│   └── Timeline
│
└── MAIN GAME
    └── DetectiveGame
```

---

# 🧩 Main Game Systems

## 📦 Evidence System

Stores:
- Evidence ID
- Description
- Category
- Analysis results
- Leads to suspects

Example:

```ts
fingerprint_glass: {
  id: "fingerprint_glass",
  name: "Whiskey Glass Print",
  category: "forensic",
  rarity: "common"
}
```

---

## 👥 Suspect System

Each suspect contains:
- Role
- Motive
- Alibi
- Interrogation questions
- Confession state
- Evidence breakpoints

Example:

```ts
priya: {
  name: "Priya Sharma",
  role: "CFO",
  guilty: true
}
```

---

## 🗺 Location System

Locations contain:
- Description
- Atmosphere
- Evidence available

Game locations:
- Crime Scene
- Forensic Lab
- Police Station
- Apex Bank HQ
- Abandoned Warehouse

---

## 📈 Reputation System

Player rank changes based on investigation quality.

Ranks include:

- Constable
- Inspector
- Senior Inspector
- Superintendent

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/case-closed-game.git
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Start Development Server

```bash
npm run dev
```

---

# 🧠 Core React Concepts Used

This project is beginner-friendly for learning React.

## ✅ useState

Used for:
- Game state
- Timer
- Evidence tracking
- Interrogation logs

Example:

```tsx
const [screen, setScreen] = useState("intro");
```

---

## ✅ useEffect

Used for:
- Timer countdown
- Auto scrolling logs
- Lifecycle management

Example:

```tsx
useEffect(() => {
  console.log("Game Started");
}, []);
```

---

## ✅ Components

Reusable UI blocks:
- EvidenceCard
- SuspectCard
- MiniMap

---

## ✅ Props

Passing data between components.

Example:

```tsx
<EvidenceCard ev={evidence} />
```

---

# 🎯 Learning Outcomes

By studying this project, beginners can learn:

- React fundamentals
- Component architecture
- State management
- Conditional rendering
- Dynamic UI rendering
- Array mapping
- Event handling
- Game logic design
- TypeScript object structures

---

# 🧪 Example Gameplay Flow

```text
Start Investigation
      ↓
Visit Crime Scene
      ↓
Collect Evidence
      ↓
Analyze Evidence
      ↓
Interrogate Suspects
      ↓
Connect Clues
      ↓
Arrest Killer
      ↓
Multiple Endings
```

---

# 🔥 Advanced Features

## Dynamic Evidence Linking

Evidence automatically connects suspects through:

```ts
leads: ["priya"]
```

---

## Multiple Endings

Possible endings:
- Perfect Ending
- Good Ending
- Partial Ending
- Wrong Arrest
- Unsolved Case

---

# 📸 Screens Included

- Investigation UI
- Clue Board
- Interrogation Room
- Evidence Locker
- Timeline Reconstruction

---

# 💡 Beginner Tips

If you're new to programming:

✅ Start by understanding:
- Components
- useState
- Props

✅ Then move to:
- Array mapping
- Conditional rendering
- Game logic

✅ Finally explore:
- Complex state systems
- Dynamic interactions
- AI-style dialogue flow

---

# 📚 Recommended Learning Path

1. Learn JSX
2. Learn Components
3. Learn useState
4. Learn Props
5. Learn useEffect
6. Study this project structure
7. Build your own mini detective game

---

# 🤝 Contributing

Pull requests are welcome.

Ideas:
- Add sound effects
- Add save/load system
- Add multiplayer detective mode
- Add inventory animations
- Add mobile responsiveness

---

# 📄 License

MIT License

---

# 👨‍💻 Author

Built with ❤️ using React + TypeScript

---

# ⭐ Support

If you like this project:

- Star the repository
- Fork the project
- Share with developers

---

# 🕶 Final Note

> “Every clue tells a story. Every suspect hides a truth.”

Happy Investigating Detective 🚔

## Made with claude 

<img width="480" height="480" alt="ClaudeGIF" src="https://github.com/user-attachments/assets/da6df09f-6057-452b-bef1-bb2faf60770c" />
