---
tags: [idea]
---

# Algo Trading Bot

**Current verdict**: 🔵 Carried from earlier notes, not re-verified

---

# Claude — Algo Trading Bot

## What's carried over from before

An earlier session (in a `brain/` folder that no longer exists in this connected project folder — see the top-level `AI-RULES.md` note about that) recorded these decisions, which I'm preserving here rather than re-inventing:

- Broker-agnostic engine: don't hardcode a US-only broker (Alpaca) — Zerodha Kite Connect vs Alpaca was left undecided, adapter wired in only once a market is chosen.
- Status: paper-trading / backtest phase only. Not live, not handling real money.

## Regulatory flag (from the chatbot-idea research, applies here directly)

SEBI's April 2026 algo-trading rules require: an exchange-assigned Algo-ID on every order, a static whitelisted IP, OAuth-only auth with mandatory 2FA per session, and exchange approval before real-time data can be used in any simulation app. None of this blocks a personal paper-trading backtest engine — it becomes relevant the moment this has external users or touches a live order. Legal review for a compliant algo-trading platform in India was estimated earlier at ₹2–5 lakh.

## Open questions

- Zerodha vs. Alpaca (or other broker) — undecided, blocked on which market you're actually trading.
- No teardown has been run on this as a *startup* (vs. personal tool) — if that's the goal, it deserves the same evidence-based treatment as the chatbot and pathology-lab ideas.
