import json
import re
from pathlib import Path

import requests
from bs4 import BeautifulSoup


URL = "https://www.mtholyoke.edu/student-experience/living-campus/housing/residence-halls"


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").strip())


def looks_like_dorm_name(name: str) -> bool:
    if not name:
        return False
    lowered = name.lower()
    # Filter out section headings like "Residence halls", "Residence hall features", etc.
    if lowered.startswith("residence hall"):
        return False
    if lowered.startswith("residence halls"):
        return False

    # Accept common dorm name patterns like:
    # - "1837 Hall"
    # - "MacGregor Hall"
    # - "Pearsons Annex"
    # - "Dickinson House"
    if re.match(r"^\d{4}\s+hall$", lowered):
        return True
    return any(lowered.endswith(suffix) for suffix in [" hall", " house", " annex"])


def main() -> None:
    resp = requests.get(
        URL,
        timeout=30,
        headers={"User-Agent": "rate-my-housing/1.0 (educational scraper)"},
    )
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "lxml")

    dorms = []
    seen = set()

    # Focus on the main content area to avoid nav/menu headings
    root = soup.find("main") or soup.find(id="main-content") or soup

    # Heuristic: dorm sections usually have a heading-like element followed by a paragraph.
    # On some CMS pages the "heading" might not be h2/h3, so we look a bit wider.
    for heading in root.find_all(["h2", "h3", "h4", "strong"]):
        name = clean(heading.get_text(" ", strip=True))
        if not looks_like_dorm_name(name) or len(name) > 60:
            continue

        # Avoid duplicates if headings repeat (e.g. nav)
        key = name.lower()
        if key in seen:
            continue
        seen.add(key)

        # Find the next paragraph-ish block for a short description
        p = heading.find_next(["p", "div"])
        description = ""
        if p:
            description = clean(p.get_text(" ", strip=True))

        # Skip if we didn't get a meaningful description
        if len(description) < 20:
            continue

        dorms.append(
            {
                "name": name,
                "description": description,
                "amenities": [],
                "location": "Mount Holyoke College",
                "imageUrl": "",
            }
        )

    out_path = Path(__file__).resolve().parents[1] / "dorms.json"
    out_path.write_text(json.dumps(dorms, indent=2), encoding="utf-8")
    print(f"Saved {len(dorms)} dorm(s) to {out_path}")


if __name__ == "__main__":
    main()
