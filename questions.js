/*
 * Brain Map — Claude's open questions for Kam
 *
 * window.BRAIN_QUESTIONS is the queue of things Claude is unsure about.
 * Every time Claude infers something it can't fully verify, or notices a
 * potential contradiction in the brain, it appends a question here.
 *
 * Schema:
 *   {
 *     id:        "q:<short-uuid-or-slug>",     // unique
 *     ts:        "ISO-8601",                    // when queued
 *     nodeId:    "e:libby" | null,              // which node is at stake (null = general)
 *     nodeLabel: "Libby DeJong" | null,         // denormalized for display
 *     question:  "Free-text question for Kam",  // the actual question
 *     context:   "Why I'm asking" | null,       // optional context for Kam
 *     priority:  "high" | "med" | "low",        // routing weight
 *     status:    "open" | "answered" | "dismissed",
 *     answer:    "..." | null,                  // filled in after Kam responds
 *     answeredAt:"ISO-8601" | null
 *   }
 *
 * APPLY PROTOCOL (Claude does this automatically when a SYNC BRAIN action
 * arrives with type: "answer-question"):
 *
 *   1. Find the question by id. If not found, treat as no-op + log.
 *   2. Set status="answered", answer=<text>, answeredAt=now.
 *   3. If the question has a nodeId AND the answer is a substantive fact,
 *      also run an add-fact action targeting that node (so the answer lands
 *      in the right .md file, not just the questions log).
 *   4. Prepend a feed.js entry with actor="kam", op="answer", target=nodeId,
 *      note=`Q: ${question} → A: ${answer}`.
 *   5. Move the pending file to pending/processed/.
 *
 * Claude should aim to keep <15 open questions at once. If the queue grows
 * past 20, demote the oldest low-priority ones to dismissed (with a feed entry).
 */
window.BRAIN_QUESTIONS = [
  {
    id: "q:libby-current-employer-2026-05",
    ts: "2026-05-11T18:25:00-05:00",
    nodeId: "e:libby",
    nodeLabel: "Libby DeJong",
    question: "Is Libby's current employer / role still accurate in personal-life.md? I haven't seen a recent update and want to flag stale before it bites us.",
    context: "Inferred from a 6-month iMessage scrape in May. If she's changed jobs since, downstream context (work schedule, travel) is wrong.",
    priority: "med",
    status: "open",
    answer: null,
    answeredAt: null
  },
  {
    id: "q:karl-role-2026-05",
    ts: "2026-05-11T18:26:00-05:00",
    nodeId: "e:karl",
    nodeLabel: "Karl",
    question: "What's Karl's actual scope at Aleph now? I have him as 'support' (support@aleph-mgmt.com), but I'm not sure if he handles client onboarding, accounting ops, both, or something else.",
    context: "From the inbox review I built aleph-context.md from. The 'uses' edge between Karl and Aleph feels under-specified.",
    priority: "high",
    status: "open",
    answer: null,
    answeredAt: null
  },
  {
    id: "q:parmer-revrec-status-2026-05",
    ts: "2026-05-11T18:27:00-05:00",
    nodeId: "c:parmer",
    nodeLabel: "Parmer & Sons",
    question: "Is the Parmer rev-rec process fully on Wallogy now, or are there still jobs going through QBO that need accruals? The skill assumes Wallogy as source of truth.",
    context: "From the rev-rec skill. If hybrid, I should adjust the variance-clearing flow.",
    priority: "high",
    status: "open",
    answer: null,
    answeredAt: null
  },
  {
    id: "q:cross-pma-effective-date",
    ts: "2026-05-11T18:28:00-05:00",
    nodeId: "f:cross-mgmt",
    nodeLabel: "Cross Management",
    question: "When does the PMA transition actually take effect for Cross? I have it documented as 'in transition' but no firm date — affects how I treat lease provisions, leasing standards, etc.",
    context: "From cross-management.md (created 2026-05-07).",
    priority: "med",
    status: "open",
    answer: null,
    answeredAt: null
  },
  {
    id: "q:greece-trip-budget-2026",
    ts: "2026-05-11T18:29:00-05:00",
    nodeId: null,
    nodeLabel: null,
    question: "For the Greece trip — what's the budget range, who's going, and are flights booked yet? I have the date intent (this summer) but no concrete planning context.",
    context: "From the health/fitness/Greece-trip section I added to about-kam.md on 2026-05-07.",
    priority: "low",
    status: "open",
    answer: null,
    answeredAt: null
  },
  {
    id: "q:aleph-cluster-granularity",
    ts: "2026-05-11T18:30:00-05:00",
    nodeId: null,
    nodeLabel: null,
    question: "Should I sub-cluster the Aleph blob (~49 nodes) into team / clients / tools / products in the graph? Right now it's all one dense cloud — readability is the cost.",
    context: "Re-eval observation after building the brain-map.",
    priority: "low",
    status: "open",
    answer: null,
    answeredAt: null
  }
];
