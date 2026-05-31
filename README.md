# 📋 Kanban Board

A responsive, fully client-side Kanban board built with vanilla JavaScript, Tailwind CSS, and Day.js. No frameworks, no build step — just open `index.html` in a browser.

![Kanban Board](https://img.shields.io/badge/status-active-brightgreen) ![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

---

## ✨ Features

### Core
- **3 columns** — Todo, Doing, Done
- **Add tasks** via the quick-add modal (top bar) or inline column form
- **Delete tasks** from the card options menu
- **Drag & drop** cards between columns using the HTML Drag & Drop API
- **localStorage persistence** — tasks and boards survive page refresh

### Task Details
- **Priority labels** — Low / Medium / High with color-coded badges
- **Due dates** with smart relative labels: Today, Tomorrow, `Xd overdue`
- **Inline editing** — click Edit in the card menu, press Enter to save or Escape to cancel

### Boards
- **Multiple boards** — create as many boards as you need
- **Delete boards** — remove a board via the `×` on its tab (at least one board is always kept)
- **Board switching** — tabs in the top bar

### UI
- **Stats bar** showing total tasks, per-column counts, and high priority count
- **Progress bar** on the Done column tracking overall completion percentage
- **Empty state** — "No tasks yet" shown when a column is empty
- **Column drag highlight** — visual feedback when dragging over a valid drop target
- **Responsive layout** — works on mobile and desktop
- **Dark theme** with a custom Tailwind color palette

---

## 🚀 Getting Started

No installation or build step required.

```bash
git clone https://github.com/your-username/kanban-board.git
cd kanban-board
open index.html   # or just double-click the file
```

---

## 🗂️ Project Structure

```
kanban-board/
├── index.html          # Markup, modals, Tailwind config, CDN links
├── kanban-board.js     # All app logic (state, rendering, drag & drop)
├── kanban-board.css    # Minimal overrides (drag styles, scrollbar, card edit input)
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure and drag & drop API |
| [Tailwind CSS](https://tailwindcss.com) (CDN) | All styling via utility classes |
| Vanilla JavaScript (ES6+) | App logic, DOM rendering, state management |
| [Day.js](https://day.js.org) (CDN) | Due date parsing and relative label formatting |
| [Tabler Icons](https://tabler.io/icons) (CDN) | Icon set |
| [DM Sans + DM Mono](https://fonts.google.com) | Typography |
| `localStorage` | Client-side data persistence |

---

## 🧱 Data Structure

Tasks are stored as an array of objects inside each board:

```js
// localStorage key: 'kb_tw_v1'
[
  {
    id: 'board1',
    name: 'My Workspace',
    tasks: [
      {
        id: 't1704067200000abc',
        title: 'Design wireframes',
        status: 'todo',      // 'todo' | 'doing' | 'done'
        priority: 'medium',  // 'low' | 'medium' | 'high'
        due: '2025-07-01',   // 'YYYY-MM-DD' or ''
      }
    ]
  }
]
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Enter` | Submit the focused form (add task, create board) |
| `Escape` | Close the open modal or cancel inline edit |
| `Shift + Enter` | Insert a newline in a textarea (inline edit or add form) |

---

## 📸 Screenshots

> Add screenshots here after cloning and running locally.

---

## 📄 License

MIT — free to use, modify, and distribute.
