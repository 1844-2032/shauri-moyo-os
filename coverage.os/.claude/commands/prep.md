---
description: Generate a coverage.os Prep Brief for a company meeting
---

Arguments: `$ARGUMENTS` — expected as `[Company], [Country]` (country optional
if unambiguous from context, e.g. only one company of that name in scope).

Follow the `/prep [Company], [Country]` process defined in this project's
root `CLAUDE.md`, exactly:

1. **Identify scope.** Parse company and country from the arguments. Infer
   the sector from research; only ask the user if it's genuinely ambiguous
   (e.g. a conglomerate spanning multiple unrelated sectors).
2. **Research.** Web search for recent news, financial/performance signals,
   sector positioning, regulatory context, and leadership/ownership changes.
   Prefer sources from the last 12 months; note the date of each.
3. **Populate the template.** Use `_templates/prep-brief-template.md` as the
   structure. Fill every section — Snapshot, Why Now, Sector Context,
   Origination Angles (3, each with rationale + fitting product/structure
   described generically), Talking Points, Open Questions, Sources.
4. **Confidentiality guardrail.** Before writing the file, scan the drafted
   content for anything that reads like non-public deal terms, pricing,
   internal credit decisions, non-public client financials, or any
   employer-identifying detail. If found, don't save — flag it to the user:
   *"This looks like it may contain non-public or employer-specific
   information. Confirm this is safe to store, or remove/generalize it."*
   Wait for confirmation before writing.
5. **Save.** Write the brief to
   `{country}/{sector}/{company}/YYYY-MM-DD_CompanyName_prep.md` (lowercase,
   hyphenated country/sector/company folder names; create folders if new).
6. **Regenerate the dashboard.** Run `python3 scripts/generate_dashboard.py`
   from the coverage.os project root so `dashboard.html` picks up the new
   brief.
7. **Offer export.** Do not generate a `.docx` by default. Only produce one
   if the user explicitly asks, using the docx skill, saved alongside the
   `.md` file with the same basename.

Natural-language requests that clearly mean the same thing (e.g. "I'm
meeting the CFO of [Company] tomorrow, help me prep" or "pull together a
brief on [Company] in [Country]") should trigger this exact same flow —
don't require the literal `/prep` command.
