/*
 * Brain Map - recent updates feed
 * window.BRAIN_FEED is an append-only log of changes to the brain.
 *
 * Every time Claude updates a brain file (per hard rule #10), an entry should be
 * prepended here. The app renders the most recent ~50 in the side panel.
 *
 * Schema:
 *   { ts: ISO-8601, actor: "claude"|"kam", op: "create"|"update"|"delete"|"link",
 *     target: nodeId or path, note: human-readable summary }
 */
window.BRAIN_FEED = [
  {
    ts: "2026-05-11T18:35:00-05:00",
    actor: "claude",
    op: "create",
    target: "a:brain-map",
    note: "Added Claude's-questions feed on both surfaces. Desktop panel + mobile tab. New action types: answer-question, dismiss-question. Seeded 6 plausible questions to start the loop."
  },
  {
    ts: "2026-05-11T18:32:00-05:00",
    actor: "claude",
    op: "create",
    target: "a:brain-mobile",
    note: "Added HOSTING.md + sync-to-github.sh for GitHub Pages auto-deploy. One-time setup ~20 min, then auto-push every 5 min keeps phone in sync."
  },
  {
    ts: "2026-05-11T18:05:00-05:00",
    actor: "claude",
    op: "create",
    target: "a:brain-mobile",
    note: "Built Brain Mobile: phone-first capture/browse/ask. Voice via iOS keyboard mic. Each action copies a SYNC BRAIN payload to clipboard and opens Claude (universal link → web fallback) so phone-captured facts land instantly when pasted."
  },
  {
    ts: "2026-05-11T17:40:00-05:00",
    actor: "claude",
    op: "update",
    target: "a:brain-map",
    note: "Added node deep-detail view: 'View detailed →' from any node opens full metadata, full body, connections grouped by edge type with inline annotations, and 2-hop neighbors list. Mirrors the high-level/detailed pattern already on edges."
  },
  {
    ts: "2026-05-11T17:30:00-05:00",
    actor: "claude",
    op: "update",
    target: "a:brain-map",
    note: "Added edge inspector: click ⓘ on any connection for src/tgt cards, edge type, annotation textarea (Kam can clarify WHY two nodes link), and high-level + reason-tracked disconnect. Hover-reveal ⓘ/✕ icons in node detail list."
  },
  {
    ts: "2026-05-11T17:15:00-05:00",
    actor: "claude",
    op: "create",
    target: "r:sync-brain",
    note: "Added hard rule #13: SYNC BRAIN ACTIONS payload must be applied immediately. Added session-start step 5 for pending brain-pending-*.json scan."
  },
  {
    ts: "2026-05-11T17:00:00-05:00",
    actor: "claude",
    op: "create",
    target: "a:brain-map",
    note: "Built brain-map app: force-directed graph of 12 brain files + 90+ entities/rules/apps/clients, with 200+ cross-links."
  },
  {
    ts: "2026-05-11T16:46:00-05:00",
    actor: "claude",
    op: "update",
    target: "a:task-tracker",
    note: "Archived 3 scheduled tasks via SYNC TRACKER ACTIONS: daily-email-digest, fuze-daily-summary, notion-recurring-checklist-rollover."
  },
  {
    ts: "2026-05-11T16:14:00-05:00",
    actor: "claude",
    op: "update",
    target: "f:working-style",
    note: "Added hard rules #11 (every scheduled task writes to tracker) + #12 (SYNC TRACKER ACTIONS auto-apply). Added session-start step 4 for tracker-sync-*.json scan."
  },
  {
    ts: "2026-05-11T15:30:00-05:00",
    actor: "claude",
    op: "create",
    target: "a:task-tracker",
    note: "Built Recurring Task Tracker dashboard. Edit/Archive UI with bidirectional scheduler sync."
  },
  {
    ts: "2026-05-11T11:00:00-05:00",
    actor: "kam",
    op: "update",
    target: "r:persist-learned",
    note: "Made hard rule #10 explicit + non-negotiable. 'If Kam ever has to repeat himself, that's a defect on Claude's side.'"
  },
  {
    ts: "2026-05-09T11:15:00-05:00",
    actor: "claude",
    op: "create",
    target: "f:apps-launcher",
    note: "Created apps-launcher.md documenting Chrome file:// limit + DevTools-snippet workflow."
  },
  {
    ts: "2026-05-07T08:26:00-05:00",
    actor: "claude",
    op: "update",
    target: "f:about-kam",
    note: "Added health/fitness/diet/Greece-trip section."
  },
  {
    ts: "2026-05-07T07:43:00-05:00",
    actor: "claude",
    op: "create",
    target: "f:cross-mgmt",
    note: "Created cross-management.md: lease provisions, PMA transition, leasing standards, syndication context."
  },
  {
    ts: "2026-05-07T07:42:00-05:00",
    actor: "claude",
    op: "create",
    target: "f:accounting",
    note: "Created accounting-standards.md: cross-client GL coding, treatments, recon standard, bank description translations."
  },
  {
    ts: "2026-05-07T07:41:00-05:00",
    actor: "claude",
    op: "create",
    target: "f:voice-tone",
    note: "Created voice-and-tone.md from 6-month sent-email read. Email + intimate text registers."
  },
  {
    ts: "2026-05-06T14:01:00-05:00",
    actor: "claude",
    op: "create",
    target: "f:personal-life",
    note: "Created personal-life.md from 6-month iMessage read."
  },
  {
    ts: "2026-05-06T13:33:00-05:00",
    actor: "claude",
    op: "create",
    target: "f:building-apps",
    note: "Created building-apps.md: single-file HTML conventions, style defaults, date math, verification."
  },
  {
    ts: "2026-05-06T13:27:00-05:00",
    actor: "claude",
    op: "create",
    target: "f:aleph-context",
    note: "Created aleph-context.md from inbox review: team + 15 client entities + product glossary."
  }
];
