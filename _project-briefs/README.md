# Project briefs — how the work is split across Cowork projects

Created 2026-08-30.

## Why this folder exists

Everything used to live in one Cowork project ("A priyam ka patora"), so a chat about
Ecommerce Hub backend architecture and a chat about pathology-lab pricing shared the same
context and bled into each other. The fix is **one Cowork project per venture**, with the
Patora project kept as the overall handler.

**Every project connects the same folder** — `/Users/priyamrupapara/developer/A priyam ka patora`
— so every project can read and write the whole Obsidian vault. Nothing is duplicated. What
differs between projects is only the **project instructions**, which are the files in this folder.

This folder sits at the repo root, deliberately **outside** the Obsidian vault subfolder, so the
vault's "exactly one file per idea folder" rule in `A priyam ka patora/AI Collaboration Rules.md`
stays untouched.

## How to set one up (30 seconds each)

1. In the Claude desktop app, create a new project. Name it as listed below.
2. Connect the folder `/Users/priyamrupapara/developer/A priyam ka patora`.
3. Open the matching file in this folder, copy its whole contents, paste into the project's
   instructions/description field.
4. Start chats inside that project. Each chat is a clean context; the project instructions tell
   Claude which vault file is its source of truth.

## The projects

| Project name | Brief file | Vault source of truth | Status |
|---|---|---|---|
| **Patora — Hub** | `00-patora-hub.md` | `Roadmap.md` | Overall handler: ranking, cross-idea decisions, new ideas, vault upkeep |
| **Ecommerce Hub** | `01-ecommerce-hub.md` | `Startup Ideas/03 - Ecommerce Hub/Ecommerce Hub.md` | 🟡 Active — validation in progress |
| **Pathology Lab Ops** | `02-pathology-lab.md` | `Startup Ideas/02 - Pathology Lab Ops Assistant/Pathology Lab Ops Assistant.md` | 🟡 Active — #1 priority, has a paying customer |
| **Algo Trading Bot** | `03-algo-trading-bot.md` | `General Ideas/01 - Algo Trading Bot/Algo Trading Bot.md` | 🔵 Parked |
| **AI for Defence** | `04-ai-for-defence.md` | `Startup Ideas/04 - AI for Defence/AI for Defence.md` | ⬜ Undefined — needs a description before anything else |
| **Other AI Ideas** | `05-other-ai-ideas.md` | `Startup Ideas/01 - AI Chatbot Assistant/…` + `05 - Vertical Ops Assistant …` | ⚠️/🔴 Both largely dead; kept for revival attempts |

## One honest caveat before you build all six

Six projects for a solo founder working a few hours a week is a lot of surface area. Four of the
six (Algo Trading Bot, AI for Defence, Other AI Ideas, and arguably the Hub) are parked, dead, or
undefined — projects for them will mostly sit empty, and empty projects add navigation cost
without adding focus.

**Recommendation: create three now** — Patora Hub, Ecommerce Hub, Pathology Lab. Those are the
only ones with live work. Create the other three the day you actually pick one of those ideas
back up; the brief files are written and waiting, so it costs you 30 seconds then. Building all
six today is organising, not progress — the same trap as renaming an unvalidated product.

## Splitting chats *inside* a project

This is the part that solves your actual problem. Within the Ecommerce Hub project, run separate
chats per workstream and name them plainly:

- `EH — Founder validation`
- `EH — UI/UX`
- `EH — Backend & data model`
- `EH — Naming & brand`
- `EH — Fundraising & investor materials`

Each brief below lists its own suggested chat split. The project instructions give every one of
those chats the same shared grounding (which vault file to read, what the current verdict is),
while the chats themselves stay separate — which is exactly the "doesn't all merge" you wanted.
