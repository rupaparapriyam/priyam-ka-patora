# Ecommerce Hub

Working title — name not finalized (candidates: Setu, Sutradhar, Dukaan OS,
Vyapar IQ, Threadline, Compass Commerce). See the vault note for the current
status of that decision.

One dashboard for India's D2C brands: GA4, ads, WhatsApp, payment gateways,
and logistics carriers pulled into one place, with plain-language
cross-channel explanations instead of six separate dashboards.

## Full research, pitch deck, and status

All of the product research, market/competitive analysis, the pre-seed pitch
deck, and the current verdict/status live in the vault, not here:

`../Ecommerce Hub.md`

Read that file before making product decisions here — it has the verified
vs. inferred facts, the MVP scope, the connector landscape, and what's
already been ruled out.

## Stack

Next.js 15 + TypeScript + Prisma (SQLite for now) + Tailwind — same stack as
the sibling `pathlab-ops` project, for consistency.

## MVP scope (per the vault research)

GA4 + one payment gateway (Razorpay) + one logistics carrier (Shiprocket).
Everything else in the Prisma schema's `ConnectorCategory` enum is the
expansion map, not day-one build scope.

## Note on location

This app now lives inside the vault, next to the research note, instead of
as a standalone folder under `developer/`. If this is connected as a Claude
Desktop Project, repoint that Project's connected folder to this new path.
