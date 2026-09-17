---
description: Generate a coverage.os Prep Brief for a company meeting
---

Arguments: `$ARGUMENTS` — expected as `[Company], [Country]` (country optional
if unambiguous from context, e.g. only one company of that name in scope).

Follow the `/prep [Company], [Country]` process defined in this project's
root `CLAUDE.md`, exactly. This is a standing analytical bar, not a news
roundup — a brief that only restates the company's own headline numbers has
not met it. Expect 15–25 searches per brief, not 5–6. If time is genuinely
short, say so explicitly and flag which sections are thin — don't quietly
ship a shallow brief.

1. **Identify scope.** Parse company and country from the arguments. Infer
   the sector from research; only ask the user if it's genuinely ambiguous
   (e.g. a conglomerate spanning multiple unrelated sectors).
2. **Research — company layer.** Web search for recent news, financial/
   performance signals, sector positioning, and leadership/ownership
   changes. Prefer sources from the last 12 months; note the date of each.
3. **Research — regulatory & macro layer (required).**
   - Pull the country's sovereign credit rating history (Moody's/S&P/
     Fitch) — the trajectory, not just the latest action.
   - Check whether/how the company's own credit rating has moved with the
     sovereign. Rating agencies often publish this directly — look for it
     rather than assuming linkage.
   - Pull the regulator's own published data or financial stability
     reports, and an independent multilateral read (IMF/World Bank) of the
     same economy. Look specifically for places they diverge from each
     other or from the company's own messaging.
   - Check IMF program status and external-debt/rollover exposure if
     relevant to the country's near-term fiscal position.
4. **Research — peer layer.** Benchmark the company's headline growth or
   profitability against direct peers for the same period. State plainly
   if a number that looks strong in isolation is actually bottom-of-peer-
   group.
5. **Populate the template.** Use `_templates/prep-brief-template.md` as the
   structure, including the **Regulatory & Macro Cross-Check** section —
   this is not optional. Fill every section: Snapshot, Why Now, Sector
   Context, Regulatory & Macro Cross-Check, Origination Angles (3, each
   with rationale + fitting product/structure described generically),
   Talking Points, Open Questions, Sources. Every material claim should be
   dated and sourced; explicitly name what couldn't be verified rather than
   omitting it or guessing.
6. **Confidentiality guardrail.** Before writing the file, scan the drafted
   content for anything that reads like non-public deal terms, pricing,
   internal credit decisions, non-public client financials, or any
   employer-identifying detail. If found, don't save — flag it to the user:
   *"This looks like it may contain non-public or employer-specific
   information. Confirm this is safe to store, or remove/generalize it."*
   Wait for confirmation before writing.
7. **Save.** Write the brief to
   `{country}/{sector}/{company}/YYYY-MM-DD_CompanyName_prep.md` (lowercase,
   hyphenated country/sector/company folder names; create folders if new).
8. **Regenerate the dashboard.** Run `python3 scripts/generate_dashboard.py`
   from the coverage.os project root so `dashboard.html` picks up the new
   brief.
9. **Offer export.** Do not generate a `.docx` by default. Only produce one
   if the user explicitly asks, using the docx skill, saved alongside the
   `.md` file with the same basename.

Natural-language requests that clearly mean the same thing (e.g. "I'm
meeting the CFO of [Company] tomorrow, help me prep" or "pull together a
brief on [Company] in [Country]") should trigger this exact same flow, at
the same depth — don't require the literal `/prep` command, and don't
lighten the research bar just because it wasn't invoked as a command.
