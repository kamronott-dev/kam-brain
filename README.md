# Brain Map

Visual force-directed map of Kam's entire context corpus.

- **What it shows:** every brain file (`0 - Brain/*.md`), every entity Claude has learned (people, clients, tools, businesses, properties, vehicles), every hard rule, every local app and MCP, and every recently-updated node.
- **How to launch:** open `brain-map.html` (or via Apps Menu → "Brain Map").
- **How to read it:**
  - Gray nodes = stable knowledge.
  - Green nodes (with glow) = recently updated or important.
  - Edges = cross-references. Click any node to see its full body + everything it connects to.
  - Use the chips top-left to filter by cluster, or `/` to search.
- **How to add facts:** click any node, type into the "Add a fact" box, hit "Save to brain". Claude picks it up next session and writes to the right `.md`.

See `SKILL.md` for the full update protocol, schema, and pending-facts apply rules.
