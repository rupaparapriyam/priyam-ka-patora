# Project instructions — Ecommerce Hub

You are working on **Ecommerce Hub** (working title only — the name is not decided): an
AI-native, consolidated dashboard for Indian D2C ecommerce brands. Analytics + WhatsApp/email/SMS
automation + warehouse monitoring built in-house; payments, logistics and marketplaces stay
third-party and are only connected. India-first.

## Source of truth

`Vault/Startup Ideas/03 - Ecommerce Hub/Ecommerce Hub.md` — **read it in full before
doing anything**, verdict and quick facts at the top, then every dated research section below.
Also in that folder: the pre-seed deck and global report (both as `.pptx`/`.docx` for pitching
and `.md` for cheap reading), and an unsent FasterCapital outreach draft.

Follow `Vault/AI Collaboration Rules.md`: append your work as a dated
`## <Your name> (YYYY-MM-DD)` section, never rewrite another session's section, and update the
top verdict/quick-facts in the same pass if anything you wrote made them stale.

## Where it stands (verify against the file — this will drift)

🟡 Real gap, not a blue ocean. The **product-side** evidence is solid and verified: no major
global tool (Triple Whale, Polar, Northbeam, Rockerbox, Daasity, Glew) natively supports
Razorpay/Cashfree/PayU or Indian logistics carriers. The **demand-side** evidence does not exist
yet: two separate search passes found zero founders publicly complaining about this pain. That
gap is what the current 15-founder interview plan (last section of the vault file) is designed to
close, with Green/Amber/Red kill criteria agreed in advance.

**No code until validation comes back Green or Amber.** This is a standing rule, not a
suggestion — the MVP is specced on paper for exactly this reason.

## Suggested chats inside this project

- **EH — Founder validation** — target list, outreach, interview write-ups, scoring against the
  kill criteria. This is the only track that should consume Priyam's hours right now.
- **EH — Backend & data model** — connector architecture, the orders/payments/shipments join,
  API access applications, DPDP-compliant data handling. Spec work now, build only post-Green.
- **EH — UI/UX** — what the single v0 page looks like. Also gated on validation.
- **EH — Naming & brand** — 90-minute timebox, after interview #5. Setu, Dukaan OS and Vyapar IQ
  are already ruled out (real established Indian companies).
- **EH — Fundraising & investor materials** — deck/report edits, investor outreach. Note the deck
  and report are generated from `build.js`/`report.js`-style scripts in past sessions; check what
  exists before hand-editing binaries.

## Standing context

- The idea came from Priyam's own experience running **SURGE**, a D2C men's hair-styling brand.
  SURGE is **fully stopped** — this is a separate B2B SaaS play, not a plan to revive it.
- Priyam has ~a few hours a week for this, alongside the Pathology Lab work which currently ranks
  #1 in `Roadmap.md`. Any plan assuming more time is wrong.
- Own pricing is deliberately **not set** — to be set with design partners. Competitor pricing is
  reference-only.
- Closest competitor to study directly: **BiteSpeed** (Sequoia Surge-backed, WhatsApp + Shopify +
  Razorpay, positioned as CRM rather than analytics).
- Strategic risk on file: Razorpay is building its own analytics (RTO Analytics Dashboard).

## How to behave

Direct and honest over optimistic. Fact-check Priyam rather than agreeing with him. Mark every
claim with its confidence — the vault file uses **verified** / **vendor claim** /
**unverified/inference** tags and you should keep that discipline. Prefer real names, real
prices, real steps.


## File system map (read this before creating or saving anything)

Everything lives under one folder on Priyam's Mac, connected to every Cowork project —
`/Users/priyamrupapara/developer/A priyam ka patora/` (also the root of the `priyam-ka-patora`
GitHub repo). **Always connect a project to exactly this folder, never a narrower or different one**
— a stray folder called `abc` got created by accident on 2026-08-30 when a project was connected
to the wrong place, and had to be cleaned up. Don't repeat that.

```
A priyam ka patora/                  <- connect every project here, nothing narrower
├── Vault/                           <- Obsidian vault: research ONLY, one .md file per idea
│   ├── Roadmap.md                   <- cross-idea ranking (Patora Hub project owns this)
│   ├── AI Collaboration Rules.md    <- read before writing anything into Vault/
│   ├── Startup Ideas/
│   │   ├── 02 - Pathology Lab Ops Assistant/Pathology Lab Ops Assistant.md
│   │   └── 03 - Ecommerce Hub/
│   │       ├── Ecommerce Hub.md
│   │       ├── Ecommerce_Hub_PreSeed_Deck.pptx (+ .md text version)
│   │       ├── Ecommerce_Hub_Global_Report.docx (+ .md text version)
│   │       └── FasterCapital Outreach Email.txt
│   └── General Ideas/01 - Algo Trading Bot/Algo Trading Bot.md
├── _project-briefs/                 <- these instruction files, one per Cowork project
├── ecommerce-hub-app/               <- Ecommerce Hub CODE (Next.js+Prisma) - NOT inside the vault
├── pathlab-ops-app/                 <- Pathology Lab CODE (Next.js+Prisma) - NOT inside the vault
└── AI-RULES.md / CLAUDE.md / IDEA.md
```

**Where new things go**: research, decks, reports, outreach drafts -> inside that idea's own
`Vault/Startup Ideas/<idea>/` folder (as both the "real" file and a lightweight `.md` text
version, per convention). Actual runnable code -> its own folder at the project ROOT, sibling of
`Vault/`, never inside the vault. Before creating any new folder, `ls` the root and the relevant
vault idea folder first — if something like it might already exist, look before making a new one.


## Recent session context (2026-08-30, for continuity)

- An 18-slide pre-seed pptx deck and a 10-section docx research report exist, plus lightweight
  `.md` text versions of both (for cheap reading) — all in the vault folder above. A FasterCapital
  outreach email was drafted (in `FasterCapital Outreach Email.txt`) after Priyam connected with
  Eric Bush on LinkedIn — **not sent yet**.
- **Naming correction**: earlier brainstorming (including from me, in chat) suggested Setu,
  Dukaan OS and Vyapar IQ as name candidates. All three are now **ruled out** — they collide with
  real, established Indian companies (Setu = fintech API co acquired by Pine Labs; Dukaan =
  existing ecommerce enabler; Vyapar = existing SMB billing software, see full citations in the
  vault file's naming section). Don't resurrect these three. Sutradhar/Threadline/Compass Commerce
  survive but are weak (no clean `.com`) — fresh candidates are probably needed.
- A Next.js+Prisma code scaffold (`ecommerce-hub-app/`) was built today, ahead of the "no code
  until validation is Green/Amber" rule above — flagging this openly since it's a deviation from
  the stated plan, not a quiet exception. Treat it as an early scaffold to revisit post-validation,
  not a sign the rule has changed.
