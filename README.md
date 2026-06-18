# Panelix — Next.js 14 Admin Dashboard

A premium admin dashboard theme built with **Next.js 14**, **Tailwind CSS**, **shadcn/ui**, React 18, Recharts, and Lucide icons.

## Features

- Next.js 14 App Router with `src/` directory structure
- Tailwind CSS + shadcn/ui component system
- Light & dark mode via `next-themes` (persisted to localStorage)
- 23 demo pages: Dashboard, Analytics, Orders, Forms, Tables, Charts, Modals, Kanban, Notifications, and more
- Responsive sidebar with collapsible navigation groups
- Production-ready folder organization for commercial themes

## Getting Started

```bash
npm install
npm run dev
```

Open **http://localhost:3000**

## Project Structure

```
panelix-nextjs/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout (ThemeProvider + Shell)
│   │   ├── globals.css               # Tailwind + theme tokens + demo styles
│   │   ├── page.js                   # Dashboard (/)
│   │   └── [route]/page.js           # Feature demo pages
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives (Button, Card, Dialog…)
│   │   ├── layout/                   # Shell, Sidebar, Topbar
│   │   ├── dashboard/                # ChartTip, StatCard, Placeholder, etc.
│   │   └── providers/                # ThemeProvider (next-themes)
│   ├── config/
│   │   └── site.ts                   # Brand name, metadata, links
│   ├── hooks/
│   │   └── use-mobile.ts             # Responsive breakpoint hook
│   └── lib/
│       ├── utils.ts                  # cn() helper
│       ├── nav.ts                    # Sidebar config + breadcrumbs
│       └── data.js                   # Mock chart/table data
├── components.json                   # shadcn/ui configuration
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.js
```

## Available Scripts

| Command         | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Start dev server on port 3000 |
| `npm run build` | Production build              |
| `npm run start` | Start production server       |
| `npm run lint`  | Run ESLint                    |

## Tech Stack

- **Next.js** 14.2.5 (App Router, `src/` directory)
- **React** 18.3.1
- **Tailwind CSS** 3 + **shadcn/ui**
- **next-themes** for dark mode
- **Recharts** 2.12.7
- **Lucide React** 0.400.0

## Customization

### Theme colors

Edit CSS variables in `src/app/globals.css` (`--primary`, `--background`, etc.). shadcn tokens automatically flow into all UI components.

### Navigation

Edit `src/lib/nav.ts` to add routes or rearrange the sidebar.

### Add shadcn components

```bash
npx shadcn@latest add [component]
```

### Add a new page

1. Create `src/app/your-route/page.js`
2. Add entries to `NAV` and `PAGE_TITLES` in `src/lib/nav.ts`

## License

For demonstration purposes. Adapt freely.
