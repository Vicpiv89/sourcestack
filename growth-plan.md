# SourceStack — Growth Plan v2 (July 8, 2026)

## What changed since v1

The old plan said: *"what does SourceStack do that you can't just Google?"* — that question is **answered and shipped**. Everything below assumes the current reality:

| Asset | Status |
|---|---|
| Face Scan — photo → 14 measured ratios → personalized plan | ✅ LIVE. In-browser, private, free. **This is the hook. Every seed leads with it.** |
| Payments | ✅ LIVE — US$19/mo Stripe, paid-only membership, cancel via portal |
| Domain | ✅ sourcestack.app (real email: support@sourcestack.app) |
| Reddit account | ✅ **13k karma — seeding can start TODAY. No warm-up needed.** |
| Florida July 11–19 | **8 working days.** No detailing, no distractions. Most focused block of the summer. |

## The funnel (memorize this)

**Reddit/TikTok comment → free Face Scan (wow moment, "photo never leaves your browser") → results show exactly what's fixable → "Unlock my plan" gate → $19/mo.**

You are never selling a database in a comment. You're offering a free 30-second scan. The scan sells the plan.

## The one funnel gap (build when you get 2 hours)

Accounts are paid-only now, which is right — but it means **zero lead capture from people who scan and leave.** Add an email field on scan results: *"Email me my results + a 30-day starter protocol."* Store in a `leads` table. That list becomes your nurture engine when Resend is set up. Until then, every non-buyer evaporates.

---

## Phase 1 — Before the flight (July 9–10)

Half a day total. Do in this order:

1. **GSC**: add `sourcestack.app` property → submit sitemap → URL-inspect + request indexing for: home, /scan, top 5 treatments, top 3 issues. (30 min)
2. **Stripe toggles** (if not done): customer receipt emails ON, failed-payment emails ON, customer portal saved. (5 min)
3. **support@ forwarding** at the registrar → your Gmail. Send yourself a test. (10 min)
4. **Thread hunting** (60 min): search Reddit for live threads matching the queries below. Save 10+ into the CRM's thread tracker. Sort by: posted <30 days ago, >5 comments, no good answer yet.
   - "minoxidil beard routine", "RU58841 source", "is [vendor] legit", "tretinoin vs adapalene", "canthal tilt", "jawline routine", "rate my stack", "where to buy BPC-157"
5. **Warm presence** (20 min): from the 13k account, drop 2–3 genuinely helpful **no-link** comments in r/tressless / r/Peptides today. Recent activity in-sub = credibility when the linked comments start.
6. **Analytics decision**: GSC only shows Google traffic. For Reddit/TikTok you're blind. Either add a free GoatCounter/umami script (30 min), or rely on UTM + Stripe. Recommended: add it.

## Phase 2 — Florida sprint (July 11–19)

**Daily block — 60–90 min, non-negotiable, tracked in the CRM:**

| # | Action | Rule |
|---|---|---|
| 1 | 3 helpful Reddit comments in target threads | 2 with a deep link, 1 pure value (no link). Best answer in the thread or don't post. |
| 2 | 2 TikTok/IG comment replies on looksmaxxing content | Lead with the scan: "there's a free browser tool that measures this from a photo" |
| 3 | 1 creator DM (10k–100k followers) | 1/day beats 20 in one day — no spam flags, real conversations |
| 4 | Reply to every response on your comments/DMs | Same day. Conversations convert; drive-bys don't. |
| 5 | Scoreboard check: GSC clicks, scans, Stripe MRR | 2 minutes. Numbers move = fuel. |

**One-time plays (spread across the week):**

- **Day 1–2 — Mod wiki DMs**: r/tressless, r/Peptides, r/SkincareAddiction + any looksmaxxing sub with a resources wiki. One polite DM each (template in CRM). A wiki listing is permanent passive traffic — highest ROI/hour on this list.
- **Day 3–4 — Value post #1** (r/looksmaxxing or similar): the scan, framed as show-and-tell, not promo: *"I built a free tool that measures 14 facial ratios from one photo — runs in your browser, photo never uploads. Roast it."* Builders showing work get upvotes; promoters get banned. Answer every comment.
- **Day 6–7 — Value post #2** (r/tressless or r/Peptides): data post: *"I compared 15 vendors on price + shipping for the 10 most common compounds — here's the table."* Post the actual table in the post body; link at the end. Data posts travel.
- **Throughout**: screenshot your own scan results for TikTok — 3-slide format: scan overlay → "what it found" → protocol. Post 2–3 during the trip. Zero-follower accounts can pull views on this format; the scan visual is inherently shareable.

**Rules of engagement:** never argue, never post the same link twice in one sub per day, never copy-paste comments (write fresh, reference the thread), disclose "I built this" when linking — Reddit rewards builders and destroys marketers.

## Phase 3 — Back home (July 20+)

- **Product Hunt launch** — Tuesday July 22 or Wed July 23. Prep during Florida downtime: headline ("Measure your face. Get your protocol."), 6 gallery screenshots, first-comment writeup, 5 friends primed to engage in hour 1. Target top 5 of the day.
- **First email send** to the leads list (needs Resend + the capture field above).
- **Discord seeding**: tressless/peptides Discords — 2 weeks of being helpful, then the link lands naturally.
- **Double down on whatever the CRM scoreboard says worked.** Kill what didn't.

## Phase 4 — Scale (September+, back at Western)

Unchanged from v1, in order: cornerstone blog guides → backlink swaps → affiliate links (once 1k+ visitors/mo) → Reddit Ads → Google Search Ads on "where to buy X" → Meta last. Paid only goes on top of proven organic.

---

## Scoreboard (July targets)

| Metric | Where | Target by Aug 1 |
|---|---|---|
| Site visitors | GoatCounter/GSC | 1,500 |
| Scans run | analytics event | 400 |
| Leads captured | Supabase `leads` | 150 |
| **Paying subscribers** | **Stripe** | **10 = $190 MRR** |
| Wiki listings | manual | 1+ |

First paying stranger is the only milestone that matters. Everything above exists to produce it. UTM every seeded link: `?utm_source=reddit&utm_medium=comment&utm_campaign=florida`.
