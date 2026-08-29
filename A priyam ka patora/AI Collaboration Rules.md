---
tags: [rules, meta]
---

# AI Collaboration Rules

This file governs how any AI tool (Claude, Antigravity, or others added later) works inside this vault. Read this before editing anything here.

**Updated 2026-08-27**: one file per idea now. This started as per-AI files (`- Claude.md` / `- Antigravity.md`), then became a two-file split (`- Overview.md` + `- Research.md`) — both were more clicking and more files than the vault needed. New convention below.

## Folder taxonomy

- **Startup Ideas/** — ideas meant to become a real business: currently AI Chatbot Assistant, Pathology Lab Ops Assistant, E-Commerce Hub, AI for Defence, and Vertical Ops Assistant (Other Industries — finance, CA/accounting, logistics, etc., generalizing the pathology-lab pattern). Add a new numbered folder here for each new startup idea as it comes up.
- **General Ideas/** — everything else: side tools, personal-use projects, things that aren't meant to be a company. Currently Algo Trading Bot.

## Per-idea folder structure and naming

Every idea folder contains exactly **one file**, named after the idea itself — e.g. `Startup Ideas/01 - AI Chatbot Assistant/AI Chatbot Assistant.md`. That single file holds the current verdict at the top, then the full research below it. Nothing else lives in an idea's folder.

The pattern for a new idea folder called "X" is always: one file, `X.md`.

## The core rule

**One file per idea. Everyone — every AI, and Priyam — writes to the same file, attributed by heading, not by a separate file.** When you add research, start your addition with a `## <Your name> (date)` heading (e.g. `## Claude (2026-08-27)`) so it's clear who wrote what and when, then write underneath it. Don't delete or rewrite another AI's section — append, or add a dated update section if something needs correcting.

**The top-of-file summary is not optional bookkeeping — keep it in sync every single time, not just when something "big" changes.** The top of the file (`**Current verdict**:` line, plus a `Quick facts` section if one exists) is the only part most people — and most future AI sessions — will actually read before diving into the dated log below. If it goes stale, the file *looks* organized (it has headings) while actually being useless, because the summary contradicts the real current state buried in later sections. Concretely: any time a session adds a dated section that changes the verdict, the pricing, the ask, the name, the scope, or any other fact already stated at the top, that same session updates the top summary in the same pass — don't leave it for a later session to notice and fix.

When you (any AI) start working on an idea:
1. Read the idea's single `.md` file in full — verdict/quick facts at the top, all prior research from every AI below it.
2. Add your new work as a new `## <Your name> (date)` section at the end.
3. Before finishing, re-read the top summary against what you just wrote. If any of it is now stale or contradicted by your new section, rewrite the `**Current verdict**:` line and the `Quick facts` section (if present) to match reality — in the same edit, not as a follow-up task.

## New ideas

When Priyam describes a new idea: pick the right top-level category (Startup Ideas if it's meant to become a business, General Ideas otherwise), create a new numbered folder named after the idea, and create one file, `<Idea Name>.md`, with a `**Current verdict**:` line at the top (even if it just says "not yet researched") and research below. That's the whole folder.

## Changelog (structural decisions, most recent first)

- **2026-08-29**: clarified the core rule — keeping the top-of-file verdict/quick-facts summary in sync is mandatory on every edit that changes a stated fact, not just "big" verdict changes. Prompted by Ecommerce Hub's summary going stale for a full day of edits while the dated log below it kept moving.
- **2026-08-27**: removed the `Memory/` (Sessions Log) and `Crews/` folders entirely, at Priyam's request — no separate meta/session folders, strictly one folder per idea/project. This changelog replaces that function in compact form.
- **2026-08-27**: merged `- Overview.md` + `- Research.md` into a single `<Idea>.md` per folder — one file per idea, verdict at top, research below.
- **2026-08-27**: retired per-AI files (`- Claude.md` / `- Antigravity.md`) in favor of one shared file per idea (see above).
- **2026-08-27**: removed the `General Ideas/Legacy - Personal Business OS` folder — too common/generic an idea, at Priyam's request.
- **2026-08-26**: vault restructured around `Startup Ideas/` and `General Ideas/`, replacing the earlier `Ideas/`/`Projects/` layout.
