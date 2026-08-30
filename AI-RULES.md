# AI Rules for This Project Folder

**Source of truth for ideas is the Obsidian vault**, in this same folder: `Vault/`. Specifically:

- `Vault/Startup Ideas/` and `Vault/General Ideas/` — every startup and side idea, one subfolder each.
- `Vault/AI Collaboration Rules.md` — the full convention: one file per AI per idea (`claude.md`, `antigravity.md`, ...), read-all/write-your-own.

If you're an AI tool working directly in this project folder (not through Obsidian), go read that rules file before touching anything under `Vault/`.

## Note on this project folder's own history

An earlier session recorded a full `brain/` structure with `.git`, `CLAUDE.md`, and `.gemini/rules/project_rules.md` at the root of this project folder. As of 2026-08-26 that structure is **not present here** — this folder currently only contains the Obsidian vault, a `.env`, a `.firecrawl` folder, and this file. Whether that repo was moved, deleted, or lives elsewhere on disk hasn't been confirmed — worth checking with Priyam rather than assuming either way.

A leftover, unrelated `abc/` folder (a small duplicate `brain/`+`CLAUDE.md` experiment, not part of the current taxonomy) was found nested inside this project folder and moved to `_to_delete/` on 2026-08-26.

## Multi-project setup (added 2026-08-30)

The work is no longer done from a single Cowork project. It's split into one project per venture
— Patora (Hub), Ecommerce Hub, Pathology Lab Ops, Algo Trading Bot, AI for Defence, Other AI
Ideas — so that separate workstreams (e.g. Ecommerce Hub UI/UX vs. backend) don't share context
and bleed into each other.

**All projects connect this same folder** and can read/write the whole vault. The only thing that
differs is each project's instructions, which live in `_project-briefs/` at this folder's root
(deliberately outside the Obsidian vault subfolder, so the vault's one-file-per-idea rule is
untouched). See `_project-briefs/README.md` for the map, the setup steps, and which projects are
actually worth creating today.

If you are an AI session and you don't know which project you're in, the answer is in your
project instructions — and either way, `Vault/AI Collaboration Rules.md` still
governs every write into the vault.
