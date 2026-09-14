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
1. Web search: recent news, financials/performance signals, sector
   positioning, regulatory context, leadership/ownership changes.
2. Populate the Prep Brief template (below).
3. Save as markdown to `{country}/{sector}/{company}/YYYY-MM-DD_prep.md`.
   Infer sector if not given; ask if genuinely ambiguous.
4. Run the confidentiality guardrail check before saving.
5. Regenerate `dashboard.html` (`python3 scripts/generate_dashboard.py`).
6. Offer a `.docx` export on request (use the docx skill).
7. Natural-language requests work identically to the slash command —
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
