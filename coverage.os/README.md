# coverage.os

Personal research and meeting-prep command center for East Africa deal
origination coverage (Kenya, Uganda, Tanzania, Rwanda, Burundi, Ethiopia).
Sector-agnostic. Built with Claude Code.

Not an approved or endorsed employer system — personal project, no
employer- or client-confidential data stored here. See `CLAUDE.md` for the
full project instructions, confidentiality guardrail, and command spec.

## Quick start
- Generate a Prep Brief: run `/prep [Company], [Country]` in Claude Code
  (from this folder), or just ask naturally — e.g. "I'm meeting the CFO of
  [Company] tomorrow, help me prep."
- Browse what exists: open `dashboard.html` in any browser.
- Everything lands as markdown under `{country}/{sector}/{company}/`; a
  `.docx` copy is generated only if you ask for one.

## Status
v1 (this week's build): folder scaffolding, `/prep` command, confidentiality
guardrail, `.docx` export on request, `dashboard.html` generator. Sector
monitoring, relationship mapping, memo drafting, pipeline tracking and
calendar integration are later phases — see `CLAUDE.md` § Build priorities.
