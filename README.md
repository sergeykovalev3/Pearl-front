<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-087EA4?style=for-the-badge&logo=react&logoColor=white" alt="React" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://sass-lang.com"><img src="https://img.shields.io/badge/Sass-C6538C?style=for-the-badge&logo=sass&logoColor=white" alt="Sass" /></a>
  <a href="https://motion.dev"><img src="https://img.shields.io/badge/Motion-FF0055?style=for-the-badge&logo=framer&logoColor=white" alt="Motion" /></a>
</p>

<h1 align="center">Pearl Front</h1>

<p align="center">
  <strong>Marketing site and patient-facing UI for Pearl Dental Care.</strong><br />
  Built with the Next.js App Router, modular sections, and a companion REST API for auth, bookings, and lead capture.
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#getting-started">Getting started</a> ·
  <a href="#environment">Environment</a> ·
  <a href="#backend">Backend</a> ·
  <a href="#repositories">Repositories</a>
</p>

---

## Overview

Pearl Front is a multi-route clinic website: landing narrative, services detail pages, blog listings and articles, About/Contact flows, authentication screens, and legal pages. Layout stays consistent via a shared header/footer; sections lean on SCSS modules and light motion for scroll-driven polish without sacrificing readability.

## Features

| Area | Details |
|------|---------|
| **Pages** | Home, Services (+ dynamic slug), Blogs (+ slug), About, Contact, Login/Register/Profile, Privacy/Terms |
| **Motion** | [`motion`](https://motion.dev) for orchestrated reveals and carousels; respects `prefers-reduced-motion` |
| **API integration** | Cookie-aware `fetch` for auth and appointments; public POST for marketing leads (`NEXT_PUBLIC_API_URL`) |
| **Typography** | Local **General Sans** via `next/font/local` |

## Getting started

```bash
git clone https://github.com/sergeykovalev3/Pearl-front.git
cd Pearl-front
pnpm install
pnpm dev
```

Open **http://localhost:3000**.

Production build:

```bash
pnpm build
pnpm start
```

## Environment

Copy **`.env.example`** to **`.env.local`** (Next loads it automatically):

| Variable | Purpose |
|----------|---------|
| **`NEXT_PUBLIC_API_URL`** | Public base URL of the Pearl API: **include `https://` or `http://`**, no trailing slash. If unset, defaults to `http://localhost:4000`. If you set only a hostname (e.g. Railway URL without a scheme), the app prepends `https://` for non-local hosts so the browser does not treat the API as a path on the front-end domain. |

The browser must call an origin allowed by the API **`CORS_ORIGIN`** and use **`credentials: "include"`** where the backend sets httpOnly cookies.

## Backend

This UI expects **[Pearl-back](https://github.com/sergeykovalev3/Pearl-back)** — Fastify + Prisma + PostgreSQL.

```bash
git clone https://github.com/sergeykovalev3/Pearl-back.git
```

Run the API locally or via Docker per that repo’s README; point **`NEXT_PUBLIC_API_URL`** at it.

## Repositories

| | URL |
|--|-----|
| **This site (Pearl-front)** | [github.com/sergeykovalev3/Pearl-front](https://github.com/sergeykovalev3/Pearl-front) |
| **Pearl API (Pearl-back)** | [github.com/sergeykovalev3/Pearl-back](https://github.com/sergeykovalev3/Pearl-back) |

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server (Webpack bundler flag matches project setup) |
| `pnpm build` | Production build |
| `pnpm start` | Serve production output |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier write |

---

<p align="center">
  <a href="https://github.com/sergeykovalev3/Pearl-front"><strong>Pearl-front</strong></a>
  ·
  <a href="https://github.com/sergeykovalev3/Pearl-back"><strong>Pearl-back</strong></a>
</p>
