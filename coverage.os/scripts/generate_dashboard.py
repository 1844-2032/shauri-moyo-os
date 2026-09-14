#!/usr/bin/env python3
"""Regenerate dashboard.html from the Prep Brief markdown files in coverage.os.

Run from anywhere; writes dashboard.html to the coverage.os project root.
Invoke after saving or updating any *_prep.md brief:

    python3 scripts/generate_dashboard.py
"""
import re
from pathlib import Path
from datetime import datetime
from html import escape

ROOT = Path(__file__).resolve().parent.parent
COUNTRIES = ["kenya", "uganda", "tanzania", "rwanda", "burundi", "ethiopia"]


def parse_brief(path: Path) -> dict:
    text = path.read_text(encoding="utf-8", errors="replace")
    lines = text.splitlines()
    title_line = lines[0] if lines else ""
    title_match = re.match(r"#\s*(.+?)\s*—\s*Meeting Prep\s*$", title_line)
    company = title_match.group(1).strip() if title_match else path.stem

    meta_line = next((l for l in lines if l.startswith("Date:")), "")
    date_m = re.search(r"Date:\s*([^|]+)", meta_line)
    country_m = re.search(r"Country:\s*([^|]+)", meta_line)
    sector_m = re.search(r"Sector:\s*([^|]+)", meta_line)

    gen_line = next((l for l in lines if l.startswith("Generated:")), "")
    gen_m = re.search(r"Generated:\s*(.+)", gen_line)

    parts = path.relative_to(ROOT).parts  # (country, sector, company, filename)

    return {
        "company": company,
        "meeting_date": date_m.group(1).strip() if date_m else "—",
        "country": country_m.group(1).strip() if country_m else parts[0].capitalize(),
        "sector": sector_m.group(1).strip() if sector_m else parts[1],
        "generated": gen_m.group(1).strip() if gen_m else "—",
        "country_slug": parts[0],
        "sector_slug": parts[1],
        "company_slug": parts[2],
        "path": path.relative_to(ROOT).as_posix(),
        "mtime": path.stat().st_mtime,
    }


def collect_briefs() -> list:
    briefs = []
    for country_dir in ROOT.iterdir():
        if not country_dir.is_dir() or country_dir.name not in COUNTRIES:
            continue
        for md_file in country_dir.glob("*/*/*_prep.md"):
            briefs.append(parse_brief(md_file))
    briefs.sort(key=lambda b: b["mtime"], reverse=True)
    return briefs


def build_index(briefs: list) -> dict:
    index: dict = {}
    for b in briefs:
        country = index.setdefault(b["country"], {})
        sector = country.setdefault(b["sector"], {})
        sector.setdefault(b["company"], []).append(b)
    return index


def render(briefs: list, index: dict) -> str:
    generated_at = datetime.now().strftime("%Y-%m-%d %H:%M")

    if briefs:
        recent_rows = "\n".join(
            f'''      <tr>
        <td><a href="{escape(b["path"])}">{escape(b["company"])}</a></td>
        <td>{escape(b["country"])}</td>
        <td>{escape(b["sector"])}</td>
        <td>{escape(b["meeting_date"])}</td>
        <td>{escape(b["generated"])}</td>
      </tr>'''
            for b in briefs
        )
    else:
        recent_rows = '      <tr><td colspan="5" class="empty">No briefs yet — run /prep to generate one.</td></tr>'

    index_html_parts = []
    for country in sorted(index):
        sectors = index[country]
        sector_blocks = []
        for sector in sorted(sectors):
            companies = sectors[sector]
            company_items = "\n".join(
                f'          <li><a href="{escape(companies[company][0]["path"])}">{escape(company)}</a> '
                f'<span class="muted">({len(companies[company])} brief{"s" if len(companies[company]) != 1 else ""})</span></li>'
                for company in sorted(companies)
            )
            sector_blocks.append(
                f'''        <details>
          <summary>{escape(sector)} <span class="muted">({len(companies)})</span></summary>
          <ul>
{company_items}
          </ul>
        </details>'''
            )
        company_count = sum(len(c) for c in sectors.values())
        index_html_parts.append(
            f'''      <details open>
        <summary class="country">{escape(country)} <span class="muted">({company_count} compan{"y" if company_count == 1 else "ies"})</span></summary>
{chr(10).join(sector_blocks)}
      </details>'''
        )

    index_html = "\n".join(index_html_parts) if index_html_parts else '<p class="empty">No countries with briefs yet.</p>'

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>coverage.os — Dashboard</title>
<style>
  :root {{
    --bg: #0f1115;
    --panel: #171a21;
    --border: #262b36;
    --text: #e6e8ec;
    --muted: #8b909c;
    --accent: #5b8def;
  }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0;
    padding: 2rem 1.25rem 4rem;
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  }}
  .wrap {{ max-width: 960px; margin: 0 auto; }}
  h1 {{ font-size: 1.5rem; margin-bottom: 0.15rem; }}
  .subtitle {{ color: var(--muted); font-size: 0.9rem; margin-bottom: 2rem; }}
  h2 {{ font-size: 1.1rem; margin-top: 2.5rem; margin-bottom: 0.75rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }}
  table {{ width: 100%; border-collapse: collapse; background: var(--panel); border-radius: 8px; overflow: hidden; }}
  th, td {{ text-align: left; padding: 0.6rem 0.8rem; font-size: 0.88rem; border-bottom: 1px solid var(--border); }}
  th {{ color: var(--muted); font-weight: 600; text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.04em; }}
  tr:last-child td {{ border-bottom: none; }}
  a {{ color: var(--accent); text-decoration: none; }}
  a:hover {{ text-decoration: underline; }}
  .muted {{ color: var(--muted); font-size: 0.82em; }}
  .empty {{ color: var(--muted); font-style: italic; padding: 1rem; }}
  details {{ background: var(--panel); border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem 0.9rem; margin-bottom: 0.6rem; }}
  details details {{ margin: 0.5rem 0 0.25rem 1rem; background: transparent; }}
  summary {{ cursor: pointer; font-weight: 600; padding: 0.3rem 0; }}
  summary.country {{ font-size: 1rem; }}
  ul {{ margin: 0.4rem 0 0.4rem 1.1rem; padding: 0; }}
  li {{ margin: 0.2rem 0; font-size: 0.88rem; }}
  footer {{ margin-top: 3rem; color: var(--muted); font-size: 0.78rem; }}
</style>
</head>
<body>
  <div class="wrap">
    <h1>coverage.os</h1>
    <div class="subtitle">East Africa coverage — deal origination command center</div>

    <h2>Recent Briefs</h2>
    <table>
      <thead>
        <tr><th>Company</th><th>Country</th><th>Sector</th><th>Meeting Date</th><th>Generated</th></tr>
      </thead>
      <tbody>
{recent_rows}
      </tbody>
    </table>

    <h2>Browse by Country → Sector → Company</h2>
{index_html}

    <footer>Auto-generated by scripts/generate_dashboard.py — last refreshed {generated_at}. Markdown files are the source of truth; this page is read-only.</footer>
  </div>
</body>
</html>
"""


def main() -> None:
    briefs = collect_briefs()
    index = build_index(briefs)
    html = render(briefs, index)
    (ROOT / "dashboard.html").write_text(html, encoding="utf-8")
    print(f"dashboard.html regenerated with {len(briefs)} brief(s).")


if __name__ == "__main__":
    main()
