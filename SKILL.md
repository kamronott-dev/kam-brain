# Brain Map — SKILL

## Purpose

A force-directed visualization of Kam's entire context corpus — every brain file, every entity, every cross-link, every recent update — that lets Kam see the shape of his "second brain" at a glance and lets Claude keep it self-correcting.

Reference photo (the visual target): dark near-black background, gray nodes of varying sizes, bright lime-green accent nodes for "recently updated" or "important", faint edges, multiple visible clusters.

## Files

| File | Purpose |
|---|---|
| `brain-map.html` | The dashboard. Single-file app. d3 force-directed graph, dark theme, gray + green palette, side panels for details/feed. Loads `index.js` and `feed.js`. |
| `index.js` | `window.BRAIN_INDEX` — categories, nodes, edges. The graph data. |
| `feed.js` | `window.BRAIN_FEED` — append-only log of brain updates rendered as "Recent updates" feed. |
| `SKILL.md` | This file. |
| `README.md` | Short overview. |
| `pending/` | Drop-zone for `brain-pending-*.json` payloads from the app (created on first save). Claude processes these at session start. |

Path: `~/Desktop/Claude Files/Claude Apps/brain-map/`

## Schema (`window.BRAIN_INDEX`)

```js
{
  generatedAt: "ISO-8601",
  generatedBy: "...",
  schemaVersion: 1,
  categories: [{ id, name }],
  nodes: [{
    id,            // "f:about-kam" | "e:libby" | "r:persist-learned" | ...
    type,          // "file" | "topic" | "entity" | "rule" | "app" | "mcp" | "skill"
    label,         // display name
    category,      // matches categories[].id
    weight,        // 3-12 — controls node radius
    summary,       // optional one-liner shown at top of detail panel
    body,          // optional longer body shown in detail panel
    path,          // optional file path
    kind,          // optional sub-type for entities: person|client|tool|org|property|vehicle|task|event|habit|pet|group
    highlight,     // true => render green ("recently updated / important")
    parent         // optional parent nodeId (for topics under files)
  }],
  edges: [{ source: nodeId, target: nodeId, type, annotation? }]
  // edge types: "contains" | "ref" | "mentions" | "owns" | "uses" | "reports-to" | "related"
  // annotation: optional string explaining the connection in Kam's words (added by the app)
}
```

## Schema (`window.BRAIN_FEED`)

```js
[
  { ts: "ISO-8601", actor: "claude"|"kam", op: "create"|"update"|"delete"|"link"|"add-fact",
    target: nodeId or path, note: "human summary" }
]
```

## Write protocol — MANDATORY whenever the brain changes

This skill formalizes hard rule #10 ("always persist what you learn"). Every time Claude writes to a brain file, it MUST also:

1. **Update `index.js`** — modify the affected node(s):
   - If a new entity / contact / business / property / tool is mentioned: add a node + edges.
   - If an existing entity gets a new fact: optionally update `body`.
   - Set `highlight: true` on any node touched in the last ~3 days (Claude can sweep older highlights off when a new session starts and several days have passed).
2. **Prepend an entry to `feed.js`** with `{ ts: now, actor: "claude", op: "update"|"create", target: nodeId, note: short description }`.
3. **Bump `generatedAt` and `generatedBy`** on `BRAIN_INDEX`.

### When the change is purely textual within an existing file

You still need an index entry IF the change introduces a new named entity or relationship. Pure tone tweaks to an existing summary don't require an index update — just a feed entry pointing at the file's node so the dashboard's recent-updates panel surfaces it.

### Highlight sweep (idempotent)

At session start, if you scan `index.js` and find `highlight: true` nodes whose most recent feed entry is more than 5 days old, clear the highlight. Keeps the green nodes meaningful.

## Pending-fact protocol — what to do with `brain-pending-*.json`

The app's "Add a fact / note" textarea writes one of two artifacts:

1. **A file** named `brain-pending-<timestamp>.json` saved to `pending/` (when the user connected the folder via File System Access API).
2. **A clipboard payload** starting with `SYNC BRAIN ACTIONS:` (when the user clicks "Copy as SYNC BRAIN action").

There are now three payload action types. The clipboard payload wraps them in `{ actions: [...] }`; file-based pending payloads are flatter with a single top-level `action`.

### Action types

**`add-fact`** — Kam typed a new fact under a node:
```json
{
  "type": "add-fact",
  "targetId": "e:libby",
  "targetLabel": "Libby DeJong",
  "targetPath": null,
  "fact": "Libby's middle name is Marie."
}
```

**`annotate-edge`** — Kam clarified WHY two nodes are connected (or corrected the meaning of the link):
```json
{
  "action": "annotate-edge",
  "edge": { "source": "e:karl", "target": "b:aleph", "type": "uses" },
  "annotation": "Karl was Kam's personal VA before Aleph. Now full-time at Aleph as support@aleph-mgmt.com. The 'uses' edge is really 'employed by'."
}
```

**`remove-edge`** — Kam disconnected two nodes because Claude got it wrong:
```json
{
  "action": "remove-edge",
  "edge": { "source": "e:karl", "target": "b:cross", "type": "related" },
  "reason": "Karl never had anything to do with Cross Management. That edge was wrong."
}
```

### Apply protocol (Claude does this automatically)

**For `add-fact` actions:**

1. **Determine the destination .md file.**
   - If `targetPath` is set, that's the file.
   - Else look up the node in `index.js`, take its `path`. If still nothing, route the fact to the most-relevant brain file per the routing table in `working-style.md` ("Memory / Brain updates" section).
2. **Append the fact** to the right section of the destination file. If no obvious section, append under a `## Recent additions` heading at the bottom and create that section if missing.
3. **Update `index.js`** — set `highlight: true` on the affected node; optionally extend its `body` field with the new fact if material.
4. **Prepend an entry to `feed.js`** with `actor: "kam"` and `op: "add-fact"`.
5. Move the file to `pending/processed/`.

**For `annotate-edge` actions:**

1. **Find the edge** in `index.js` matching `(source, target, type)`. If the edge doesn't exist, treat as a no-op and log.
2. **Set the edge's `annotation` field** to the annotation string. This is shown as italic text in the edge inspector.
3. **If the annotation implies the edge `type` is wrong** (e.g., annotation says "this is really 'employed by' not 'uses'"), update `type` to a better match from the allowed set and write a feed entry noting the type change.
4. **Prepend a feed entry** with `actor: "kam"` and `op: "annotate-edge"`.
5. If the annotation reveals a misunderstanding that affects OTHER places in the brain (e.g., a wrong contact email referenced in multiple files), surface that in chat: "This annotation contradicts X in file Y — want me to fix that too?"
6. Move the file to `pending/processed/`.

**For `answer-question` actions:**

1. **Find the question** in `questions.js` by `questionId`. If missing, treat as no-op and log to feed.
2. **Mutate the question** in `questions.js`: set `status: "answered"`, `answer: <text>`, `answeredAt: <ISO ts>`.
3. **If the question has a `nodeId` AND the answer is substantive**, ALSO run an `add-fact` action against that node so the answer lands in the right .md file, not just buried in the questions log.
4. **Prepend a feed entry** with `actor: "kam"`, `op: "answer"`, `target: questions.nodeId || questionId`, `note: "Q: ... → A: ..."`.
5. **If the answer reveals that an existing fact in the brain is now wrong** (e.g., Kam answers "Libby switched jobs in March"), surface that in chat: "Your answer updates X — want me to also fix Y, Z?" Then apply those changes too if confirmed.
6. Move the pending file to `pending/processed/`.

**For `dismiss-question` actions:**

1. Find the question by `questionId`. Set `status: "dismissed"`.
2. Prepend a feed entry with `actor: "kam"`, `op: "dismiss"`.
3. Do NOT re-queue this question on the next scan. If a question keeps being dismissed and re-emerging, that's a signal that Claude's inference logic for that pattern is wrong — open a meta-discussion with Kam.
4. Move the pending file to `pending/processed/`.

### When to add a question to `questions.js`

Claude should append a question whenever:
- Inferring a fact from a noisy source (email skim, iMessage scrape) without explicit user confirmation — flag the inference with a question.
- Detecting a potential contradiction across files or nodes.
- Noticing a node that hasn't been touched in 60+ days AND whose facts are in a domain that changes (employment, contact info, project status).
- Receiving conflicting information from two sources.
- Building a new brain file from indirect evidence (e.g., personal-life.md from texts) — queue the top 2-3 things to verify.

Cap the open queue at ~15. If it grows past 20, demote oldest low-priority items to dismissed with a feed entry explaining why.

**For `remove-edge` actions:**

1. **Find the edge** in `index.js` matching `(source, target, type)`. Remove it from the `edges` array.
2. **If a `reason` was provided**, record it in `feed.js` and ALSO inspect: does this disconnection mean a node should be moved to a different category, or that another edge needs adjusting? If so, do that too.
3. **If multiple disconnections in a row touch the same node**, consider whether that node itself should be deleted (no remaining edges + no recent feed activity = orphan). Ask before deleting nodes.
4. **Prepend a feed entry** with `actor: "kam"` and `op: "disconnect"`. Note: this entry is intentionally durable so the pattern doesn't get re-applied automatically next time you scan source files.
5. **Update the original .md source** if applicable. For example, if the user disconnects `e:karl → b:cross` and the connection came from a stale cross-reference in `cross-management.md`, edit that doc to remove or correct the reference. Otherwise the next index rebuild may re-add the edge.
6. Move the file to `pending/processed/`.

After applying any action, confirm in chat with one short sentence: "Saved to `<file>`, updated `index.js`, logged to feed."

### Session-start scan (recommended addition to `working-style.md`)

At session start, after the existing tracker-sync scan (step 4), add a parallel step:

> 5. **Check for pending brain facts.** Look in `~/Desktop/Claude Files/Claude Apps/brain-map/pending/` for `brain-pending-*.json` files. Apply each per the protocol in `~/Desktop/Claude Files/Claude Apps/brain-map/SKILL.md`. After applying, move into `pending/processed/`.

## Adding new nodes / clusters

When Kam introduces a new ongoing topic (a new client, a new app, a new vendor, a new property):

1. Pick / create a node id. Convention prefixes:
   - `f:` for brain files (`f:about-kam`)
   - `e:` for entities (people, groups) (`e:libby`)
   - `c:` for Aleph clients (`c:parmer`)
   - `t:` for tools (`t:qbo`)
   - `b:` for businesses / orgs (`b:cak`)
   - `p:` for properties (`p:otto`)
   - `v:` for vehicles (`v:tesla`)
   - `h:` for habits / hobbies (`h:gym`)
   - `s:` for skill / context files in `Claude Files/` (`s:cak-memory`)
   - `a:` for apps (`a:brain-map`)
   - `m:` for MCPs (`m:imessage`)
   - `r:` for rules (`r:persist-learned`)
   - `z:` for scheduled tasks (`z:daily-pulse`)
2. Add the node to `BRAIN_INDEX.nodes` with appropriate `category`, `weight` (3 for tiny leaf, 11-12 for huge hubs), `summary` or `body`, and `highlight: true`.
3. Add edges connecting it to existing related nodes.
4. Prepend a `feed.js` entry.
5. Bump `BRAIN_INDEX.generatedAt`.

## File System Access permissions

The app uses Chrome's `showDirectoryPicker()` to get a `FileSystemDirectoryHandle` for the brain-map folder. The handle is persisted in IndexedDB so future sessions can write silently. If Kam clicks "Connect" once, every subsequent fact-save lands directly in `pending/` with zero clicks.

If the API isn't available (Safari, Firefox) or the user skips, the app falls back to:
1. Downloading the JSON file to Kam's Downloads folder.
2. Generating a `SYNC BRAIN ACTIONS:` clipboard block to paste into chat.

Claude treats both equivalently per the apply protocol above.

## What NOT to do

- Don't edit `index.js` or `feed.js` while the dashboard is open AND Kam is interacting — your write may race against a save. (In practice, file:// HTML doesn't read at runtime, so this is mostly hygienic.)
- Don't delete nodes — set `enabled: false` or remove if truly defunct AND no edges point at them. Keep historical entries in `feed.js`.
- Don't store credentials, passwords, or auth tokens in `index.js` body fields.
- Don't break the schema. If you need a new field, bump `schemaVersion` and document here.

## Visual design constants (matching the reference photo)

- Background: `#181818`
- Gray nodes: `#b8b8b8`
- Green nodes: `#bef264` with soft radial glow
- Edges: `rgba(190,190,190,0.10)` (faint), active `rgba(190,242,100,0.55)`
- Font: Inter
- Cluster centers: 5 categories arranged in a pentagon around screen center
- Force params: `link.distance` varies 35-110 by edge type, `charge ~ -90 - weight*6`

## Mobile companion (`brain-mobile.html`)

There's a phone-first sibling at `~/Desktop/Claude Files/Claude Apps/brain-map/brain-mobile.html` for capturing on-the-go.

### What it does
- **Capture tab.** Add fact / annotate edge / disconnect edge — same three action types as the desktop app. Picks a target node from typeahead search.
- **Browse tab.** Filter chips per category + 'Recent ✦' for green nodes. Tap to open mobile inspect overlay.
- **Ask tab.** Bundles a question with a scoped node's path into a prompt for Claude.
- **Feed tab.** Read-only recent updates.

### How it syncs (today)
The phone has no direct path to Kam's Mac filesystem. So every action does two things:
1. Builds a `SYNC BRAIN ACTIONS:` payload (one or more `actions[]`, same schema as the clipboard/pending payloads on desktop).
2. Copies it to clipboard, then opens the Claude phone app via the `claude://` universal link (web fallback if not installed).

Kam pastes into Claude on phone (or desktop), hard rule #13 kicks in, and the brain updates land within seconds.

### Sync architecture options (pick one)

| Option | Pros | Cons |
|---|---|---|
| **A. Status quo** (file:// on Mac) | Zero infra. Works today. | Phone can't load `index.js`/`feed.js`, so Browse/Inspect on phone show 'NO DATA' until file is hosted somewhere reachable. Capture still works (it doesn't need data). |
| **B. iCloud Drive** | Files sync to phone. Open via Files app or Safari (file URL won't really work — needs hosting). Best for cross-device editing of the .md / .js files themselves. | Still no HTTP host, so Browse/Inspect on phone won't load. |
| **C. Static host (GitHub Pages / Cloudflare Pages)** | Phone can browse + inspect with full data. PWA install works ('Add to Home Screen'). Real-time updates if Kam pushes after each desktop edit. | One-time setup (1-2 hr). Brain files become semi-public unless private repo + auth. |
| **D. Tiny backend (Cloudflare Workers + KV)** | Two-way sync. Phone POSTs facts, desktop polls. Truly real-time. | Most infra. Privacy considerations. |

Default recommendation: **A → C**. Start with Capture-only on phone (works without data hosting). When Kam wants Browse/Inspect on the go, set up GitHub Pages on a private repo and switch.

## Changelog

- **2026-05-11** — Initial creation. Force-directed dark/green graph with 90+ nodes across 5 clusters (Identity, Aleph, CAK/Cross, Apps, Meta). File System Access integration for zero-action edits. Pending-facts protocol for queued saves.
- **2026-05-11 (later)** — Added edge inspector + node deep-detail view. Both surfaces support quick disconnect (✕ icon, inline confirm) and reason-tracked disconnect (full inspector). Edge `annotation` field added to schema.
- **2026-05-11 (later)** — Added `brain-mobile.html` companion. Phone-first capture/browse/ask. Generates SYNC BRAIN clipboard payloads + opens Claude app.
