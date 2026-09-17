# coverage.os — Project Instructions

## What this is
A personal research and productivity tool for a regional bank coverage /
origination professional working across East Africa, sector-agnostic.

**This is not an approved or endorsed employer system.** It is a personal
project. No employer name, client names, employer-specific product names,
or employer-specific credit/risk logic are ever stored in this project.
Keep all content generic and market/sector-general — never bank-specific.

## Confidentiality guardrail (always active)
Before saving any note, brief, or file anywhere in this project, check
whether the content includes: non-public deal terms, pricing, internal
credit decisions, non-public client financials, or any employer-identifying
detail. If it does, don't block — flag it:

> "This looks like it may contain non-public or employer-specific
> information. Confirm this is safe to store, or remove/generalize it."

Wait for confirmation before writing the file.

## Geographic & sector scope
Countries: Kenya, Uganda, Tanzania, Rwanda, Burundi, Ethiopia.
Sector-agnostic — coverage spans all sectors within these markets.

## Folder structure
```
coverage.os/
├── CLAUDE.md
├── dashboard.html
├── _sector-intel/
│   └── [sector].md
├── _templates/
│   └── prep-brief-template.md
├── kenya/[sector]/[company]/
├── uganda/[sector]/[company]/
├── tanzania/[sector]/[company]/
├── rwanda/[sector]/[company]/
├── burundi/[sector]/[company]/
└── ethiopia/[sector]/[company]/
```
File naming: `YYYY-MM-DD_CompanyName_prep.md` (+ matching `.docx` on request).

## Core command: `/prep [Company], [Country]`
This is a standing analytical bar, not a news roundup. A brief that only
restates the company's own headline numbers has not met it — the point is
to surface what the company's own messaging doesn't say, cross-checked
against the regulator, the sovereign, and direct peers. Expect this to take
15–25 searches per brief, not 5–6. Depth is not optional and not something
to trade off for speed; if time is short, say so and flag which sections
are thin rather than quietly shipping a shallow brief.

1. Web search — company layer: recent news, financials/performance signals,
   sector positioning, leadership/ownership changes, funding, expansions.
2. Web search — regulatory & macro layer (required, not optional):
   - The country's sovereign credit rating history (Moody's/S&P/Fitch) and
     direction of travel, not just the latest action.
   - Whether/how the company's own credit rating has moved with the
     sovereign — this is usually checkable directly (rating agencies often
     publish it) and is the cleanest evidence of sovereign-linkage risk,
     not an assumption.
   - The regulator's own published data or financial stability reports for
     the sector, and any independent multilateral read (IMF, World Bank) of
     the same economy — read them looking for places they diverge from
     each other or from the regulator's own headline messaging.
   - IMF program status and external-debt/rollover profile if relevant to
     the country's near-term fiscal position.
3. Web search — peer layer: benchmark the company's headline growth or
   profitability against direct peers for the same period. A number that
   is impressive on its own but bottom-of-peer-group is a different story
   — say which one it is.
4. Populate the Prep Brief template (below), including the Regulatory &
   Macro Cross-Check section. Every claim should be dated and sourced;
   distinguish what's confirmed from what's inferred.
5. Save as markdown to `{country}/{sector}/{company}/YYYY-MM-DD_prep.md`.
   Infer sector if not given; ask if genuinely ambiguous.
6. Run the confidentiality guardrail check before saving.
7. Regenerate `dashboard.html` (`python3 scripts/generate_dashboard.py`).
8. Offer a `.docx` export on request (use the docx skill).
9. Natural-language requests work identically to the slash command —
   e.g. "I'm meeting the CFO of [Company] tomorrow, help me prep."

## Core command: `/sector [sector], [country]` (phase 2 — not yet built)
Will generate/update a sector snapshot in `_sector-intel/[sector].md`:
market size and growth signals, regulatory environment, notable recent
deals or moves (public only), key players, risks and opportunities.
This file will persist and get refreshed over time — the compounding
knowledge base referenced by every `/prep` in that sector.

## Prep Brief template
```markdown
# [Company Name] — Meeting Prep
Date: [meeting date] | Country: [country] | Sector: [sector]
Generated: [today's date]

## Snapshot
- What they do, size, ownership, recent trajectory (2–3 lines)

## Why Now
- Recent news, results, expansions, funding, leadership changes,
  regulatory shifts relevant to them or their sector

## Sector Context
- Where this sector sits regionally right now (growth, stress points,
  regulatory environment, comparable deals if public)

## Regulatory & Macro Cross-Check
- Sovereign trajectory & linkage: the country's credit rating history
  (not just the latest action) and whether/how it has moved the
  company's own rating in lockstep — evidence of sovereign-ceiling
  exposure, not an assumption
- Regulator vs. independent read: where the regulator's own published
  figures (reserves, current account, financial stability reports)
  diverge from an independent multilateral's (IMF/World Bank) read of
  the same economy, or from the company's own messaging
- Peer-adjusted read: how the company's headline growth/profitability
  compares to direct peers for the same period — flag if a "strong"
  number is actually bottom-of-peer-group
- Quality-of-earnings check: how much of any reported improvement is a
  cyclical/monetary tailwind (rate cuts, one-off gains, FX moves) versus
  structural, and what would reverse it
- What couldn't be verified: name the specific gaps (e.g.
  subsidiary-level capital ratios, latest supervisory survey findings)
  rather than omitting them or guessing

## Origination Angles
1. [Angle] — rationale — what product/structure fits
2. [Angle] — rationale — what product/structure fits
3. [Angle] — rationale — what product/structure fits

## Talking Points
- [Opening line / hook]
- [Question to ask that shows sector fluency]
- [Point that differentiates the pitch]

## Open Questions / Things to Verify Live
- [Anything the research couldn't confirm]

## Sources
- [Public sources used, with dates]
```
Use generic descriptors for structures/products (e.g. "trade finance
facility," "working capital structure") — never employer-specific product
names or internal terminology.

## Dashboard
Maintain `dashboard.html` at the project root as a static file, regenerated
whenever a brief or sector file is created/updated (run
`python3 scripts/generate_dashboard.py` from the project root). It shows:
recent briefs (newest first), and a browsable country → sector → company
index. No server required — just open the file in a browser.

## Output format rule
Markdown is always the working file. `.docx` is generated only on request,
using the docx skill, for sharing/printing.

## Build priorities
**This week (v1):** folder scaffolding, `/prep` command, confidentiality
guardrail, `.docx` export on request, `dashboard.html` generator.

**Later phases, in this order:**
1. Sector market-intelligence monitor (ongoing tracking feeding `_sector-intel/`)
2. Relationship & contact history mapper (non-confidential interaction notes)
3. Origination memo / pitch drafting assistant
4. Deal pipeline & follow-up tracker
5. Google Calendar integration for proactive prep flagging

Do not build items outside "This week" unless explicitly asked.
