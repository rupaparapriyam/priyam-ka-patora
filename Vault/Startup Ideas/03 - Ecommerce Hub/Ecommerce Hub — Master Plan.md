---
tags: [idea, master]
---

# Ecommerce Hub — Master Plan

**What this file is**: everything decided and discovered about this idea so far, written in plain language, in one place, so that you (or anyone else) can understand what we would be building and why — *before* a line of production code gets written.

**Status of this document**: written 2026-08-30. It is a *summary*, not the source of truth. The source of truth is `Ecommerce Hub.md` in this same folder, which holds every dated research section. If the two ever disagree, that file wins.

**How to read it**: Parts 1–3 are what the product is. Parts 4–6 are the honest competitive reality (read these even if you skip everything else). Parts 7–9 are what to build. Parts 10–14 are money, risk and the decisions still open. Part 15 is a glossary if any term is unfamiliar.

---

# PART 1 — The idea in one page

## The problem, in plain words

If you run a small Indian D2C brand — you sell your own product on your own Shopify or WooCommerce store — your business information is scattered across six to eight separate logins:

| Where | What it tells you |
|---|---|
| Shopify / WooCommerce | Orders and revenue |
| Meta Ads, Google Ads | What you spent to get those orders |
| Google Analytics (GA4) | Who visited and what they did |
| Razorpay / Cashfree / PayU | What money actually landed in your bank, and when |
| Shiprocket / Delhivery | What shipping cost, what got delivered, what came back |
| WhatsApp tool (AiSensy / Wati / Interakt) | Cart recovery and order updates |
| A spreadsheet | Where you stitch it all together by hand, on a Sunday |

No single one of those screens can tell you the thing you actually want to know: **did I make money, and on what?**

This is not a theory. Priyam lived it running SURGE, a D2C men's hair styling brand. SURGE is now fully stopped. This is a separate B2B software business, not a plan to revive it.

## The Indian twist that makes it worse

In India, two things break the maths that works fine in the West:

**COD — cash on delivery.** A large share of Indian ecommerce orders are paid in cash at the door. So an "order" on your Shopify dashboard is not money. It is a *hope* of money.

**RTO — return to origin.** The courier tries to deliver, the customer refuses or isn't there, and the parcel comes back to you. You paid to ship it out. You often pay to ship it back. You paid the ad that produced the order. You received nothing. That order didn't just earn zero — **it lost you money.**

Shopify counts it as a sale. Meta counts it as a conversion and optimises to find you *more customers like that one*. Nobody nets it out. That is the hole.

## What the product would do

One place that pulls the store, the ads, the payment gateway and the courier together and answers one question:

> **"Which of my orders actually made money, after ad spend, shipping, COD handling, payment fees and RTO — and which channel is sending me the bad ones?"**

---

# PART 2 — Who this is for (and who it is not for)

Getting this wrong wastes every conversation, so it is written down precisely.

**In scope — the target customer:**

- Indian D2C brand
- **₹10 lakh to ₹2 crore per month** in GMV
- Selling on **Shopify or WooCommerce** (their own store, not mainly marketplaces)
- **Spending real money on Meta and/or Google ads**
- The founder still looks at the numbers personally

**Out of scope, and why:**

| Who | Why not |
|---|---|
| Below ₹10L/month | Shopify's free dashboard is genuinely enough for them. They will say the pain is real to be polite, and never pay. |
| Above ₹2Cr/month | They have an in-house analyst or an agency doing this. Different product, different sale. |
| Mostly Amazon / Flipkart / Myntra sellers | Different problem (marketplace settlements), different tools (Unicommerce, Browntape), different buyer. |
| Warehouse and ops teams | Different buyer entirely from the founder-marketer. Do not chase. |

---

# PART 3 — What has actually been done so far

Plain inventory, no spin:

**Done:**
- Deep competitive research across 12+ global tools, verified against G2 and vendor documentation
- An 18-slide pre-seed pitch deck (`.pptx` + `.md` in this folder)
- A 10-section global market and competitive report (`.docx` + `.md` in this folder)
- A draft outreach email to FasterCapital (**not sent**)
- A full 15-founder interview plan, with target segment, sourcing channels, an eight-question script and Green/Amber/Red kill criteria agreed *in advance*
- A feature-planning instrument: the deck's ten candidate features decomposed, rated, and mapped to non-leading questions
- This competitive research pass (2026-08-30) — Shopify, AI/agentic commerce, and the Indian market

**Not done:**
- **Zero founder interviews completed.** Not one.
- No design partners, no revenue, no product
- No name chosen
- No pricing set

**Done but shouldn't have been:**
- A Next.js + Prisma code scaffold exists at `ecommerce-hub-app/`, created 2026-08-30, ahead of the standing "no code until validation" rule. It is about 30 lines of real application code and has never been installed or run. Its database design does not match the product described here (see Part 9), so it needs replacing rather than extending. It is recorded openly as a deviation, not quietly kept.

**A claim that needs fixing:** slide 15 of the deck says founder conversations are "already underway, pressure-testing the feature set." As of today no structured conversation has happened. **That sentence must not go to an investor in its current form.**

---

# PART 4 — What we know is TRUE (and how well we know it)

Every claim carries its confidence level. This discipline exists because the easiest way to kill this idea is to believe a comfortable thing that isn't checked.

### ✅ Verified — checked against primary sources

1. **Shopify's own reporting cannot do this.** Native profit reporting gives you net sales minus a *manually typed, static* cost-per-item. It does not subtract ad spend, transaction fees, shipping costs, or app subscriptions. No dynamic COGS. No ad-platform import. No MER or new-customer CAC. No multi-channel attribution.
2. **Shopify's AI assistant (Sidekick) cannot do this either.** In its own words, Sidekick "only knows what's in your Shopify store. It cannot pull data from your email marketing platform, Google Analytics, Meta Ads." It structurally cannot see courier or payment-gateway data. **Sidekick is not a competitor for this job.**
3. **No major global analytics tool supports Indian payments or Indian couriers.** Checked directly on vendor integration pages: TrueProfit lists Shippo, ShipBob, ShippingEasy, ShipHero, Shipwire, ShipStation for shipping — no Razorpay, no Cashfree, no PayU, no Shiprocket, no Delhivery, and no mention of COD or RTO. Same for Profit Calc. The same holds for Triple Whale, Polar, Northbeam, Rockerbox, Daasity and Glew from earlier research.
4. **Claude, OpenAI and Google's commerce work is about consumers buying, not merchants reporting.** Anthropic's is still a research pilot ("Project Deal", April 2026 — 69 employees, 186 deals, about $4,000). OpenAI moved toward apps and Shopify integrations. Google is doing "Ask Macy's" and a checkout protocol. **None of them is building this. This idea is not in a big lab's path.**
5. **RTO is a real, expensive, India-specific cost.** Confirmed across multiple Indian industry sources; an entire tool category exists just to *prevent* it (GoKwik, ClickPost, Shipway, Pragma, Razorpay Magic Checkout, COD King, HillTeck, NimbusPost).
6. **Meta's ad API needs manual review that takes weeks; Google Ads Basic Access takes about five business days.** This sets the clock on any build.
7. **India's DPDP Act applies, with an 18-month phased window** — not a blocker at MVP stage, but it shapes what data you should touch.

### ⚠️ Vendor claim — they say it, we haven't independently confirmed

- BiteSpeed's roughly $10M ARR (third-party estimate)
- SeerFlow's customer logos and their real usage
- EasyInsights computing "cost per successful purchase"
- Shiprocket's built-in RTO/NDR dashboard by courier and region

### ❓ Unverified / inference — believed, not proven

- Roughly 800–2,500 Indian D2C brands in the addressable band
- That RTO attributed back to *campaign and creative* is a genuinely unfilled gap
- That founders would pay for this at all

---

# PART 5 — What we believed that turned out to be WRONG

This is the most important section in the document. Read it twice.

## The thesis, as written for the last three days

> *"The real verified gap is India-native data — no major global tool supports Razorpay, Cashfree, PayU or Indian logistics carriers. The top-right quadrant is empty."*

## What today's research found

**A product called SeerFlow (seerflow.in) already exists and already does this.** It markets itself as a "Business Command Centre for Indian D2C: profit, cash flow & RTO." Its published integrations:

- **Store**: Shopify
- **Payments**: Razorpay, Cashfree, PayU, PhonePe, Easebuzz
- **Couriers**: Shiprocket, Delhivery, Shadowfax, NimbusPost, iThink Logistics, Shipway, Bigship
- **Ads**: Google Ads (Meta gated pending review — the exact same API queue we'd be standing in)

It computes per-order contribution: order value, minus COGS, payment fees, shipping, returns and ad spend. **Published pricing: $25 / $70 / $180 per month.** 14-day trial, no card. Named customer logos. DPDP mentioned.

That is, feature for feature, the product in our deck.

## Why we missed it

Both earlier research passes searched the **global** competitor set — Triple Whale, Polar, Northbeam, Rockerbox, Daasity, Glew, Lifesight, Putler — and asked "do these support India?" The answer was correctly "no." Nobody asked the different question: **"has an Indian company already built this?"**

That is a flaw in how the research was designed, not new market movement. SeerFlow didn't launch today. **It is the second time desk research on this idea has quietly returned the answer we wanted.** The first was finding zero founders complaining about the pain and treating that as "not yet found" rather than as evidence.

## Two more things that shrink the wedge

- **EasyInsights** (Indian) pulls RTO and cancellation data to compute *cost per successful purchase* — RTO-adjusted CAC, one of our two strongest jobs.
- **Shiprocket** already gives RTO/NDR dashboards by courier and region, **free, inside the shipping account most target brands already pay for.** Never compete with free-and-already-installed on the same axis.

## And the AI feature is becoming free

Shopify ships an MCP server. Polar Analytics publishes a guide for connecting a store to Claude, plus its own MCP across 45+ sources including ad spend, shipping and payments. Meaning: **"ask your business data a question in plain English" is turning into plumbing you get by connecting a server.** The deck's hero feature on slide 3 is not just undifferentiated — it is on its way to being free.

**The asset that still has value is the joined, cleaned dataset. Not the chat on top of it.**

---

# PART 6 — So: is there a real edge? The honest answer

**There is no technical edge. Not one.**

Every piece is built and proven: the connectors exist, the profit calculation is a mature product category worldwide, an Indian competitor ships the full India connector list at $25/month, and the AI layer is commoditising.

What *might* still be there, in descending order of honesty:

**1. Distribution — the strongest of a weak set.**
SeerFlow appears small and unknown. India's D2C market is enormous and under-served. Founder-led selling into a network SURGE already touched — suppliers, manufacturers, packaging vendors, agency owners — is an advantage no foreign tool has and a bigger competitor can't buy quickly.
*But be clear about what this is: a sales bet, not a moat. If you win, you win by out-selling, not by out-building. Say that out loud to investors instead of claiming an empty quadrant.*

**2. The un-taken join: RTO by campaign and creative.**
Shiprocket shows RTO by courier and pincode. EasyInsights feeds RTO back into ad audiences. Nobody clearly shows *"this specific creative brings orders that never get delivered."* That is a narrow, specific, possibly real gap.
*Confidence: unverified inference. It must be checked directly against SeerFlow's live product before it goes in any deck.*

**0. Added 2026-08-30, and now the strongest of the three — segment customers by DELIVERY OUTCOME, not purchase behaviour.**

Klaviyo, WebEngage, MoEngage and BiteSpeed all group customers by what they bought and what they opened. Nobody groups them by what they *took delivery of*, because that needs payments + logistics + orders joined at order level — the exact join being built for per-order profit. Segments only you would have:

- customers who order COD and refuse delivery (serial RTO)
- customers who always pay prepaid and never return (your profitable cohort)
- pincodes running high RTO
- the ad creative whose customers don't take delivery

Then use those segments to decide who gets a campaign. A WhatsApp marketing message costs ₹0.8631; a 5,000-person campaign including 800 serial-RTO customers burns ~₹690 to generate orders that lose money shipping both ways. Suppress them and you save the spend *and* the losses. **A founder can verify that against their own dashboard in ten minutes.**

Positioning: **"don't market to customers who don't take delivery."** No global tool can compute it (no Indian logistics data); no Indian messaging tool can compute it (no joined dataset). *Unverified: that SeerFlow doesn't do this — it presents as analytics-only, but check during the trial.*

Crucially this is a **byproduct** of the profit engine, not a second product. And it needs no BSP licence: AiSensy's API (verified) accepts contacts with custom attributes, tags, and template-campaign triggers, so you own the segment logic and push audiences through the BSP the brand already pays for.

Cost of this direction, honestly: **personal data comes into scope**, which reverses v0's deliberate no-PII posture and brings DPDP obligations for real. Sequence it — profit engine first without PII, segmentation in v1 with a proper consent flow.

**3. Nothing else.**
Consolidation, AI narration, India connectors, per-order profit — all table stakes now.

## What this means practically

- **The deck is now wrong in two places** (slide 3's hero claim, slide 9's "empty quadrant") and must not go to FasterCapital or anyone else until rewritten.
- **Price expectations must come down.** A live Indian competitor at $25–$180/month caps this. Willingness-to-pay conversations start at **₹2,000–₹15,000/month**, not at Triple Whale's $124–$375.
- **The validation question has changed shape.** It is no longer just *"is the pain real?"* It is now: **"a cheap product that solves this already exists — why is nobody using it?"**

That second question is *better news than it sounds*. It is faster and cheaper to answer than 15 cold interviews, and the answer is the actual product spec. If founders have never heard of SeerFlow, the market is uneducated and winnable by distribution. If they tried it and dropped it, *why* they dropped it is your feature list. If they're happily paying, the thesis is dead and you've saved 90 days.

**You can start answering it today, for free: take SeerFlow's 14-day trial and read the product.**

---

# PART 7 — The feature list: build, connect, or drop

The deck describes ten things. They are not equal. Rated against everything above:

| # | Feature | Verdict | Why |
|---|---|---|---|
| A | One dashboard instead of 6–8 logins | **Pitch, not product** | This is plumbing. Looker Studio approximates it free. It's how you *describe* the product, not what makes it worth paying for. |
| B | AI explains "what changed and why" | **Demote** | Polar, Lifesight and Triple Whale already ship it, and MCP is making it free. Remove from the hero slide. |
| C | **True profit per order** after RTO, COD, shipping, ad spend | **BUILD — this is v0** | The one job with a real answer nobody in India gives well. SeerFlow does give it — which is the competition, not a reason to skip it. |
| D | **RTO attribution by campaign, creative, carrier, pincode** | **BUILD second** | The narrowest genuinely-unclaimed ground. Verify against SeerFlow first. |
| E | WhatsApp automation | **CONNECT, do not build** | Reading BSP data into the profit view costs a fraction of becoming a BSP. Building it means fighting BiteSpeed head-on. |
| F | Email / SMS automation | **DROP** | Klaviyo, WebEngage, MoEngage, Mailchimp. No reason to be here. |
| G | Warehouse / inventory monitoring | **DROP** | Wrong buyer (ops, not the founder). Unicommerce and Increff own it. |
| H | Marketplace panels (Amazon/Flipkart/Myntra) | **DROP** | Wrong segment. Your target sells on their own store. |
| I | Private brand-trained AI copilot | **ROADMAP ONLY** | Correct as a future story. Do not let it drift into the build. |
| J | "Ten subscriptions, one bill" | **TEST** | A procurement argument, not a feature. Cheap to test in conversation; may matter more than any feature, or not at all. |

## What the wider scope actually costs (checked 2026-08-30)

Priyam's counter-argument is that the differentiator is analytics **plus** WhatsApp, Gmail, a customer database and warehouse monitoring — things SeerFlow does not do. That distinction is real. Here is what each one costs.

**WhatsApp — you cannot build it in-house.** Meta does not allow direct access to the WhatsApp Business API; you must go through a BSP or become one. Indian per-message rates as of 2026: marketing ₹0.8631, utility ₹0.115, authentication ₹0.115, service (customer-initiated) free. On top: BSP markup of ₹0.10–₹0.30/message or ₹999–₹9,999/month, then 18% GST. Reselling that against BiteSpeed, AiSensy and Wati — who buy at volume — is margin-negative until large. **Connect to BSP data; don't become one.**

**Gmail — a recurring annual security audit.** Reading a user's inbox needs Google *restricted scopes*, which require a security assessment by a Google-empanelled third-party assessor under the CASA framework, **repeated every 12 months**, at your cost, before production access. That is a recurring compliance bill incurred pre-revenue, for data you can get elsewhere: order and shipping emails are already available from the store and courier APIs. **Cut Gmail.**

**Customer database — reverses the compliance plan.** v0 deliberately avoids storing customer phone numbers and emails so DPDP obligations stay trivial. A customer database is personal data by definition; adding it triggers consent, deletion and breach handling on day one. Defer past v0.

**Warehouse — decide which one you mean.** "Am I about to stock out of my best SKU?" is nearly free — Shopify already has inventory levels, it's a query. A real WMS (bins, pick-pack, GRN, multi-location) is Unicommerce/Increff/EasyEcom territory, sold to an ops manager, and is a separate company.

**The version of the scope argument that works: read their data, don't replace them.** Pull WhatsApp campaign data from the BSP and customer data from the store into the profit view, and you can say things nobody else can — *"your cart-recovery flow drove 340 orders, 31% RTO'd, net −₹47,000."* One product with rich inputs, not four products.

**And bundling is a late strategy.** Zoho, Shiprocket, GoKwik and Razorpay each won one wedge, earned distribution, then bundled from strength. Nobody gets distribution *by* bundling. More scope also doesn't answer the open question: if 15 founders won't pay for the core number, they won't pay for the bundle. But it is **free to test** — add to question 5: *"what would you drop to get one bill?"*

## The contradiction in the current deck that must be fixed

Slide 6 says WhatsApp, email/SMS **and** warehouse monitoring are all built **in-house**. Slide 5 says the MVP is GA4 + one payment gateway + one courier. **Those cannot both be true.** In-house means three separate products, each with an entrenched incumbent, on a $40–60K ask and a few hours a week. An investor reads that as scope confusion, not ambition. Keep "in-house" as a stated philosophy for later; delete it as a present-tense claim.

---

# PART 8 — What v0 actually is

**One screen. One question. Nothing else.**

> *"Show me every order from last month, what it actually earned or lost after product cost, payment fees, shipping, RTO and the ads that produced it — grouped by channel and campaign."*

That's it. No WhatsApp automation, no email, no warehouse, no marketplaces, no AI chat, no real-time anything.

**Why this and not a prettier dashboard:** a dashboard of connected plumbing is something any competent agency rebuilds in Looker Studio in a week. A number nobody else can compute is not.

**Design-partner terms:** 3 brands, free for 90 days, in exchange for a weekly 30-minute call and permission to use anonymised data. Convert to paid at day 91. Say this out loud at the start so it isn't awkward later. If none converts, they were never customers — that is a second kill gate.

---

# PART 9 — What we would need to build, in order

Written in plain language. This is the shape of the thing, not code.

## Step 1 (day one, before anything else): file the API applications

Meta's ad API needs manual review and often takes **weeks**. Google Ads Basic Access takes about **five business days**. Razorpay/Cashfree and Shiprocket/Delhivery use merchant API keys and need no approval queue.

So the first action of any build is **filing the Meta and Google applications** — before any design, any database, any screen — so those weeks pass while other work happens. This is the single most common avoidable delay in this plan.

## Step 2: get the data, once a night

For each connected brand, a scheduled nightly pull from each source into its own raw table — the original response stored as-is, plus the handful of fields actually used.

**Nightly is enough.** Nobody in this segment watches D2C numbers minute by minute. Choosing nightly over real-time saves weeks and costs nothing.

## Step 3: the join — and why the existing scaffold is wrong

This is the heart of the product, so it's worth being precise.

You need rows at the level of **one order**:

- **Order** — what was sold, when, at what price, through which channel and campaign
- **Payment** — what the gateway actually settled, minus its fee, and when it hit the bank (for COD, whether it was ever collected at all)
- **Shipment** — what shipping cost, which courier, delivered or RTO'd, and the cost of the return leg
- **Ad cost** — spend attributed down to the order or the campaign that produced it
- **Product cost (COGS)** — what the item cost you

Join those five, and per-order profit falls out. Group by channel, and you get the answer.

**The scaffold that exists today stores something different**: a table of one number per brand, per day, per channel — for example *("razorpay", "revenue", 45000)*. That is a **summary**. You can never work backwards from "total revenue on Tuesday" to "this order lost me ₹140." The level of detail is wrong, and no amount of interface on top can fix it. **That schema must be replaced, not extended.**

## Step 4: one page

A table of orders and a channel summary. That is the whole interface for v0.

## Step 5: data handling from the first commit

- Separate each brand's data from every other brand's, from day one
- Plain-language consent notice when a brand connects an account
- **Do not store customer phone numbers or email addresses in v0.** Order-level IDs are enough to compute profit, and staying out of personal data entirely keeps DPDP compliance trivial for as long as possible. The day WhatsApp automation ships, that changes — another reason it isn't in v0.

---

# PART 10 — What we are deliberately NOT building

Written down so it can't quietly creep back in:

- ❌ Not a payment company — connect to Razorpay/Cashfree/PayU, never replace them
- ❌ Not a logistics company — connect to Shiprocket/Delhivery, never replace them
- ❌ Not a WhatsApp BSP — read their data, don't become one
- ❌ Not email/SMS marketing
- ❌ Not warehouse or inventory management
- ❌ Not marketplace management
- ❌ No real-time data, no data warehouse, no dbt, no streaming
- ❌ No AI chat interface in v0

---

# PART 11 — How we decide whether to build at all

The rule stands: **no production code until validation comes back Green or Amber.**

## Revised plan, given today's findings

**Phase 0 — this week, ~2 hours, free.**
Take SeerFlow's 14-day trial. Read the product properly. Answer: does it actually do campaign-level RTO attribution, or only courier/pincode? What does it do badly? Is it a real company or a side project? This one afternoon may settle the entire idea.

**Phase 1 — 15 founder conversations, 20 minutes each, over two weeks (~10 hours).**
This is the only track that should consume real hours.

**Where to find them, in yield order:**
1. Warm contacts from SURGE — suppliers, manufacturers, packaging vendors, agency reps. Each knows 10–20 brands. Free, highest conversion.
2. **Performance-marketing agency owners** — one services 15–30 brands and personally builds the monthly reports by hand. Most acute and most articulate about the pain. *Diagnostically worth five founder calls each — but not a substitute for founders when judging willingness to pay, because agencies buy differently.*
3. D2C Insider — an active Indian D2C founder community that names founders publicly. Free target list even without joining.
4. Vendor customer-story pages — Shiprocket, Razorpay, Unicommerce, AiSensy, Wati publish named case studies. Pre-qualified, free.
5. Instagram DMs to the brand account — in this GMV band the founder often runs it personally.

**The outreach message** (no pitch, one send):

> Hi <name> — I ran a D2C brand (SURGE, men's hair styling) and I'm researching how founders actually track performance across ads, payments and shipping. I'm not selling anything and I'm not building this for you. 20 minutes, and I'll send you the anonymised findings from all 15 conversations. Free Tue or Wed?

The "I'll send you the findings" line is the strongest lever here and costs one email at the end.

## The single rule that makes or breaks this

**Do not describe the product for the first 15 minutes.** Ask about last week, never about a hypothetical feature. A founder asked "would you like per-order profit?" says yes, always, and the answer is worthless. Two desk-research passes already failed by asking comfortable questions — a leading interview round will fail the same way while feeling like success.

**The eight questions:**
1. Walk me through the last time you checked how the business was doing. Which screens, in what order? *(count them, write the real tool names)*
2. How long did that take, how often, and who does it?
3. What did you do with the numbers afterwards? *(spreadsheet? screenshot into WhatsApp? nothing?)*
4. Last time a number looked wrong — what happened, how long to work out why?
5. What do you pay today, in rupees, across analytics / WhatsApp / email / reporting? *(figures, not ranges)*
6. **Has anyone on your team ever built a sheet, script or Zap to stitch these together?**
7. How do you track RTO and COD failure by channel or campaign today?
8. What have you tried for this and dropped — and why? **(now including: SeerFlow, TrueProfit, BeProfit, any profit app)**

Then, and only then: describe the idea in one sentence, ask **"what would have to be true for you to switch?"**, and for anyone keen, *"would you pay ₹X to be a design partner for 90 days?"* A yes with a number is data. "Sounds interesting, keep me posted" is a no.

**Write up each call the same day**, one paragraph, with verbatim quotes. Summaries written a week later drift toward whatever you want to believe.

**Free bonus at the end of every call:** *"if a tool did this, what would you expect it to be called?"* Fifteen founders' instincts beat a naming brainstorm.

## Kill criteria — set now, so they can't be renegotiated later

**🟢 GREEN — build it:**
- ≥8 of 15 open 4+ separate tools in a normal week, **and**
- ≥5 have already built their own sheet/script/Zap, **and**
- ≥5 name a specific rupee or hours-lost cost, **and**
- ≥3 verbally commit to a paid pilot **with a number attached**

**🟡 AMBER — real pain, wrong shape:** the pain concentrates on one job (most likely true per-order profit, or RTO by campaign) rather than "too many dashboards." Then build *that one job* as a point solution and drop the hub framing. **This is a good outcome, not a consolation prize** — it's an easier product to build and sell.

**🔴 RED — shelve it:** fewer than 5 open 4+ tools weekly, **or** nobody has built their own workaround, **or** zero pilot commitments with numbers. Put the hours into the Pathology Lab and revisit only on new evidence.

**Why question 6 carries the most weight:** it is behaviour, not opinion, and it's exactly the evidence two desk-research passes could not find. Someone who spent their own Sunday building a sheet to stitch Razorpay and Shiprocket together has proven the pain in a way no survey answer can fake. If none of 15 has ever bothered, that's your answer — the pain is real but not expensive enough to pay for.

## How features get ranked afterwards

For each feature, per call, record four things: **(1)** did they raise it unprompted? **(2)** have they built a workaround for it? **(3)** did they name a rupee or hours cost? **(4)** would they pay for it alone, with a number?

**Ranking rule, fixed now: columns 1 and 2 decide. Column 4 is tie-break only.** Unprompted mention plus a self-built workaround is behaviour. "I'd pay for that" at the end of a friendly call is politeness. If the two rankings disagree, **behaviour wins.**

Whichever single job scores highest becomes v0 — **even if it isn't per-order profit, and even if it makes the current deck wrong.**

---

# PART 12 — Money

**The ask on the deck:** $40K–$60K pre-seed, sized for 90 days of validation plus an MVP of three integrations.

**Own pricing: still not set, deliberately** — to be set with design partners, not guessed.

**What changed today:** the pricing anchor. The deck leans on Triple Whale ($124–$375/mo) and Putler ($20–$750/mo) as comparables. But a live Indian competitor publishes **$25 / $70 / $180**. Indian D2C brands in the ₹10L–₹2Cr band are price-sensitive and compare in rupees. **Realistic band: ₹2,000–₹15,000/month.** Any plan built on Western SaaS pricing is wrong.

**Also on the money side — FasterCapital.** The draft outreach email is unsent. Before sending anything: FasterCapital's reputation online is *contested* — there's a Trustpilot presence and review coverage alongside a dedicated critic site and multiple "is it a scam" discussions. This has not been investigated deeply enough to call either way. Given the category (equity- or services-for-funding accelerators, where founders regularly lose time and equity), spend ten minutes reading founder accounts and understand exactly what is being exchanged. **And separately: pitching an unvalidated demand side to anyone is premature. The interviews come first.**

---

# PART 13 — Risks, most serious first

| # | Risk | How real | What to do |
|---|---|---|---|
| 1 | **Demand is still completely unproven** | Two desk passes found zero founders complaining. Zero interviews done. | The 15 interviews, with kill criteria fixed in advance. Nothing else matters until this is answered. |
| 2 | **A live Indian competitor already ships the product** (SeerFlow) | Verified from its own site | Take the trial. Find out why it hasn't won — that answer is the product spec, or the reason to stop. |
| 3 | **No technical moat exists** | Verified — everything is built somewhere | Compete on distribution and founder-led selling, and say so honestly rather than claiming an empty quadrant. |
| 4 | **Razorpay commoditises the payments layer** | Real — it's building its own RTO Analytics Dashboard | Differentiate on the cross-channel join (ads + payments + logistics together), never on payments data alone. |
| 5 | **Shiprocket gives RTO dashboards free** | Vendor claim, credible | Never compete with free-and-already-installed on courier/region RTO. Go to campaign-level attribution or don't go. |
| 6 | **Time.** A few hours a week, and Pathology Lab is ranked #1 with a working prototype and a real ₹40k + AMC commitment | Certain | Nothing here justifies taking hours from the lab. This runs alongside, on conversations only. |
| 7 | **The deck contains claims that are now false** | Certain | Fix slides 3, 9 and 15 before it goes to anyone. |
| 8 | **Meta API approval takes weeks** | Verified | File day one of any build, before anything else. |

---

# PART 14 — Open questions that need Priyam's answer

1. **Slide 15 says founder conversations are already underway. Have any actually happened?** If not, that line must be removed before the deck goes anywhere.
2. **Given that SeerFlow exists at $25/month — do you still want to pursue this?** A no now is a good decision, not a failure. It frees hours for the Pathology Lab, which has an actual paying commitment.
3. **If yes: do you accept that this is a distribution bet with no technical moat?** The whole pitch has to change shape if so.
4. **Will you do the SeerFlow trial this week before anything else?** Two hours, free, potentially decisive.
5. **The name.** Setu, Dukaan OS and Vyapar IQ are dead (real Indian companies). Sutradhar, Threadline and Compass Commerce are weak with no clean `.com`. Fresh candidates are probably needed — but naming is timeboxed to 90 minutes, **after call #5**, and not before. Renaming an unvalidated product is the most satisfying available form of procrastination on this idea.

---

# PART 15 — Glossary

- **D2C** — direct to consumer. A brand selling on its own website rather than through retailers or marketplaces.
- **GMV** — gross merchandise value. Total value of orders placed, before any costs. Not revenue, and definitely not profit.
- **COD** — cash on delivery. Customer pays the courier in cash at the door.
- **RTO** — return to origin. Delivery failed or was refused; the parcel comes back to you. You've paid shipping both ways and the ad, and received nothing.
- **NDR** — non-delivery report. The courier's record of a failed delivery attempt — the step before an RTO.
- **COGS** — cost of goods sold. What the product itself cost you.
- **Contribution margin** — what's left from an order after all the variable costs of that order. The number this product is built to compute.
- **CAC** — customer acquisition cost. Ad spend divided by customers acquired.
- **MER** — marketing efficiency ratio. Total revenue divided by total ad spend.
- **ROAS** — return on ad spend, usually per campaign.
- **3PL** — third-party logistics. A company that stores and ships your stock for you.
- **BSP** — business solution provider. A licensed reseller of the WhatsApp Business API (AiSensy, Wati, Interakt, Gupshup).
- **OMS** — order management system.
- **DPDP Act** — India's Digital Personal Data Protection Act, 2025. Governs handling of personal data; 18-month phased compliance window.
- **MCP** — Model Context Protocol. A standard way to connect a data source to an AI assistant like Claude, so it can answer questions about that data.
- **Design partner** — an early customer who uses the product free or cheap in exchange for close feedback.
- **The Mom Test** — the interviewing principle that you ask about someone's actual past behaviour, never about whether they'd like your idea, because everyone says yes to the second.

---

*Written 2026-08-30. Source of truth remains `Ecommerce Hub.md` in this folder. Update both when either changes.*
