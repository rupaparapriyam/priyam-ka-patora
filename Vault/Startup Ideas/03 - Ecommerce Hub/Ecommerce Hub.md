---
tags: [idea]
---

# Ecommerce Hub

**Current verdict**: 🟡 Real gap, not a blue ocean — narrow to India-first wedge, not a full clone. Same core thesis as the original research (below), now folded into a live pitch: **the pain is genuine** (juggling GA4, ads, WhatsApp, payments, logistics, marketplaces separately across 8+ tools), **"AI explains your data" alone isn't a differentiator** (Polar Analytics, Lifesight already ship it), and **the real verified gap is India-native data** — no major global tool (Triple Whale, Polar, Northbeam, Rockerbox, Daasity, Glew) natively supports Razorpay/Cashfree/PayU or Indian logistics carriers. Closest competitor: **BiteSpeed** (WhatsApp+Shopify+Razorpay, positioned as CRM not analytics).

**Status as of 2026-08-29 (end of day)**: no longer just desk research — Priyam is now in active conversations with D2C brand founders (pressure-testing the feature set) and has reached out to investors (FasterCapital, via a LinkedIn connection with Eric Bush). A full 18-slide pre-seed deck and 10-section global research report exist (see **Files in this folder** below), positioned as "one dashboard instead of 10 tools," explicitly NOT a payments/logistics company (those stay third-party/"out-house"; WhatsApp/email-SMS automation/warehouse monitoring are in-house). Product/company name is **still undecided** — "Ecommerce Hub" is a working title only; candidate names discussed but not chosen (three since ruled out — see below): Setu, Sutradhar, Dukaan OS, Vyapar IQ, Threadline, Compass Commerce. Own pricing not set yet — deliberately, pending founder conversations. **Next concrete step (planned 2026-08-30, see the execution-plan section at the end of this file)**: run 15 scored founder interviews over two weeks — target segment (₹10L–₹2Cr/month GMV, Shopify/Woo, running paid ads), sourcing channels, an eight-question Mom-Test script and explicit Green/Amber/Red kill criteria are all now written down. The decisive test is behavioural: how many founders have already built their own sheet/script to stitch this data together. No code until the result is Green or Amber; MVP is specced on paper only. A Next.js+Prisma scaffold (`ecommerce-hub-app/` at the repo root) was nonetheless created on 2026-08-30 ahead of that gate — recorded openly as a deviation, not a change to the rule; its schema does not match the specced v0 job and would need replacing, not extending. Naming is timeboxed to 90 minutes after call #5 — **Setu, Dukaan OS and Vyapar IQ are now ruled out** (all three collide with real, established Indian companies).

---

## Files in this folder

- **Code**: `../../../ecommerce-hub-app/` (Next.js + Prisma scaffold, at the project root, not in the vault — see its README) — moved here from `~/developer/abc`; repoint the Claude Desktop Project's connected folder to the shared root per `_project-briefs/README.md`.
- [[Ecommerce_Hub_PreSeed_Deck.pptx|Pre-Seed Pitch Deck (pptx, 18 slides)]] — the actual deck to send/present
- [[Ecommerce_Hub_PreSeed_Deck.md|Pre-Seed Pitch Deck (plain text)]] — same content, lightweight/AI-readable
- [[Ecommerce_Hub_Global_Report.docx|Global Market & Competitive Report (docx, 10 sections)]] — the full research writeup
- [[Ecommerce_Hub_Global_Report.md|Global Market & Competitive Report (plain text)]] — same content, lightweight/AI-readable
- [[FasterCapital Outreach Email|FasterCapital Outreach Email (txt)]] — pre-seed outreach draft, not yet sent

## Quick facts

- **Name**: not decided — "Ecommerce Hub" is a working title used across all files so far. Of the six candidates discussed, three are **ruled out as of 2026-08-30**: Setu (existing Indian fintech API co, acquired by Pine Labs 2022), Dukaan OS (existing Indian ecommerce enabler), Vyapar IQ (established Indian SMB billing software). Surviving but weak: Sutradhar, Threadline, Compass Commerce — none has a clean .com; recommendation is to generate fresh candidates instead.
- **Category**: AI-native, consolidated dashboard for D2C ecommerce brands — analytics + WhatsApp/email/SMS automation + warehouse monitoring built in-house; payments/logistics/marketplaces stay third-party ("out-house"), just connected. India-first.
- **Ask**: $40K–$60K pre-seed, sized to fund 90 days of founder validation (already underway) + MVP build (GA4 + one payment gateway + one logistics carrier).
- **Own pricing**: not set yet, deliberately — to be set with design partners. Competitor pricing used only as a reference benchmark.
- **Direct global competitors**: Triple Whale, Polar Analytics, Northbeam, Rockerbox, Daasity, Glew.io, Lifesight, Putler (verified via G2/vendor pricing pages) — none more than a few years old, none has consolidated the category yet.
- **Closest India competitor**: BiteSpeed (Sequoia Surge-backed, WhatsApp+Shopify+Razorpay, ~$10M ARR per unverified third-party estimate), positioned as CRM not analytics.
- **Real technical gap confirmed**: no Razorpay/Cashfree/PayU/Indian-logistics support in any major global tool.
- **Full connector map** (not just Razorpay): Payments (Razorpay, Cashfree, PayU, PhonePe PG), Logistics (Shiprocket, Delhivery, XpressBees, Ecom Express, Shadowfax), WhatsApp/BSPs (AiSensy, Wati, Interakt, Gupshup), Storefront/OMS (Shopify, WooCommerce, Unicommerce), Marketplaces (Amazon, Flipkart, Myntra, Nykaa, Meesho) — MVP scope is still just GA4 + 1 payment gateway + 1 logistics carrier; the rest is the expansion map.
- **Regulatory**: DPDP Act 2025 applies — 18-month phased compliance window, not an immediate blocker at MVP stage.
- **Strategic risk**: Razorpay is already building its own analytics (RTO Analytics Dashboard) — could commoditize the payments-data layer.
- **Outreach in progress**: FasterCapital (via LinkedIn connection with Eric Bush) — draft in [[FasterCapital Outreach Email]], not yet sent.
- **Feature set**: not decided. The deck's ten candidate jobs were decomposed, rated for defensibility and mapped to non-leading behavioural probes on 2026-08-30 (last section). Working recommendation pending the calls: v0 = true profit per order after RTO/COD/shipping/ad spend; RTO-attribution second; WhatsApp as a read-only connector rather than an in-house build; email/SMS, warehouse monitoring and marketplace panels dropped from in-house scope. Two internal contradictions in the deck flagged there (in-house scope vs MVP scope; slide 15's claim that founder conversations are already underway).
- **Evidence gap that hasn't closed**: still no direct sourced evidence of founders complaining about this pain unprompted — the in-progress founder conversations are meant to close this, not desk research. As of 2026-08-30 those conversations have a written plan, target segment, script and pre-agreed kill criteria (end of this file); results not yet in.

---

## Origin note

This idea came directly from Priyam's own experience building **SURGE**, a D2C men's hair styling brand — the pain of juggling Google Analytics, multiple ad platforms, WhatsApp, Razorpay, and delivery dashboards separately was lived firsthand, not theorized. **SURGE itself has been fully stopped, not paused — Priyam is not continuing it further.** This idea is a separate B2B SaaS play (selling the unified dashboard to *other* D2C brands), inspired by that experience, not a plan to revive SURGE. See `[[surge]]` context is in personal memory, not this vault.

---

## Claude — deep competitive research (2026-08-28)

_Full research pass via a research agent. Confidence tiers are marked inline: **verified** = independently confirmed (G2 pages, vendor pricing pages, government documents, primary press), **vendor claim** = only the company's own marketing, **unverified/inference** = third-party blog estimate or my own synthesis. Treat anything not marked verified with real skepticism._

### 1. Direct competitors

**Triple Whale** — centralizes Shopify + ad platform data, proprietary attribution pixel, AI assistant ("Willy") for natural-language queries. Pricing **verified** via G2: Free, Starter $1,490/yr (~$124/mo), Advanced $2,190/yr (~$183/mo), Professional $4,489.97/yr (~$375/mo) — some third-party blogs cite up to ~$1,290/mo at scale, **unverified**. Funding: Series B, ~$55M raised per third-party tracker (**unverified exact figure**, directionally credible). G2: 4.5/5 overall (**verified**). Integrations **verified directly from Triple Whale's own docs**: Meta, Google, TikTok, Pinterest, Snapchat, X, Microsoft, and 10+ more ad platforms — **zero mention of Razorpay, India, or any Indian ad platform anywhere**, confirming the India gap at the source. AI storytelling is already marketed here — not a novel wedge.

**Polar Analytics** — "AI-Analytics Platform," dedicated Snowflake DB per customer, data activation into ad platforms/Klaviyo. Pricing not publicly disclosed (sales-gated — itself a signal of an enterprise-ish, likely-not-cheap motion). G2: 23 reviews, 4.7/5 (**verified**). Reviewers **independently corroborate** the AI-storytelling claim — described as "Supermetrics + Data Studio + a data scientist," surfacing insights and trends without manual digging. This directly overlaps with Priyam's "data storytelling" pitch and is already real, not just marketed. No evidence of Razorpay/Indian-carrier support found.

**Northbeam / Rockerbox** — attribution/media-mix-modeling specialists, not full ops dashboards. Northbeam: Series A, $15M raised (**verified**, Crunchbase + BusinessWire). Rockerbox: G2 47 reviews, 4.6/5 (**verified**). Both skew toward larger ad-spend accounts (commonly cited $50k+/mo spend sweet spot in comparison blogs, **unverified precisely**) — not close competitors for a small-brand "one dashboard to run everything" product.

**Lifesight** — "Agentic Unified Marketing Measurement Platform," MMM + incrementality + attribution, explicitly AI-driven. G2: 37 reviews, 4.2/5 (**verified**), "500+ brands worldwide" (**vendor claim**). One G2 reviewer stated it "doesn't have competition in the Indian market" — **a single reviewer's opinion, not a verified market fact, but the single most important thing for Priyam to personally check** before finalizing India positioning, since Lifesight has India/APAC roots.

**Daasity** — DataOps/BI for omnichannel brands (Shopify + Amazon + retail + wholesale), G2: 17 reviews, 4.7/5 (**verified**), 60+ integrations claimed. Enterprise-ish sales motion (dedicated Success Manager), not AI-storytelling-first.

**Glew.io** — "Commerce Data Cloud," G2: 57 reviews, 4.0/5 (**verified**, largest review base of this group — suggests widest established customer base among mid-tier players), 170+ integrations claimed. Traditional dashboarding, not AI-narrative-first.

**Lifetimely** — Shopify LTV/profit analytics app, narrow point-solution, cheap (lower tens of $/mo per multiple blogs, **unverified exact figure**). Different weight class — not a full ops hub.

**Supermetrics / Windsor.ai / TapClicks** — data-pipeline/connector infrastructure, not insight products. Potential building blocks for Priyam's product, not head-to-head competitors.

**Shopify's native analytics** — free, but universally described (with an obvious vendor-blog bias, so weighted accordingly) as lacking cross-channel attribution, WhatsApp/funnel detail, and any AI narrative layer. This is the real "do nothing" baseline for the smallest brands, many of whom genuinely just use Shopify's free dashboard plus the ad platforms' own managers.

**Section verdict**: AI plain-language insight is **already present at Polar Analytics and Lifesight today**, independently corroborated by reviewers — not white space. The real, source-confirmed gap is **India-specific integrations** (Razorpay, Indian logistics, WhatsApp), which none of the established players support.

### 2. India-specific angle

**WhatsApp commerce/marketing tools** (AiSensy, Wati, Interakt, Gupshup — all confirmed as real, actively-compared products): these are WhatsApp Business API providers (cart recovery, order updates, broadcast marketing) — potential **data-source integration partners**, not direct competitors, unless they expand into full analytics (some already have basic campaign dashboards — worth checking directly, not assumed to be zero-overlap). Gupshup is a unicorn, $1.4B valuation as of an April 2021 raise (**verified**, TechCrunch/Bloomberg), later reported ~$2B by industry blogs (**unverified**) — shows real capital already in adjacent Indian business-messaging space.

**BiteSpeed** — the single most important competitive finding. Sequoia Surge-backed (**verified**, Inc42), reportedly ~$10M ARR (**unverified**, third-party estimate site — treat skeptically), described as "AI CRM for Shopify" powering WhatsApp-based D2C sales, with a reported partnership with Razorpay for a "unified commerce platform" (Devdiscourse). **Already combines WhatsApp + Shopify + Razorpay** — positioned as CRM/messaging rather than analytics/insight, so a wedge may remain, but Priyam should study BiteSpeed's actual dashboard directly before assuming an open lane.

**Indian logistics** — Shiprocket (aggregates carriers including Delhivery) and Delhivery both confirmed as major real players. No evidence any Tier-1 global analytics tool integrates with either — a second confirmed gap, and RTO/COD data (huge for Indian D2C unit economics) isn't a first-class concept in Western attribution tools at all.

**Razorpay itself** — already building native analytics (an "RTO Analytics Dashboard," per Razorpay's own blog). Real strategic risk: Razorpay has obvious incentive to expand this and increase merchant stickiness, potentially commoditizing the payments-data layer of this idea. **Putler** is the most credible existing "Razorpay + multichannel BI" option today (Putler's own site claims "the only native, direct Razorpay integration" among tools it compares itself to) — though Putler's own pricing page didn't list Razorpay among headline gateway integrations when checked directly, an inconsistency worth resolving before treating either claim as settled.

**Section verdict**: the India angle is real and underserved by the big global names, but **not unclaimed** — BiteSpeed and Putler are both already operating in adjacent-to-identical space. The genuine wedge is the specific combination (AI cross-funnel storytelling + India-native payment/logistics/WhatsApp data together), not any single piece alone.

### 3. Regulatory/technical reality check

**Meta Marketing API** (**verified** directly from Meta's developer blog): higher access tier requires 500+ API calls in 15 days with <15% error rate — this requirement was recently *lowered* from 1,500 calls, and the screen-recording requirement was removed. A real but modest barrier; a handful of active pilot customers clears this almost immediately. The bigger practical drag is Meta's manual app-review process for permissions like `ads_read`, which independent developer blogs describe as often taking weeks — budget time for this, but it's not a blocker.

**Google Ads API** (**verified** directly from Google's developer docs): Basic Access gives 15,000 operations/day, plenty for an MVP through moderate scale; approval takes about 5 business days per Google's own guidance. Not a meaningful constraint at this stage.

**DPDP Act 2025 / DPDP Rules 2025** (**verified** via the official PIB government notification and corroborating EY-India/Seclore summaries): as a company processing D2C brands' customers' PII (names, phone numbers, browsing/purchase behavior), Priyam's company would need clear per-purpose consent notices, "reasonable security safeguards," breach notification "without delay," and the ability to fulfil data-subject requests within 90 days. There's a genuine **18-month phased compliance window** from notification — not "comply immediately or shut down." Stricter obligations (independent audits, impact assessments) only apply once designated a "Significant Data Fiduciary," which a solo-founder MVP wouldn't be for a long while. Real and non-trivial, but not an existential barrier at MVP stage — build compliant data-handling practices from day one rather than treating it as a blocker to starting.

**Section verdict**: none of these three are hard stops. All three will cost real weeks of time (API app-review cycles, consent/privacy engineering) — budget for that honestly rather than assuming instant integration.

### 4. Market validation signal (weakest-evidence section — flagged explicitly)

Direct, sourced Reddit/Indie Hackers/founder-forum complaints about these tools being too expensive or fragmented were **not found** in this research pass — search results kept surfacing SEO comparison listicles and vendor blogs instead of authentic user complaints. This is an honest evidence gap, not a "the pain is proven" green light.

What *is* supportable: the sheer number of actively venture-funded competitors (Triple Whale, Polar, Northbeam, Rockerbox, Daasity, Glew, Lifesight, Putler) is itself indirect evidence the underlying pain is real and monetizable. G2 review counts in the teens-to-fifties range per tool suggest a fragmented middle market, not a winner-take-all category — room exists for a well-targeted regional/workflow-specific entrant, but this is inference, not proof of demand for *this specific* product.

**Recommended next step, stated plainly**: talk to 10-20 other D2C founders directly (or search Indian D2C founder communities with more specific, colloquial terms) rather than trusting this desk research on the "do people actually complain about this" question — this mirrors the same gap found in the pathology-lab research (see `[[Pathology Lab Ops Assistant]]`), where direct conversations were also the missing, most valuable next step.

### 5. Pricing reality

Constructed estimate (my own synthesis, not a verified aggregate): a $10k–$500k/month D2C brand plausibly spends **$100–$800+/month** combined across 4-6 separate tools for analytics/BI, WhatsApp/BSP, and email marketing — a wide, low-confidence range that needs primary customer interviews to tighten.

A defensible entry price for an India-first unified tool, benchmarked against Triple Whale's real $124–$375+/mo tiers and Putler's real $20-$750/mo revenue-based tiers, is plausibly **$50–$300/month** for the $10k-$100k/month revenue segment — priced low enough to beat "just use Shopify's free dashboard + spreadsheets" (the real default for the smallest brands) while accounting for India's typically thinner D2C margins and lower SaaS willingness-to-pay versus US brands. This paragraph is strategic inference, not sourced fact — validate with real pricing conversations before treating it as a plan input.

### Sources

Triple Whale (G2 pricing/reviews page, own knowledge-base integration docs, Crunchbase Series B, Getlatka revenue estimate); Polar Analytics (own pricing page, G2 reviews, 1800dtc.com overview); Daasity, Glew, Rockerbox, Lifesight (G2 review pages); Northbeam (Crunchbase, BusinessWire Series A announcement); Putler (own pricing page, own Razorpay-analytics-tools page); WhatsApp BSP comparisons — WATI vs AiSensy vs Interakt (CampaignHQ, Ominiflow); Gupshup funding (TechCrunch 2021 raise, Zomefy 2025 valuation update); BiteSpeed (Inc42 Sequoia Surge funding, AsiaTechDaily seed round, Devdiscourse Razorpay partnership, ValueForStartups ARR estimate — flagged unverified); Shiprocket (own carrier-integrations pages); Razorpay (own RTO Analytics Dashboard blog post); Google Ads API access levels (Google's own developer docs); Meta Marketing API access tier changes (Meta's own developer blog); DPDP Rules 2025 (PIB government notification PDF, EY India, Seclore, Wikipedia summary).

**Confidence note**: G2 review counts/ratings, official pricing pages, Meta/Google's own developer documentation, the government PDF, and named press coverage (TechCrunch, BusinessWire, Crunchbase) are highest-confidence. Anything sourced only from SEO comparison/listicle blogs is lower-confidence secondary commentary — several such sites have referral/affiliate incentives to shade competitor pricing unfavorably, flagged inline wherever used.

---

## Claude — Pass 2 refresh (2026-08-28)

Targeted follow-up specifically trying to close the weakest-evidence gap flagged in Pass 1: real, sourced founder complaints about fragmented ecommerce analytics or missing Razorpay integration. Ran five more targeted searches (Reddit/r-India, X/Twitter + specific tool names, Indie Hackers, colloquial "too many dashboards"/"excel sheet" phrasing, "too expensive" + Shopify India) with more India-specific and colloquial terms than the first pass.

**Result: still no direct, sourced founder complaints found.** Two independent search passes (desk research + this targeted one) both came up empty — only generic listicles, vendor alternatives pages, and unrelated threads surfaced.

**This raises rather than lowers the priority of direct founder validation.** Absence of public complaints could mean the pain is genuinely low, or that frustrated founders vent in private WhatsApp groups/Slack communities that aren't indexed by search — this method can't distinguish between those two explanations. That distinction can only be resolved by actually talking to 10-20 Indian D2C founders directly, which remains the single most important next step before writing any code.

**Verdict unchanged**: 🟡 Real gap, not blue ocean — product-side evidence (no Razorpay/Indian-logistics support in Western tools) is verified and solid; demand-side evidence is still unproven.

Confidence note: the searches returning nothing is itself verified (the searches were run). The interpretation of *why* (low pain vs. private venting) is inference, not evidence either way.

---

## Claude — Global scope research + feature brainstorm (2026-08-29)

Priyam asked to research this idea globally (not India-only), add recommended features, and produce a detailed report. Full report saved alongside this file as `Ecommerce_Hub_Global_Report.docx`; pre-seed deck as `Ecommerce_Hub_PreSeed_Deck.pptx`. Key takeaways:

**Honest headline finding**: going global trades away the one verified, defensible advantage this idea has. The India-native gap (no Razorpay/Indian-logistics support in Triple Whale, Polar, Northbeam, Rockerbox, Daasity, Glew — confirmed directly) is real and checkable. "Global" has no equivalent confirmed gap — Triple Whale's own help center already states it supports multi-currency, i.e. already actively markets itself internationally.

**Market size (verified)**: Grand View Research pegs global B2C ecommerce at $7.2T (2025) → $8.5T (2026) → $33.5T by 2033, 21.7% CAGR — this is broader B2C, not a D2C-only or software-spend figure, same caveat as the India numbers.

**Regional check**: Plugo (Singapore, $9M Series A, Altos Ventures) is the only verified non-US/India competitor found — an ecommerce enabler, not a pure analytics tool. No dedicated D2C analytics competitor was found in Latin America, Europe, or the Middle East — explicitly flagged as an evidence gap, not proof those markets are open.

**Untested hypothesis worth validating directly**: the same "big global tools skip the local payment/logistics ecosystem" pattern that's confirmed for India may also exist for Mercado Pago (LatAm), GrabPay/J&T Express (SEA), Klarna/iDEAL (parts of Europe) — none of this was confirmed in this pass (couldn't verify what Polar/Putler/Supermetrics do or don't support there). If true, the real strategy is "win one underserved payment-ecosystem market, then repeat," not "launch everywhere."

**Recommendation given to Priyam**: keep the India-first validation plan (the 10-20 founder interviews) unchanged, but build the product so currency/locale/payment-provider handling isn't hard-coded to India-only from day one — keeps the option to repeat the playbook elsewhere later without a rebuild.

**Feature brainstorm** (Claude's own suggestions, not user-validated — full list with rationale in the docx report): natural-language copilot to query data conversationally, proactive anomaly alerts (WhatsApp/Slack/email), revenue/inventory/CAC forecasting, anonymized industry benchmarking, creative-fatigue detection, RFM/cohort segmentation, influencer/affiliate ROI tracking, social-commerce (TikTok/Instagram/Facebook Shop) unification, root-cause RTO/chargeback analysis, customer 360 view, auto-generated board reports, multi-brand rollup + white-label reporting for agencies, and data-warehouse/API export. Flagged natural-language copilot as the single highest-leverage feature to prototype first.

Verdict unchanged at 🟡 — this update doesn't change the core recommendation, it adds context for if/when Priyam decides to expand beyond India.

## Claude — Visual polish pass on deck + report (2026-08-29)

Priyam asked to make both the pre-seed deck and global report "pleasing to eye and information/data easy to read at a glance," and to add a proper phased plan leading with India immersion before global expansion. Both files updated in place (same filenames, both re-committed to this vault):

**Pitch deck**: Market slide rewritten with 3 stat tiles + a native area chart of India's modeled growth (2026→2031), plus a new "Expansion Roadmap" slide — 5 color-coded phases (01 Validate → 02 India MVP → 03 India Scale → 04 1st Adjacent Market → 05 Multi-Market), with phases 01-02 marked "THIS RAISE" in coral to make clear the raise funds India-only validation, not global expansion.

**Global report**: added a designed cover page, a stat-tile summary table for India market data, the same two growth charts (India + Global) embedded as images, and a matching color-coded 5-phase roadmap table in a new Section 8 ("The Phased Plan — India Immersion First"). Same India-first sequencing logic as the deck: prove the wedge in India before spending on global positioning.

Both re-rendered and visually QA'd page-by-page (soffice+pdftoppm) — no overflow, tables/charts render cleanly. No change to the underlying research or verdict — this was presentation only.

## Claude — Content upgrade: traction, competitor detail, AI-model feature (2026-08-29)

Second update same day. Priyam is now actually in active conversations with D2C brands to gather feature input and finalize the plan — this changed the deck/report from "we haven't started" to "already in motion," which also fixes the tone (was reading a bit too "pre-idea" for a pitch document). Concrete changes to both files (now 16 slides / 9 report sections):

- **Validation Status slide (deck) reworded**: moved "founder interviews" from the "not yet done" bucket into "DONE" — now says the team is already in active conversations with D2C founders, pressure-testing features and finalizing what ships first. The "still ahead" bucket now only lists what's genuinely still open (interviews not yet concluded, no product/revenue yet).
- **New slide/section: "What's Next" — a private, brand-trained AI model.** Positioned as the long-term differentiator: an AI trained specifically on each customer's own sales/inventory/customer data (not a generic LLM wrapper), recommending next actions (discount timing, channel reallocation, churn-risk offers) instead of just reporting what happened. Explicitly flagged as a build target (India Scale phase), not live today — kept honest, not oversold.
- **New competitor detail table** (deck slide + expanded report table): each of the 8 competitors' flagship offering + verified pricing side by side (Triple Whale, Polar Analytics, Northbeam, Rockerbox, Daasity, Glew.io, Lifesight, Putler) — same verified data as before, just made explicit and scannable instead of buried in a 2x2 positioning map.
- **Market framing**: added explicit language that the category (India and global) is "still forming, not yet consolidated by any single incumbent" — the market-still-early, big-future-potential narrative Priyam wanted, backed by the fact that none of the 8 named competitors is more than a few years old.
- **Removed all "Claude" authorship mentions** — the cover legend and feature-section heading used to literally say "Claude's own synthesis" / "Claude's Own Suggestions." Reworded to "original synthesis" / "Recommended Feature Set & Product Vision" so neither document reads as AI-generated. Confidence tags (VERIFIED / VENDOR CLAIM / INFERENCE) were kept — they're useful investor-facing rigor, just no longer attributed to an AI by name.
- **Professionalized the ask slide**: removed literal "placeholder, set the real number" language; ask is now framed as a specific, sized pre-seed round.

No change to the underlying verdict or core recommendation (still 🟡, still India-first). This was tone, traction-accuracy, and completeness — not new research.

## Claude — Broadened connector/integration list beyond Razorpay (2026-08-29)

Third update same day. Priyam pointed out the materials only named Razorpay for payments and Shiprocket/Delhivery for logistics, when in reality a serious Indian D2C integration layer needs to cover many more named players — asked me to research and add "all the connectors I would have missed."

Researched the current (2025-2026) Indian D2C tech stack across six categories and added a new slide (deck) + new Section 5 (report) listing the real 3-5 players per category, not just one name each:

- **Payments**: Razorpay, Cashfree, PayU, PhonePe PG
- **Logistics & shipping**: Shiprocket, Delhivery, XpressBees, Ecom Express, Shadowfax
- **WhatsApp / BSPs**: AiSensy, Wati, Interakt, Gupshup
- **Storefront & OMS**: Shopify, WooCommerce, Unicommerce
- **Marketplaces**: Amazon, Flipkart, Myntra, Nykaa, Meesho
- **Ads & analytics**: Meta Ads, Google Ads, GA4 (already covered elsewhere, listed for completeness)

Every prior mention of "Razorpay" or "Shiprocket/Delhivery" as if they were the only options was reworded throughout both documents (Problem slide, Solution slide, Product slide, GTM slide, Ask slide, Executive Summary, Section 2). Kept it honest: MVP scope (what this raise actually funds) is still explicitly scoped to GA4 + one payment gateway + one logistics carrier — the broader map is the category the product expands into as it scales, not day-one build scope. Deck is now 17 slides, report is now 8 pages / 10 sections.

No change to the core research verdict — this was breadth/accuracy of the product's technical scope, not new market research.

## Claude — Removed pricing, added consolidation pitch (2026-08-29)

Fourth update same day. Two changes Priyam asked for:

1. **Removed our own pricing** from both documents (Business Model slide's $50/$150/$300 tiers, the Market slide's "$50-$300/month" line, report Section 7). Reworded as "pricing set with design partners, not guessed up front" — kept competitor pricing (Triple Whale, Putler) as reference-only benchmarking since that's informational, not a commitment. This matches the reality: no price has actually been validated yet.

2. **Added the consolidation pitch** — new slide/section: "Ten subscriptions become one dashboard." Lists the 8 tools a D2C brand actually juggles today (analytics dashboard, WhatsApp automation, email/SMS automation, payment gateway dashboard, logistics dashboard, warehouse inventory/monitoring, marketplace panels, ads reporting) against "one login, one bill, one dashboard." Also added the clarifying distinction Priyam gave: this is NOT a plan to become a payments or logistics company — the product connects to existing payment gateways/logistics providers/marketplaces as-is ("out-house"), while WhatsApp automation, email/SMS automation, and warehouse monitoring are built in-house, natively inside the dashboard. This reframes the whole pitch around "simplify what you have to do to run an ecommerce storefront" rather than just "analytics in one place."

Deck is now 18 slides, report is 8 pages / 10 sections (new 5.1 subsection). No change to core verdict — this was pricing accuracy + a sharper value-prop framing.

## Claude — Added text/markdown versions for cheap AI-readable storage (2026-08-29)

Fifth update same day. Priyam asked for the vault copies to be in text/small-storage format that's easy for future AI sessions to read, instead of only the binary pptx/docx.

Added two new files alongside the existing binaries (kept the pptx/docx too — those are what you'd actually use to pitch investors, these are for fast/cheap reading):

- **Ecommerce_Hub_PreSeed_Deck.md** (12KB) — all 18 slides transcribed as numbered sections with their substantive text, bullets, and tables. No layout/icon/visual detail, just the content.
- **Ecommerce_Hub_Global_Report.md** (15KB) — all 10 report sections transcribed the same way, with proper markdown tables for the competitor/connector/risk/roadmap tables and confidence tags kept as `**[TAG]**` markers.

Tried the obvious automated route first (markitdown, pandoc) but both produced genuinely broken output in this environment — markitdown is missing a docx dependency, and pandoc's docx conversion escaped dollar signs, dumped multi-paragraph cells as raw HTML tables, and left dangling image references to a media folder that was never created. Hand-transcribed both files directly instead, since I'd already written build.js/report.js and visually reviewed every page this session — that gave a much cleaner result: ~15KB and ~12KB vs. 94KB/606KB for the binaries, roughly 6x/40x smaller, and plain text any future AI session can read without parsing office file formats.

No change to content/verdict — this was a storage-format change only.

## Claude — FasterCapital outreach email drafted (2026-08-29)

Sixth update same day. Priyam connected with Eric Bush (FasterCapital) on LinkedIn and got a contact email — drafted a pre-seed outreach email addressed to the FasterCapital team, referencing that connection. Saved as [[FasterCapital Outreach Email]] (plain .txt, subject + body) in this folder. Not sent by me — Priyam is sending it himself so he can attach the actual pptx/docx directly in Gmail.

Note: product/company naming is still undecided — "Ecommerce Hub" is a working title used throughout the deck/report/vault so far. Discussed candidate names (Setu, Sutradhar, Dukaan OS, Vyapar IQ, Threadline, Compass Commerce) in chat; nothing finalized yet. Rename everything once Priyam picks one.

## Claude — Execution plan: validation, MVP-on-paper, naming (2026-08-30)

Priyam asked to plan three tracks — founder validation, MVP build, and naming — with a stated budget of **a few hours a week** alongside the pathology-lab interviews. That budget is the binding constraint and it changes the plan's shape, so the honest version first.

### The constraint, stated plainly

A few hours a week is ~4-6 hrs, so ~10 hours over the next two weeks. That funds **one** track, not three. Running all three in parallel at this budget produces three half-finished tracks and no decision. So this plan spends every one of Priyam's hours on validation, and handles the other two tracks in ways that cost him almost nothing:

- **Track A — Founder validation**: all ~10 hours go here. This is the only track that consumes real time.
- **Track B — MVP**: written as a spec below, not built. Zero hours now. It exists so that if validation goes green, building starts the same day instead of after another week of thinking.
- **Track C — Naming**: one 90-minute timebox, and only *after* the first five calls — because the calls give free naming signal. Three of the six candidates are ruled out below on hard grounds, at no cost.

Also worth saying: the [[Roadmap]] still ranks Pathology Lab #1 because it has a working prototype and a real ₹40k+AMC commitment. Nothing in this plan changes that. Ecommerce Hub validation is cheap (conversations) and runs alongside — it does not justify taking hours away from the lab interviews.

### Track A — Founder validation (the whole time budget)

**Target: 15 conversations, 20 minutes each.** Not 20 — 15 is achievable at this budget and is enough to score the kill criteria.

**Who counts as a valid interview.** Indian D2C brands doing roughly **₹10L–₹2Cr/month** in GMV, on Shopify or WooCommerce, spending on Meta/Google ads. Below that band founders genuinely are fine on Shopify's free dashboard, and above it they have an in-house analyst — both give misleading answers. Screen for the band before booking the call, not during it.

**Where to find them, in yield order:**

1. **Warm nodes from SURGE first.** Suppliers, contract manufacturers, packaging vendors, BSP/agency reps Priyam already dealt with each know 10-20 brands. This is the highest-conversion channel and costs nothing.
2. **Performance-marketing agency owners and freelancers.** The single highest-yield node type: one agency owner services 15-30 D2C brands *and personally feels the reporting pain* (they build the client reports by hand every month). If the pain is real anywhere, it is most acute and most articulate here. Two agency conversations are worth five founder conversations for diagnostic purposes — but they are **not** substitutes for founder interviews when scoring willingness-to-pay, because agencies and brands buy differently.
3. **[D2C Insider](https://www.d2cinsider.com/)** — a real, active curated community of Indian D2C founders, still running events in 2026 (Frontier AI Summit 2026) and an Elevate accelerator with cohort funding. Its [LinkedIn](https://in.linkedin.com/company/d2c-insider) and [Pulse blog](https://pulse.d2cinsider.com/) name founders publicly — a free source of a target list even without joining.
4. **Vendor customer-story pages**: Shiprocket, Razorpay, Unicommerce and the BSPs (AiSensy, Wati, Interakt) all publish named case studies with founder names and brand names. Free, pre-qualified target list.
5. **Instagram DMs to the brand account.** In this GMV band the founder often runs the account personally. Lower response rate than LinkedIn but non-zero and very cheap.

**Outreach template** (no pitch, reciprocity hook, one send):

> Hi <name> — I ran a D2C brand (SURGE, men's hair styling) and I'm researching how founders actually track performance across ads, payments and shipping. I'm not selling anything and I'm not building this for you. 20 minutes, and I'll send you the anonymised findings from all 15 conversations. Free Tue or Wed?

The "I'll send you the findings" line is the strongest single lever here and costs one email at the end.

**The interview script.** The Mom Test rule applies hard: **do not describe the product for the first 15 minutes.** Two search passes already failed to find public complaints (Pass 1 and Pass 2 above) — if the questions are leading, this round will fail the same way while feeling like success. Ask about last week, never about a hypothetical product.

1. Walk me through the last time you checked how the business was doing. Which screens did you open, in what order? *(count them; write down the actual tool names)*
2. How long did that take, how often do you do it, and who does it — you or someone else?
3. What did you do with those numbers afterwards? *(spreadsheet? screenshot into a WhatsApp group? nothing?)*
4. Last time a number looked wrong or surprising — what happened, and how long did it take to work out why?
5. What do you pay today, in rupees, across analytics / WhatsApp / email / reporting tools? *(get figures, not ranges)*
6. **Has anyone on your team ever built a sheet, script or Zap to stitch these together?** *(the single most diagnostic question — see kill criteria)*
7. How do you track RTO and COD failure rate by channel or campaign today? *(the India-specific number no Western tool computes)*
8. What have you tried for this and dropped? Why did you drop it?

Only after all eight: describe the idea in one sentence, then ask **"what would have to be true for you to switch?"** and — for anyone who sounds keen — "would you pay ₹X to be a design partner for 90 days?" A yes with a number attached is data; "sounds interesting, keep me posted" is a no.

**Write-up discipline**: one paragraph per call, **same day**, with verbatim quotes rather than summaries. Summaries written a week later reliably drift toward whatever the founder wants to believe.

### Kill criteria — set now, before any data arrives

Written in advance so they can't be renegotiated after the fact. Score at the end of the 15 calls.

**🟢 Green — validated, start building:**
- ≥8 of 15 open 4+ separate tools in a normal week, **and**
- ≥5 of 15 have already built their own sheet/script/Zap workaround, **and**
- ≥5 name a specific rupee or hours-lost cost, **and**
- ≥3 verbally commit to a paid pilot with a number attached.

**🟡 Amber — real pain, wrong shape:** the pain concentrates on one job (most likely: true per-order profit after RTO, or RTO attribution by campaign) rather than "too many dashboards." Then build **that one job** as a point solution and drop the hub framing. This is a good outcome, not a consolation prize — it is a much easier product to build and sell.

**🔴 Red — shelve it:** fewer than 5 open 4+ tools weekly, **or** nobody has built their own workaround, **or** zero pilot commitments with numbers. Then put the hours into Pathology Lab and revisit only if new evidence appears.

**Why the "built their own workaround" test carries the most weight**: it is behaviour, not opinion, and it is the exact evidence two desk-research passes could not find. Someone who has already spent their own Sunday building a Google Sheet to stitch Razorpay and Shiprocket numbers together has demonstrated the pain in a way no survey answer can fake. If none of 15 founders has ever bothered, that is the answer — the pain is real but not expensive enough to pay for.

### Track B — MVP spec on paper (build nothing yet)

Unblocked only by a Green or Amber result. Written now so no thinking time is lost later.

**What v0 actually is.** Not "a dashboard with GA4 + one payment gateway + one logistics carrier" — that framing describes plumbing, and a dashboard of plumbing is something any agency can rebuild in Looker Studio in a week. v0 should answer **one question that currently has no good answer**, with a working hypothesis to be replaced by whatever the interviews actually say:

> *Hypothesis (to be confirmed or overwritten by the interviews): "What is my true profit per order, by channel, after RTO, COD handling, shipping and ad spend?"*

This is defensible specifically because it needs Indian payment + Indian logistics data together, which is the one gap the research above verifies no global tool covers. Every feature in the deck that isn't this — WhatsApp automation, email/SMS, warehouse monitoring, marketplace connectors, the private brand-trained AI model — is explicitly **out of v0**. They stay in the deck as the roadmap; none of them ships first.

**Build order, driven by the slowest clock.** From the verified research in Pass 1: Meta's Marketing API needs manual app review for `ads_read`, often taking weeks; Google Ads Basic Access takes ~5 business days. So **day 1 of the build is filing both API access applications** — before any UI, any schema, any design work — so those weeks elapse in parallel with everything else. Razorpay/Cashfree and Shiprocket/Delhivery are merchant-API-key based and need no approval queue, so they can be built while waiting on Meta.

**Minimum architecture.** A nightly scheduled pull per source → Postgres, one raw table per source (raw JSON payload plus the few typed columns actually used) → one derived `orders` table that joins order, payment, shipment and ad-cost → one page that answers the question above. No data warehouse, no dbt, no streaming, no real-time. Nobody in this segment watches D2C data intraday; nightly is genuinely enough, and choosing it saves weeks.

**Data handling from day one** (per the DPDP findings above — the 18-month window is time to build habits, not time to ignore it): per-brand data isolation from the first commit; a plain-language consent notice at connect time; and **do not store customer phone numbers or emails in v0**. Order-level identifiers are enough to compute per-order profit, and staying out of PII entirely keeps the compliance posture trivial for as long as possible. The moment WhatsApp automation ships, that changes — which is another reason it isn't in v0.

**Design-partner terms**: 3 brands, free for 90 days, in exchange for a weekly 30-minute call and permission to use anonymised data. Convert to paid at day 91. If none converts, they were never customers — that is a second, later kill gate, and it should be written into the arrangement out loud at the start so it isn't awkward later.

### Track C — Naming (90-minute timebox, after call #5)

Three of the six candidates are dead on arrival, checked this session:

- **Setu** — ❌ fatal. [Setu is an existing Indian fintech API company](https://fintech.global/2022/06/27/pine-labs-acquires-fintech-api-startup-setu/), acquired by Pine Labs in 2022 for a reported [$70–75M](https://www.business-standard.com/article/companies/pine-labs-acquires-api-fintech-startup-setu-in-70-mn-75-mn-deal-122062300645_1.html). Same buyer persona, adjacent category, well known to exactly the investors being pitched.
- **Dukaan OS** — ❌ fatal. [Dukaan is an established Indian ecommerce enabler](https://techcrunch.com/2022/06/15/indias-dukaan-expands-globally-to-take-on-shopify) selling to the same merchants. Direct category collision.
- **Vyapar IQ** — ❌ fatal. Vyapar is established Indian SMB billing software — and per this vault's own [[Roadmap]], it acquired Suvit in 2026, so it is actively expanding in adjacent SME software.

The survivors are weak rather than clean: **Sutradhar** (several existing Indian companies use it — consultancy, a storytelling app — none in this space, but `sutradhar.co` is taken), **Threadline** (existing US companies on Crunchbase/ZoomInfo; `threadline.tech` taken), **Compass Commerce** (generic, and Compass is a large US real-estate brand). None of the six has a clean `.com`.

**Recommendation: treat all six as burned and generate fresh candidates**, screened against three constraints — (a) `.com` actually available, (b) no existing Indian SaaS/fintech/commerce company, (c) pronounceable and spellable by a Hindi/Gujarati-speaking founder hearing it once on a phone call. Add one free question to the end of every interview: *"if a tool did this, what would you expect it to be called?"* Fifteen founders' instincts are better naming input than a brainstorm.

**Do not rename the deck, report or vault files until validation is Green.** Renaming an unvalidated product feels like progress and isn't — it is the most satisfying available form of procrastination on this idea right now, which is exactly why it should stay timeboxed and last.

### One flag on the FasterCapital outreach (not in the requested scope, but worth 10 minutes)

The [[FasterCapital Outreach Email]] draft is still unsent. Before sending it: FasterCapital's reputation online is **contested** — it has a Trustpilot presence and review-site coverage alongside a dedicated critic site and multiple "is it a scam" discussions. This session did not investigate deeply enough to call it either way, and it would be wrong to state a verdict here. But given the mode (equity/services-for-funding accelerators are a category where founders regularly lose time and equity), spend ten minutes reading founder accounts and understanding exactly what is being exchanged before sending anything. Pitching an unvalidated demand side to anyone is also premature — the interviews come first.

### What to actually do, week by week

**Week 1 (~5 hrs)**
- 2h — build a target list of 40 brands/founders in the ₹10L–₹2Cr/month band, from warm SURGE contacts, agency owners, D2C Insider's public founder mentions and vendor case-study pages.
- 2h — send all 40 outreach messages using the template above.
- 1h — first 2-3 calls, same-day write-ups.

**Week 2 (~5 hrs)**
- 4h — 8-10 more calls.
- 1h — same-day write-ups, plus the 90-minute naming timebox once five calls are done.

**End of week 2** — score the 15 against the kill criteria and record the result as a new dated section here. Green → start the v0 build with the two API applications filed on day one. Amber → rewrite the deck around the single job that actually hurt. Red → shelve, and say so here plainly rather than letting the idea drift.

**Verdict unchanged at 🟡** — this section adds no new market evidence. It converts the standing "talk to 10-20 founders" recommendation into a dated, scored, falsifiable plan, and rules out half the candidate names.

---

## Claude — Feature planning through the founder conversations (2026-08-30)

Priyam's instruction this session: **no code, plan the features, and plan them in conversation with D2C brands.** This section is the instrument for doing that. It does not decide the feature set — deciding it now, before the calls, is the exact mistake the interview plan above was written to prevent. It decomposes the deck into testable jobs, states honestly which are defensible and which are not, and defines how each one gets scored from behaviour rather than opinion.

### Two contradictions inside the existing deck, to resolve before pitching again

1. **"In-house" scope conflicts with MVP scope.** Slide 6 states WhatsApp automation, email/SMS automation and warehouse monitoring are built in-house. Slide 5 states the MVP is GA4 + one payment gateway + one logistics carrier. Those are three separate products versus one thin slice. At the stated $40–60K ask and a few hours a week, the in-house claim is not fundable as written, and each of the three has an entrenched incumbent (BiteSpeed / Klaviyo–WebEngage / Unicommerce–Increff). **unverified/inference**: an investor who reads both slides will read it as scope confusion, not ambition. Recommendation: keep "in-house" as a stated *roadmap philosophy*, not a present-tense capability claim.
2. **Slide 15 asserts founder conversations are already pressure-testing the feature set.** The execution-plan section above (same day) says the target list is not yet built and no results are in. Priyam to confirm which is true. If no structured conversations have happened, that sentence is a false claim in an investor document and should be softened before the deck goes anywhere — including to FasterCapital.

### The candidate feature set, decomposed and rated

Each row is a *job*, not a module. "Defensibility" is against the competitive research in the sections above, not a guess.

| # | Candidate job | Who already does it | Honest defensibility |
|---|---|---|---|
| A | One consolidated view instead of 6–8 logins | Everyone claims it; Looker Studio approximates it free | **Weak alone.** This is plumbing. It is the pitch, not the wedge. |
| B | Plain-language "what changed and why" | Polar Analytics, Lifesight, Triple Whale (Willy) — all shipping | **None.** Already commoditised. Should not be slide 3's hero. |
| C | True profit per order after RTO, COD handling, shipping, ad spend | No global tool; needs Indian payment + Indian logistics data joined | **Strongest.** This is the v0 hypothesis in the execution plan and the only job the verified technical gap actually protects. |
| D | RTO / COD failure attribution by campaign, carrier and pincode | No global tool. Razorpay's RTO Analytics Dashboard is the live threat | **Strong but contested.** Differentiator is the *cross-channel* join (campaign ↔ carrier ↔ pincode), not RTO data alone. |
| E | WhatsApp automation in-house (cart recovery, order updates) | BiteSpeed, AiSensy, Wati, Interakt, Gupshup | **Weak as a build.** Strong as a *data connector* — reading BSP data into the profit view costs a fraction of building a BSP. |
| F | Email/SMS automation in-house | Klaviyo, WebEngage, MoEngage, Mailchimp | **Weakest.** No stated reason to build this. Recommend dropping from in-house entirely. |
| G | Warehouse / inventory monitoring in-house | Unicommerce, Increff, EasyEcom | **Off-buyer.** Sold to ops, not the founder-marketer this product targets. Scope creep. |
| H | Marketplace panel consolidation (Amazon/Flipkart/Myntra/Nykaa/Meesho) | Unicommerce, Browntape, marketplace panels themselves | **Off-segment.** Target segment is Shopify/Woo D2C. Marketplace-heavy sellers are a different buyer with a different pain. |
| I | Private brand-trained AI copilot | Nobody, at the claimed depth | **Roadmap only.** Correctly framed in the deck as a build target, not a feature. Do not let it migrate forward. |
| J | "Ten subscriptions become one bill" | n/a — a procurement argument, not a feature | **Untested.** Cheap to test in the calls; may matter more to the buyer than any single feature, or not at all. |

**Working recommendation (to be confirmed or overturned by the calls): v0 is C, with D as the first expansion, E as a read-only connector, and F/G/H removed from in-house scope entirely.** That is a deliberate narrowing of the deck, and it should not be applied to the deck until the calls support it.

### How each job gets tested without leading the founder

The Mom Test rule from the execution plan stands: **no product description in the first 15 minutes.** A founder asked "would you like per-order profit?" says yes, always, and the answer is worthless. Every job below is therefore mapped to a question about the *past*, and the eight-question script above remains the opening — these are probes layered onto it, not a replacement.

| Job | Behavioural probe (ask about last week, never about a feature) |
|---|---|
| A | Q1/Q2 of the existing script — count the tools they actually opened, in order, and who opened them. |
| B | "Last time a number surprised you, how did you work out why?" — if they answer in seconds, no pain; if it took a day of clicking, there is. |
| C | **"How do you know which of last month's orders actually made you money? Walk me through it."** The single highest-value question in the set. Watch for: they don't know, they guess at a blended average, or they have a sheet. |
| D | "What's your RTO rate by carrier? By campaign?" — if they can't answer the second one at all, that's the gap, unprompted. |
| E | "What do you use WhatsApp for, what do you pay for it, and has anyone ever asked you what it earned you?" |
| F | "Who sends your email/SMS, and when did you last change it?" — expect indifference; that is the finding. |
| G | "Do you or a 3PL hold your stock, and who watches it?" — a 3PL answer removes G from scope permanently. |
| H | "What share of your revenue is your own site vs marketplaces?" — screens segment fit; heavy-marketplace brands are out of band. |
| J | Q5 of the existing script — get the rupee figures per tool, then: "if one tool replaced four of those, would that be a better deal or just a bigger risk?" |

### Feature scoring sheet — fill one row per call, same day

Per the existing write-up discipline: verbatim quotes, same day, no summaries written a week later.

For each of A–J, record four things per founder:

1. **Unprompted?** — did they raise this before Priyam described anything? (yes/no)
2. **Workaround built?** — sheet, script, Zap, or a person whose job it is. (yes/no + what)
3. **Cost named?** — a rupee figure or an hours-per-week figure, in their words. (the figure, or blank)
4. **Would pay for this alone?** — asked only after the product is described, and only counted with a number attached. (₹ or no)

**Ranking rule, set now so it can't be renegotiated later:** features rank by column 1 + column 2 first, and by column 4 last. Unprompted mention plus a self-built workaround is behaviour. "I'd pay for that" at the end of a call where the founder likes Priyam is politeness. If the ranking from columns 1–2 disagrees with the ranking from column 4, **columns 1–2 win.**

**Decision output at the end of 15 calls:** the single job with the most unprompted mentions *and* the most self-built workarounds becomes v0 — even if it is not job C, and even if it makes the current deck wrong. That outcome is the Amber path already written into the kill criteria, and it is a good result, not a failure.

### One free naming input, at no cost

Per the naming section above, close every call with: *"if a tool did this, what would you expect it to be called?"* Fifteen founders' instincts beat a brainstorm, and it costs one sentence.

### What this section deliberately does not do

It does not pick the feature set, write specs, or touch code. **verified (filesystem, this session)**: an `ecommerce-hub-app/` Next.js + Prisma scaffold exists at the repo root, built earlier today ahead of the no-code gate; its `prisma/schema.prisma` models `Brand`/`Connector`/`DailyMetric`/`Insight` — a per-day, per-channel key-value grain that **cannot** compute job C, since per-order profit needs order-level rows joined to payment, shipment and ad cost. If the calls come back Green on C, that schema needs replacing, not extending. Flagged here rather than fixed, per Priyam's instruction this session to plan only.

**Verdict unchanged at 🟡.** No new market evidence. This section converts the deck's feature list into a scored, non-leading test instrument, and records two internal contradictions in the deck that need resolving before it is sent to anyone.
