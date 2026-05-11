/*
 * Brain Map - graph index
 * window.BRAIN_INDEX is the source of truth for the dashboard at brain-map.html
 *
 * Schema:
 *   categories[] = { id, name }
 *   nodes[] = { id, type, label, category, weight, summary?, path?, body?, highlight?, kind?, parent? }
 *     type:  "file" | "topic" | "entity" | "rule" | "app" | "mcp" | "skill"
 *     category: matches a categories[].id
 *     weight: ~ node radius hint (3-12)
 *     highlight: true means render green (recently updated / important)
 *   edges[] = { source: nodeId, target: nodeId, type }
 *     type:  "contains" | "ref" | "mentions" | "owns" | "uses" | "reports-to" | "related"
 *
 * Update protocol: any time Claude learns a durable fact (hard rule #10), update the
 * corresponding node here (or add a new one). Set highlight:true and push an entry to
 * feed.js so the dashboard shows it in "Recent updates". See SKILL.md.
 */
window.BRAIN_INDEX = {
  generatedAt: "2026-05-11T17:00:00-05:00",
  generatedBy: "initial brain-map build",
  schemaVersion: 1,

  categories: [
    { id: "identity",  name: "Identity & Personal" },
    { id: "aleph",     name: "Aleph / Work" },
    { id: "cak-cross", name: "CAK & Cross" },
    { id: "apps",      name: "Apps & Infrastructure" },
    { id: "meta",      name: "Meta / Routing / Style" }
  ],

  nodes: [
    // ============ FILES (12 brain files) ============
    { id: "f:readme",          type: "file", label: "README.md",            category: "meta",     weight: 9, path: "0 - Brain/README.md",            summary: "Master orientation + cross-link table." },
    { id: "f:about-kam",       type: "file", label: "about-kam.md",         category: "identity", weight: 11, path: "0 - Brain/about-kam.md",         summary: "Bio, family, businesses, properties, vehicles, tools, health, travel." },
    { id: "f:personal-life",   type: "file", label: "personal-life.md",     category: "identity", weight: 8, path: "0 - Brain/personal-life.md",     summary: "Household, friends, hobbies, routines, payment patterns." },
    { id: "f:voice-tone",      type: "file", label: "voice-and-tone.md",    category: "meta",     weight: 8, path: "0 - Brain/voice-and-tone.md",    summary: "Email + intimate text register; phrasings to match." },
    { id: "f:aleph-context",   type: "file", label: "aleph-context.md",     category: "aleph",    weight: 11, path: "0 - Brain/aleph-context.md",     summary: "Aleph internal team + 15 client entities + product glossary." },
    { id: "f:accounting",      type: "file", label: "accounting-standards.md", category: "aleph", weight: 9, path: "0 - Brain/accounting-standards.md", summary: "Cross-client GL coding, treatments, bank descriptions, recon standard." },
    { id: "f:cross-mgmt",      type: "file", label: "cross-management.md",  category: "cak-cross", weight: 8, path: "0 - Brain/cross-management.md",  summary: "Cross Mgmt LLC: leases, PMA transition, leasing standards, syndication." },
    { id: "f:working-style",   type: "file", label: "working-style.md",     category: "meta",     weight: 12, path: "0 - Brain/working-style.md",     summary: "12 hard rules, session-start protocol, memory routing.", highlight: true },
    { id: "f:request-patterns",type: "file", label: "request-patterns.md",  category: "meta",     weight: 7, path: "0 - Brain/request-patterns.md",  summary: "How Kam phrases requests; what to do vs. ask." },
    { id: "f:project-routing", type: "file", label: "project-routing.md",   category: "meta",     weight: 8, path: "0 - Brain/project-routing.md",   summary: "Topic -> file/folder routing for Aleph/CAK/Apps/MCPs/Skills." },
    { id: "f:building-apps",   type: "file", label: "building-apps.md",     category: "apps",     weight: 8, path: "0 - Brain/building-apps.md",     summary: "Single-file HTML conventions, style defaults, date math, verification." },
    { id: "f:apps-launcher",   type: "file", label: "apps-launcher.md",     category: "apps",     weight: 8, path: "0 - Brain/apps-launcher.md",     summary: "Local HTML app inventory + Chrome file:// limit + DevTools snippet workflow." },

    // ============ HARD RULES (12) ============
    { id: "r:do-dont-ask",     type: "rule", label: "Do, don't ask",        category: "meta",     weight: 5, body: "If you can do it, do it. Permission-seeking adds friction. Only stop for irreversible external actions." },
    { id: "r:desktop-access",  type: "rule", label: "Never ask for Desktop access", category: "meta", weight: 4, body: "Hard rule #1. Just call request_cowork_directory and go." },
    { id: "r:no-permission",   type: "rule", label: "No permission for safe ops",   category: "meta", weight: 4, body: "Hard rule #2. Reserve confirmation only for irreversible external actions." },
    { id: "r:minimize-kam",    type: "rule", label: "Minimize Kam's work",          category: "meta", weight: 5, body: "Hard rule #3. Anticipate next step. Read context proactively. Don't kick decisions back." },
    { id: "r:no-em-dash",      type: "rule", label: "Never use em dashes",          category: "meta", weight: 3, body: "Hard rule #4. Use hyphens, commas, or split sentences." },
    { id: "r:recon-standard",  type: "rule", label: "Recon = transaction-level",    category: "aleph", weight: 5, body: "Hard rule #5. Full tie-out, no shortcuts, no pattern-based assumptions." },
    { id: "r:token-eff",       type: "rule", label: "Token efficiency",             category: "meta", weight: 4, body: "Hard rule #6. Edit > Write, batch ops, lead with link + one-line summary." },
    { id: "r:retry-now",       type: "rule", label: "Retry failed delivery now",    category: "apps", weight: 5, body: "Hard rule #7. When something didn't happen, retry it this session via best available channel." },
    { id: "r:surface-missed",  type: "rule", label: "Surface missed tasks at session start", category: "apps", weight: 5, body: "Hard rule #8. Silently run session-start protocol; surface misses concisely." },
    { id: "r:root-cause",      type: "rule", label: "Root cause first, never workaround", category: "meta", weight: 5, body: "Hard rule #9. Inspect what's broken before pivoting to a different approach." },
    { id: "r:persist-learned", type: "rule", label: "Persist every learned fact",   category: "meta", weight: 7, body: "Hard rule #10. Write to .md before ending turn. If Kam repeats himself, that's a defect.", highlight: true },
    { id: "r:tracker-write",   type: "rule", label: "Every scheduled task writes to tracker", category: "apps", weight: 6, body: "Hard rule #11. Last step of every scheduled task = state.js update.", highlight: true },
    { id: "r:sync-actions",    type: "rule", label: "Apply SYNC TRACKER ACTIONS instantly", category: "apps", weight: 6, body: "Hard rule #12. Parse the JSON payload, call update_scheduled_task, sync state.js.", highlight: true },
    { id: "r:sync-brain",      type: "rule", label: "Apply SYNC BRAIN ACTIONS instantly",   category: "meta", weight: 6, body: "Hard rule #13. Parse JSON payload from brain-map app, append fact to right .md, update index.js + feed.js.", highlight: true },

    // ============ PEOPLE - household ============
    { id: "e:kam",             type: "entity", label: "Kam (Kamron Ott)",   category: "identity", weight: 12, kind: "person", body: "24, Senior Financial Analyst at Aleph. Twin Cities. Phone +17633011313. Partner: Libby. Daughter: Violet." },
    { id: "e:libby",           type: "entity", label: "Libby DeJong",       category: "identity", weight: 6, kind: "person", body: "Partner. +16128608883. ldejong2@me.com. Birthday May 15." },
    { id: "e:violet",          type: "entity", label: "Violet",             category: "identity", weight: 4, kind: "person", body: "Daughter. Toddler." },
    { id: "e:paul",            type: "entity", label: "Paul (family child)",category: "identity", weight: 3, kind: "person", body: "Young child in extended fam group. Early-Jan birthday." },

    // ============ FRIEND CIRCLES ============
    { id: "e:may2-golf",       type: "entity", label: "May 2nd Golf",        category: "identity", weight: 3, kind: "group", body: "Golf outing group. Last meetup 5/6/2026 at Kayla's parents'." },
    { id: "e:ben-kayla",       type: "entity", label: "Ben & Kayla wedding party", category: "identity", weight: 4, kind: "group", body: "Pard+Ush-Bayla, ~14 people. Kam in wedding party + organizing logistics." },
    { id: "e:home-group",      type: "entity", label: "Home Group (Sat)",   category: "identity", weight: 3, kind: "group", body: "Saturday small group. Libby asks Kam to send the message each Sat." },
    { id: "e:luke",            type: "entity", label: "Luke",               category: "identity", weight: 2, kind: "person", body: "Friend." },

    // ============ ALEPH TEAM ============
    { id: "e:patrick",         type: "entity", label: "Patrick Herzog",     category: "aleph", weight: 8, kind: "person", body: "VP Finance & Accounting. Kam's direct supervisor. patrick@aleph-mgmt.com." },
    { id: "e:erich",           type: "entity", label: "Erich Leidel",       category: "aleph", weight: 8, kind: "person", body: "Partner / CFO. Also Partner/CFO at Paris Brands. erich@aleph-mgmt.com." },
    { id: "e:katelynn",        type: "entity", label: "Katelynn Strawmatt", category: "aleph", weight: 7, kind: "person", body: "Director Financial Ops. Mentors Kam on month-end / recon. katelynn@aleph-mgmt.com." },
    { id: "e:dave-r",          type: "entity", label: "Dave Rychley",       category: "aleph", weight: 5, kind: "person", body: "Partner. Leads trend file reviews with COOs." },
    { id: "e:ross",            type: "entity", label: "Ross Crump",         category: "aleph", weight: 4, kind: "person", body: "Operations / partner-facing." },
    { id: "e:susan",           type: "entity", label: "Susan Strang",       category: "aleph", weight: 3, kind: "person", body: "Joined April 2026." },
    { id: "e:pachia",          type: "entity", label: "PaChia Vue",         category: "aleph", weight: 4, kind: "person", body: "Office & Finance Admin. 401k Alerus enrollment." },
    { id: "e:kyle",            type: "entity", label: "Kyle Anfinson",      category: "aleph", weight: 4, kind: "person", body: "Tech / Wallogy / system access." },
    { id: "e:machaela",        type: "entity", label: "Machaela Madsen",    category: "aleph", weight: 4, kind: "person", body: "A/R, accruals, recon peer." },
    { id: "e:nadeesha",        type: "entity", label: "Nadeesha Laksirini", category: "aleph", weight: 3, kind: "person", body: "Junior - being trained on rec questions." },
    { id: "e:nick",            type: "entity", label: "Nick Fulop",         category: "aleph", weight: 3, kind: "person", body: "Material imports / Prim coordination." },
    { id: "e:jonmarc",         type: "entity", label: "Jonmarc Radspinner", category: "aleph", weight: 4, kind: "person", body: "Ops. Ridings / Lumos materials." },
    { id: "e:mark-nelson",     type: "entity", label: "Mark Nelson",        category: "aleph", weight: 3, kind: "person", body: "Coordination team lead. Uses VAs busy season." },
    { id: "e:karl",            type: "entity", label: "Karl Garcia",        category: "aleph", weight: 4, kind: "person", body: "Was Kam's VA. Now support@aleph-mgmt.com. IT-style requests." },
    { id: "e:grace",           type: "entity", label: "Grace (former VA)",  category: "identity", weight: 3, kind: "person", body: "Kam's former VA. $8.50/hr + benefits." },

    // ============ ALEPH CLIENTS ============
    { id: "c:paris",           type: "entity", label: "Paris Painting",     category: "aleph", weight: 6, kind: "client", body: "Micah Stelter (CEO). Erich is Partner/CFO." },
    { id: "c:ridings",         type: "entity", label: "Ridings",            category: "aleph", weight: 5, kind: "client", body: "Dean Ridings. Jonmarc operates. Jan 2026: $241K vs $150K budget." },
    { id: "c:jmj",             type: "entity", label: "JMJ Painters",       category: "aleph", weight: 4, kind: "client", body: "Adam @ jmjpainters.com. Jonmarc operates." },
    { id: "c:esp",             type: "entity", label: "ESP Painting",       category: "aleph", weight: 4, kind: "client", body: "Jeff, Carrie. Ross operates. Sales line formula issues." },
    { id: "c:amp",             type: "entity", label: "AMP / Militello",    category: "aleph", weight: 4, kind: "client", body: "Mike, Christian, Angelina Militello. Shannon. Jan 2026 down 60K vs plan." },
    { id: "c:tec",             type: "entity", label: "TEC / Tony Ekman",   category: "aleph", weight: 4, kind: "client", body: "Tony @ tonyekmanpainting.com. $132K Jan 2026 vs $82.5K budget." },
    { id: "c:heritage",        type: "entity", label: "Heritage Custom",    category: "aleph", weight: 5, kind: "client", body: "Finney, Jason. Lance Blakely (Profitworks USA) consults." },
    { id: "c:midway",          type: "entity", label: "Midway Painting",    category: "aleph", weight: 4, kind: "client", body: "Grant @ midwaypaintingcompany.com." },
    { id: "c:parmer",          type: "entity", label: "Parmer & Sons",      category: "aleph", weight: 7, kind: "client", body: "Royce Parmer. Tara Kipps assists. Debbie Linkous. First Community Bank. Royce avoids Google Chat." },
    { id: "c:prim",            type: "entity", label: "Prim Painting",      category: "aleph", weight: 6, kind: "client", body: "Nathan Pratt, Micah Doyel. Hubdoc receipts. $23K leasehold improvements over 15 mos." },
    { id: "c:paintgreen",      type: "entity", label: "PaintGreen",         category: "aleph", weight: 6, kind: "client", body: "Jon Ray, Emily Frank, Lisa Walden. FSC Coatings, Torrey Pines, Dunn Edwards, Colorama vendors." },
    { id: "c:lumos",           type: "entity", label: "Lumos Paints",       category: "aleph", weight: 6, kind: "client", body: "Arthur Pili (6% commission), Frank Mares (9%). Wallogy materials import Tuesdays." },
    { id: "c:ftp",             type: "entity", label: "FTP / Final Touch",  category: "aleph", weight: 4, kind: "client", body: "Eric Crawford, Dave King, Kerry. Sherwin Williams. Ramp app in process." },
    { id: "c:durapro",         type: "entity", label: "DuraPro",            category: "aleph", weight: 4, kind: "client", body: "Randy. Jennifer Goembel (myfitbooks). MI tax penalties risk flagged by Gusto." },
    { id: "c:davis",           type: "entity", label: "Davis",              category: "aleph", weight: 3, kind: "client", body: "Asa @ pointerpainting, Seyward. Pointer Painting connection." },

    // ============ TOOLS / SYSTEMS ============
    { id: "t:qbo",             type: "entity", label: "QuickBooks Online",  category: "aleph", weight: 7, kind: "tool", body: "Live integration via QBO MCP bridge. Primary GL." },
    { id: "t:liveflow",        type: "entity", label: "LiveFlow",           category: "aleph", weight: 5, kind: "tool", body: "Consolidation across all Aleph entities. Obi Nnadika, Zac Kaye. Legacy reports discontinue 5/18/2026." },
    { id: "t:wallogy",         type: "entity", label: "Wallogy",            category: "aleph", weight: 6, kind: "tool", body: "Production / job tracking. Reconciles vs QBO. Login Kamron@aleph-mgmt.com." },
    { id: "t:hubdoc",          type: "entity", label: "Hubdoc",             category: "aleph", weight: 3, kind: "tool", body: "Prim's expenses. Add POs in description on publish." },
    { id: "t:dext",            type: "entity", label: "Dext",               category: "aleph", weight: 3, kind: "tool", body: "Parmer, Spectrum, general receipts." },
    { id: "t:ramp",            type: "entity", label: "Ramp",               category: "aleph", weight: 4, kind: "tool", body: "Corporate cards. Aleph migrating clients onto Ramp. Patrick Battaglia." },
    { id: "t:gusto",           type: "entity", label: "Gusto",              category: "aleph", weight: 4, kind: "tool", body: "Payroll for all Aleph entities. AutoPilot reminders 1 day prior." },
    { id: "t:notion",          type: "entity", label: "Notion",             category: "apps", weight: 4, kind: "tool", body: "Connector available. Recurring Checklist (rollover automation disabled in favor of standalone HTML app)." },
    { id: "t:gmail",           type: "entity", label: "Gmail",              category: "apps", weight: 4, kind: "tool", body: "Connector available." },
    { id: "t:gdrive",          type: "entity", label: "Google Drive",       category: "apps", weight: 4, kind: "tool", body: "Primary doc/data storage. Drive connector available." },
    { id: "t:asana",           type: "entity", label: "Asana",              category: "apps", weight: 3, kind: "tool", body: "Connector available." },
    { id: "t:apartments",      type: "entity", label: "Apartments.com",     category: "cak-cross", weight: 3, kind: "tool", body: "Tenant payment portal (1081 Randolph)." },
    { id: "t:rent-manager",    type: "entity", label: "Rent Manager",       category: "cak-cross", weight: 4, kind: "tool", body: "PM software. Active." },

    // ============ KAM'S BUSINESSES ============
    { id: "b:aleph",           type: "entity", label: "Aleph Ventures / Mgmt", category: "aleph", weight: 9, kind: "org", body: "Kam's employer. Senior Financial Analyst since 2026-02-26. 3515 48th Ave N, Brooklyn Center, MN 55429." },
    { id: "b:cak",             type: "entity", label: "Curb Appeal Kings",  category: "cak-cross", weight: 8, kind: "org", body: "Litter-pickup for rental properties. Biggest account: BLVD Mgmt (45+ props). Purple/navy #2D2B55, bearded king mascot." },
    { id: "b:cross",           type: "entity", label: "Cross Management",   category: "cak-cross", weight: 7, kind: "org", body: "Kam's LLC. AmFam insurance via Patrick Domeier (likely non-renewing 11/1/2026). Manages 1081 Randolph directly since 2/11/26." },
    { id: "b:fuze",            type: "entity", label: "Fuze RE",            category: "cak-cross", weight: 5, kind: "org", body: "RE brokerage side context. Weekly wires, monthly brokerage reports via kamrono@fuzere.com -> Aleph inbox." },
    { id: "b:blvd",            type: "entity", label: "BLVD Management",    category: "cak-cross", weight: 5, kind: "org", body: "CAK's biggest account. 45+ properties. blvd@avidbill.com default invoice recipient." },

    // ============ PROPERTIES ============
    { id: "p:otto",            type: "entity", label: "12520 Otto St",      category: "identity", weight: 5, kind: "property", body: "Primary home (Rogers MN). Monthly furnace filter swap." },
    { id: "p:wedgewood-rental",type: "entity", label: "7661 Wedgewood Ct N",category: "identity", weight: 4, kind: "property", body: "Maple Grove rental (Schedule E). Insurance renewals tracked." },
    { id: "p:penn",            type: "entity", label: "5424 Penn Ave S",    category: "identity", weight: 4, kind: "property", body: "Minneapolis rental. RUBS billed back monthly. Mortgage tracked." },
    { id: "p:wedgewood-primary",type: "entity",label: "Wedgewood (other)",  category: "identity", weight: 3, kind: "property", body: "Primary residence variant. Water softener + HOA." },
    { id: "p:randolph",        type: "entity", label: "1081 Randolph Ave",  category: "cak-cross", weight: 5, kind: "property", body: "Formerly under Cross Mgmt, now managed directly. Apartments.com payment portal." },

    // ============ VEHICLES ============
    { id: "v:tesla",           type: "entity", label: "Tesla",              category: "identity", weight: 3, kind: "vehicle", body: "Monthly loan payment. Reg renews June 14." },
    { id: "v:chevy",           type: "entity", label: "Chevy",              category: "identity", weight: 3, kind: "vehicle", body: "Semi-annual insurance (12/23-6/23). Reg renews Sept 14." },

    // ============ HOBBIES / LIFESTYLE ============
    { id: "h:gym",             type: "entity", label: "Strength training",  category: "identity", weight: 4, kind: "habit", body: "4-5x/week. Upper-body focus + legs. 5:30-6:30 PM." },
    { id: "h:running",         type: "entity", label: "Running / cardio",   category: "identity", weight: 3, kind: "habit" },
    { id: "h:golf",            type: "entity", label: "Golf",               category: "identity", weight: 3, kind: "habit" },
    { id: "h:3dprint",         type: "entity", label: "3D printing",        category: "identity", weight: 3, kind: "habit", body: "Browses MakerWorld, texts designs to Libby." },
    { id: "h:diet",            type: "entity", label: "Animal-based diet",  category: "identity", weight: 3, kind: "habit", body: "Animal-based + fruit + honey. Was stricter, no longer." },
    { id: "h:coffee",          type: "entity", label: "Kingdom Coffee",     category: "identity", weight: 2, kind: "habit", body: "Regular beans, not decaf." },

    // ============ DOG ============
    { id: "e:dog",             type: "entity", label: "Golden retriever pup", category: "identity", weight: 3, kind: "pet", body: "Young English golden. Kennel + bell + bathroom routine." },

    // ============ TRAVEL ============
    { id: "x:greece",          type: "entity", label: "Greece trip",        category: "identity", weight: 4, kind: "event", body: "May 18-27, 2026. 8 business days. Minimal work via laptop, high-priority only.", highlight: true },

    // ============ EXTERNAL CONTACTS ============
    { id: "e:stephen",         type: "entity", label: "Stephen (Wellstax)", category: "aleph", weight: 3, kind: "person", body: "Tax accountant. stephen@wellstax.com. Cross Mgmt P&L, Wedgewood Sch E." },
    { id: "e:domeier",         type: "entity", label: "Patrick Domeier (AmFam)", category: "cak-cross", weight: 3, kind: "person", body: "Cross Mgmt insurance broker. pdomeier@amfam.com. Likely non-renewing 11/1/2026." },
    { id: "e:brad",            type: "entity", label: "Brad Klingman",      category: "identity", weight: 3, kind: "person", body: "Rise Up Label / WoodWorking Label Experts. Hubspot data consolidation project." },
    { id: "e:litter-route",    type: "entity", label: "Litter route worker",category: "cak-cross", weight: 3, kind: "person", body: "+16512520113. Receives pickup addresses regularly." },

    // ============ ALEPH FINANCE skill set ============
    { id: "s:aleph-readme",    type: "skill", label: "Aleph Finance / 00_README",    category: "aleph", weight: 5, path: "Claude Files/Aleph Finance/00_README.md", body: "Deep dive entry point for QBO, accruals, recon, fixed assets." },
    { id: "s:aleph-working-style", type: "skill", label: "Aleph 00_Working_Style",  category: "meta", weight: 5, path: "Claude Files/Aleph Finance/00_Working_Style.md", body: "Canonical working-style doc." },
    { id: "s:qbo-bridge-arch", type: "skill", label: "QBO Bridge Architecture",     category: "aleph", weight: 4, path: "Claude Files/Aleph Finance/QBO_Bridge_Architecture.md" },
    { id: "s:qbo-bridge-status", type: "skill", label: "QBO Bridge Status",         category: "aleph", weight: 4, path: "Claude Files/Aleph Finance/QBO_Bridge_Status.md" },
    { id: "s:qbo-ref",         type: "skill", label: "QuickBooks Reference",       category: "aleph", weight: 4, path: "Claude Files/Aleph Finance/QuickBooks_Reference.md" },
    { id: "s:accrual-gl",      type: "skill", label: "Accrual & GL Coding",        category: "aleph", weight: 4, path: "Claude Files/Aleph Finance/Accrual_and_GL_Coding.md" },
    { id: "s:fixed-assets",    type: "skill", label: "Fixed Assets / Depreciation",category: "aleph", weight: 4, path: "Claude Files/Aleph Finance/Fixed_Assets_Depreciation.md" },
    { id: "s:recon-issues",    type: "skill", label: "Reconciliation Issues",      category: "aleph", weight: 4, path: "Claude Files/Aleph Finance/Reconciliation_Issues.md" },
    { id: "s:entities-people", type: "skill", label: "Aleph Entities / People",    category: "aleph", weight: 4, path: "Claude Files/Aleph Finance/Aleph_Entities_People.md" },

    // ============ CAK / CROSS files ============
    { id: "s:cak-memory",      type: "skill", label: "CAK_MEMORY.md",      category: "cak-cross", weight: 5, path: "Claude Files/CAK:Cross/CAK_MEMORY.md", body: "CAK branding, pricing, BLVD history." },
    { id: "s:avid-workflow",   type: "skill", label: "AVID Invoice Workflow", category: "cak-cross", weight: 4, path: "Claude Files/CAK:Cross/AVID_INVOICE_WORKFLOW.md" },
    { id: "s:cak-pricing-v4",  type: "skill", label: "CAK Pricing Model v4", category: "cak-cross", weight: 4, path: "Claude Files/CAK:Cross/CAK_Pricing_Model_v4_2026-05-06.md" },

    // ============ SKILLS / IMPORTS ============
    { id: "s:property-import", type: "skill", label: "Property Import skill", category: "apps", weight: 4, path: "Claude Files/Property Import/SKILL.md" },
    { id: "s:rent-mgr-import", type: "skill", label: "Rent Manager Import",  category: "apps", weight: 4, path: "Claude Files/Rent Manager Import/SKILL.md" },
    { id: "s:daily-pulse",     type: "skill", label: "Daily Pulse skill",    category: "apps", weight: 6, path: "Claude Files/Daily Pulse/SKILL.md", body: "7am-noon CT iMessage summary to +17633011313." },
    { id: "s:skills-conv",     type: "skill", label: "Claude Skills Convention", category: "apps", weight: 4, path: "Claude Files/_Claude Skills Convention/SKILL.md" },

    // ============ LOCAL APPS ============
    { id: "a:apps-menu",       type: "app", label: "Apps Menu",              category: "apps", weight: 6, path: "Desktop/Apps_Menu.html", body: "Launcher. APPS[] is source of truth for registered apps." },
    { id: "a:blvd-invoicing",  type: "app", label: "BLVD/CAK/Cross Invoicing", category: "cak-cross", weight: 6, path: "Claude Files/CAK:Cross/BLVD_Invoicing.html", body: "Branded invoicing for CAK + Cross. Smart-paste line items, ZIP-bundle bulk PDFs." },
    { id: "a:cak-bid-tool",    type: "app", label: "CAK Bid Tool v3",        category: "cak-cross", weight: 5, path: "Claude Files/CAK:Cross/CAK_Bid_Tool.html", body: "Portfolio pricing. Customer/internal views, inline edits, export CSV/PDF." },
    { id: "a:cak-bid-est",     type: "app", label: "CAK Bid Estimator (v2)", category: "cak-cross", weight: 3, path: "Claude Files/CAK:Cross/CAK_Bid_Estimator.html", body: "Single-property estimator (legacy)." },
    { id: "a:recurring-cl",    type: "app", label: "Recurring Checklist",   category: "apps", weight: 5, path: "Claude Files/Claude Apps/recurring-checklist/recurring-checklist.html", body: "41 tasks across personal + Aleph." },
    { id: "a:task-tracker",    type: "app", label: "Recurring Task Tracker",category: "apps", weight: 6, path: "Claude Files/Claude Apps/recurring-task-tracker/recurring-task-tracker.html", body: "Scheduled task dashboard. Source of truth for did-X-run-today.", highlight: true },
    { id: "a:brain-map",       type: "app", label: "Brain Map (this)",       category: "apps", weight: 8, path: "Claude Files/Claude Apps/brain-map/brain-map.html", body: "Visual brain of all topics/contexts/cross-links/recent updates.", highlight: true },
    { id: "a:brain-mobile",    type: "app", label: "Brain Mobile",            category: "apps", weight: 7, path: "Claude Files/Claude Apps/brain-map/brain-mobile.html", body: "Phone-first capture / browse / inspect / ask. Voice via iOS keyboard mic. Each action copies a SYNC BRAIN payload + opens Claude so updates land in seconds.", highlight: true },

    // ============ MCPs ============
    { id: "m:imessage",        type: "mcp", label: "iMessage MCP",          category: "apps", weight: 5, path: "Claude Files/Claude MCPs/imessage/", body: "Read/search iMessage+SMS, count unread, send from Claude Desktop." },
    { id: "m:scheduled-tasks", type: "mcp", label: "Scheduled Tasks MCP",   category: "apps", weight: 5, body: "list_scheduled_tasks, update_scheduled_task. No delete - use enabled:false." },
    { id: "m:gmail-mcp",       type: "mcp", label: "Gmail MCP",              category: "apps", weight: 4, body: "Search threads, drafts, labels." },
    { id: "m:asana-mcp",       type: "mcp", label: "Asana MCP",              category: "apps", weight: 4 },
    { id: "m:notion-mcp",      type: "mcp", label: "Notion MCP",             category: "apps", weight: 4 },
    { id: "m:gdrive-mcp",      type: "mcp", label: "Google Drive MCP",       category: "apps", weight: 4 },

    // ============ SCHEDULED TASKS ============
    { id: "z:daily-pulse",     type: "entity", label: "Daily Pulse (sched)",category: "apps", weight: 5, kind: "task", body: "Hourly 7am-noon CT iMessage summary. enabled:true." },
    { id: "z:digest",          type: "entity", label: "Email Digest (archived)", category: "apps", weight: 3, kind: "task", body: "9am CT email digest. Archived 2026-05-11." },
    { id: "z:fuze-sum",        type: "entity", label: "Fuze Summary (archived)", category: "apps", weight: 3, kind: "task", body: "9am CT Fuze summary. Archived 2026-05-11." },
    { id: "z:notion-rollover", type: "entity", label: "Notion Rollover (archived)", category: "apps", weight: 3, kind: "task", body: "Hourly Notion Recurring Checklist rollover. Archived." }
  ],

  edges: [
    // README -> all brain files
    { source: "f:readme", target: "f:about-kam",      type: "ref" },
    { source: "f:readme", target: "f:personal-life",  type: "ref" },
    { source: "f:readme", target: "f:voice-tone",     type: "ref" },
    { source: "f:readme", target: "f:aleph-context",  type: "ref" },
    { source: "f:readme", target: "f:accounting",     type: "ref" },
    { source: "f:readme", target: "f:cross-mgmt",     type: "ref" },
    { source: "f:readme", target: "f:working-style",  type: "ref" },
    { source: "f:readme", target: "f:request-patterns", type: "ref" },
    { source: "f:readme", target: "f:project-routing", type: "ref" },
    { source: "f:readme", target: "f:building-apps",  type: "ref" },
    { source: "f:readme", target: "f:apps-launcher",  type: "ref" },

    // project-routing -> downstream skills
    { source: "f:project-routing", target: "s:aleph-readme",    type: "ref" },
    { source: "f:project-routing", target: "s:qbo-bridge-arch", type: "ref" },
    { source: "f:project-routing", target: "s:qbo-bridge-status", type: "ref" },
    { source: "f:project-routing", target: "s:accrual-gl",      type: "ref" },
    { source: "f:project-routing", target: "s:fixed-assets",    type: "ref" },
    { source: "f:project-routing", target: "s:recon-issues",    type: "ref" },
    { source: "f:project-routing", target: "s:entities-people", type: "ref" },
    { source: "f:project-routing", target: "s:cak-memory",      type: "ref" },
    { source: "f:project-routing", target: "s:avid-workflow",   type: "ref" },
    { source: "f:project-routing", target: "s:cak-pricing-v4",  type: "ref" },
    { source: "f:project-routing", target: "a:apps-menu",       type: "ref" },
    { source: "f:project-routing", target: "f:apps-launcher",   type: "ref" },
    { source: "f:project-routing", target: "s:property-import", type: "ref" },
    { source: "f:project-routing", target: "s:rent-mgr-import", type: "ref" },
    { source: "f:project-routing", target: "m:imessage",        type: "ref" },
    { source: "f:project-routing", target: "a:recurring-cl",    type: "ref" },

    // working-style contains the 12 hard rules
    { source: "f:working-style", target: "r:do-dont-ask",     type: "contains" },
    { source: "f:working-style", target: "r:desktop-access",  type: "contains" },
    { source: "f:working-style", target: "r:no-permission",   type: "contains" },
    { source: "f:working-style", target: "r:minimize-kam",    type: "contains" },
    { source: "f:working-style", target: "r:no-em-dash",      type: "contains" },
    { source: "f:working-style", target: "r:recon-standard",  type: "contains" },
    { source: "f:working-style", target: "r:token-eff",       type: "contains" },
    { source: "f:working-style", target: "r:retry-now",       type: "contains" },
    { source: "f:working-style", target: "r:surface-missed",  type: "contains" },
    { source: "f:working-style", target: "r:root-cause",      type: "contains" },
    { source: "f:working-style", target: "r:persist-learned", type: "contains" },
    { source: "f:working-style", target: "r:tracker-write",   type: "contains" },
    { source: "f:working-style", target: "r:sync-actions",    type: "contains" },
    { source: "f:working-style", target: "r:sync-brain",      type: "contains" },
    { source: "a:brain-map",     target: "r:sync-brain",      type: "related" },
    { source: "a:brain-map",     target: "r:persist-learned", type: "related" },

    // recon-standard <-> accounting standards
    { source: "f:accounting", target: "r:recon-standard", type: "related" },
    { source: "f:accounting", target: "s:recon-issues",   type: "related" },

    // about-kam mentions everything in his life
    { source: "f:about-kam", target: "e:kam",        type: "mentions" },
    { source: "f:about-kam", target: "e:libby",      type: "mentions" },
    { source: "f:about-kam", target: "e:violet",     type: "mentions" },
    { source: "f:about-kam", target: "b:aleph",     type: "mentions" },
    { source: "f:about-kam", target: "b:cak",       type: "mentions" },
    { source: "f:about-kam", target: "b:cross",     type: "mentions" },
    { source: "f:about-kam", target: "b:fuze",      type: "mentions" },
    { source: "f:about-kam", target: "p:otto",      type: "mentions" },
    { source: "f:about-kam", target: "p:wedgewood-rental", type: "mentions" },
    { source: "f:about-kam", target: "p:penn",      type: "mentions" },
    { source: "f:about-kam", target: "p:wedgewood-primary", type: "mentions" },
    { source: "f:about-kam", target: "p:randolph",  type: "mentions" },
    { source: "f:about-kam", target: "v:tesla",     type: "mentions" },
    { source: "f:about-kam", target: "v:chevy",     type: "mentions" },
    { source: "f:about-kam", target: "h:gym",       type: "mentions" },
    { source: "f:about-kam", target: "h:running",   type: "mentions" },
    { source: "f:about-kam", target: "h:diet",      type: "mentions" },
    { source: "f:about-kam", target: "h:coffee",    type: "mentions" },
    { source: "f:about-kam", target: "e:dog",       type: "mentions" },
    { source: "f:about-kam", target: "x:greece",    type: "mentions" },
    { source: "f:about-kam", target: "e:stephen",   type: "mentions" },
    { source: "f:about-kam", target: "e:karl",      type: "mentions" },
    { source: "f:about-kam", target: "e:grace",     type: "mentions" },
    { source: "f:about-kam", target: "e:brad",      type: "mentions" },
    { source: "f:about-kam", target: "t:qbo",       type: "mentions" },
    { source: "f:about-kam", target: "t:liveflow",  type: "mentions" },
    { source: "f:about-kam", target: "t:wallogy",   type: "mentions" },
    { source: "f:about-kam", target: "t:hubdoc",    type: "mentions" },
    { source: "f:about-kam", target: "t:dext",      type: "mentions" },
    { source: "f:about-kam", target: "t:ramp",      type: "mentions" },
    { source: "f:about-kam", target: "t:gusto",     type: "mentions" },
    { source: "f:about-kam", target: "t:notion",    type: "mentions" },
    { source: "f:about-kam", target: "t:gmail",     type: "mentions" },
    { source: "f:about-kam", target: "t:gdrive",    type: "mentions" },
    { source: "f:about-kam", target: "t:asana",     type: "mentions" },
    { source: "f:about-kam", target: "t:apartments", type: "mentions" },

    // personal-life
    { source: "f:personal-life", target: "e:libby",       type: "mentions" },
    { source: "f:personal-life", target: "e:violet",      type: "mentions" },
    { source: "f:personal-life", target: "e:paul",        type: "mentions" },
    { source: "f:personal-life", target: "e:may2-golf",   type: "mentions" },
    { source: "f:personal-life", target: "e:ben-kayla",   type: "mentions" },
    { source: "f:personal-life", target: "e:home-group",  type: "mentions" },
    { source: "f:personal-life", target: "e:luke",        type: "mentions" },
    { source: "f:personal-life", target: "h:golf",        type: "mentions" },
    { source: "f:personal-life", target: "h:3dprint",     type: "mentions" },
    { source: "f:personal-life", target: "h:gym",         type: "mentions" },
    { source: "f:personal-life", target: "h:coffee",      type: "mentions" },
    { source: "f:personal-life", target: "p:wedgewood-rental", type: "mentions" },
    { source: "f:personal-life", target: "e:litter-route", type: "mentions" },
    { source: "f:personal-life", target: "b:cak",         type: "mentions" },

    // aleph-context mentions the team + clients + product glossary tools
    { source: "f:aleph-context", target: "e:patrick",   type: "mentions" },
    { source: "f:aleph-context", target: "e:erich",     type: "mentions" },
    { source: "f:aleph-context", target: "e:katelynn",  type: "mentions" },
    { source: "f:aleph-context", target: "e:dave-r",    type: "mentions" },
    { source: "f:aleph-context", target: "e:ross",      type: "mentions" },
    { source: "f:aleph-context", target: "e:susan",     type: "mentions" },
    { source: "f:aleph-context", target: "e:pachia",    type: "mentions" },
    { source: "f:aleph-context", target: "e:kyle",      type: "mentions" },
    { source: "f:aleph-context", target: "e:machaela",  type: "mentions" },
    { source: "f:aleph-context", target: "e:nadeesha",  type: "mentions" },
    { source: "f:aleph-context", target: "e:nick",      type: "mentions" },
    { source: "f:aleph-context", target: "e:jonmarc",   type: "mentions" },
    { source: "f:aleph-context", target: "e:mark-nelson", type: "mentions" },
    { source: "f:aleph-context", target: "e:karl",      type: "mentions" },
    { source: "f:aleph-context", target: "c:paris",     type: "mentions" },
    { source: "f:aleph-context", target: "c:ridings",   type: "mentions" },
    { source: "f:aleph-context", target: "c:jmj",       type: "mentions" },
    { source: "f:aleph-context", target: "c:esp",       type: "mentions" },
    { source: "f:aleph-context", target: "c:amp",       type: "mentions" },
    { source: "f:aleph-context", target: "c:tec",       type: "mentions" },
    { source: "f:aleph-context", target: "c:heritage",  type: "mentions" },
    { source: "f:aleph-context", target: "c:midway",    type: "mentions" },
    { source: "f:aleph-context", target: "c:parmer",    type: "mentions" },
    { source: "f:aleph-context", target: "c:prim",      type: "mentions" },
    { source: "f:aleph-context", target: "c:paintgreen", type: "mentions" },
    { source: "f:aleph-context", target: "c:lumos",     type: "mentions" },
    { source: "f:aleph-context", target: "c:ftp",       type: "mentions" },
    { source: "f:aleph-context", target: "c:durapro",   type: "mentions" },
    { source: "f:aleph-context", target: "c:davis",     type: "mentions" },
    { source: "f:aleph-context", target: "t:qbo",       type: "mentions" },
    { source: "f:aleph-context", target: "t:wallogy",   type: "mentions" },
    { source: "f:aleph-context", target: "t:liveflow",  type: "mentions" },
    { source: "f:aleph-context", target: "t:gusto",     type: "mentions" },
    { source: "f:aleph-context", target: "b:aleph",     type: "mentions" },

    // reporting + relationships
    { source: "e:kam", target: "e:patrick",  type: "reports-to" },
    { source: "e:patrick", target: "e:erich", type: "reports-to" },
    { source: "e:kam", target: "e:libby",     type: "related" },
    { source: "e:kam", target: "e:violet",    type: "related" },
    { source: "e:kam", target: "b:aleph",     type: "uses" },
    { source: "e:kam", target: "b:cak",       type: "owns" },
    { source: "e:kam", target: "b:cross",     type: "owns" },
    { source: "e:kam", target: "b:fuze",      type: "related" },
    { source: "e:kam", target: "p:otto",      type: "owns" },
    { source: "e:kam", target: "p:wedgewood-rental", type: "owns" },
    { source: "e:kam", target: "p:penn",      type: "owns" },
    { source: "e:kam", target: "p:wedgewood-primary", type: "owns" },
    { source: "e:kam", target: "p:randolph",  type: "owns" },
    { source: "e:kam", target: "v:tesla",     type: "owns" },
    { source: "e:kam", target: "v:chevy",     type: "owns" },
    { source: "e:kam", target: "e:dog",       type: "owns" },

    // clients use tools
    { source: "c:prim",       target: "t:hubdoc",   type: "uses" },
    { source: "c:parmer",     target: "t:dext",     type: "uses" },
    { source: "c:lumos",      target: "t:wallogy",  type: "uses" },
    { source: "c:paintgreen", target: "t:wallogy",  type: "uses" },
    { source: "c:ftp",        target: "t:ramp",     type: "uses" },
    { source: "b:aleph",      target: "t:gusto",    type: "uses" },
    { source: "b:aleph",      target: "t:liveflow", type: "uses" },
    { source: "b:aleph",      target: "t:qbo",      type: "uses" },

    // cross-mgmt
    { source: "f:cross-mgmt", target: "b:cross",        type: "mentions" },
    { source: "f:cross-mgmt", target: "p:randolph",     type: "mentions" },
    { source: "f:cross-mgmt", target: "t:rent-manager", type: "mentions" },
    { source: "f:cross-mgmt", target: "t:apartments",   type: "mentions" },
    { source: "f:cross-mgmt", target: "e:domeier",      type: "mentions" },

    // accounting standards
    { source: "f:accounting", target: "t:qbo",      type: "mentions" },
    { source: "f:accounting", target: "t:wallogy",  type: "mentions" },
    { source: "f:accounting", target: "t:hubdoc",   type: "mentions" },
    { source: "f:accounting", target: "t:dext",     type: "mentions" },
    { source: "f:accounting", target: "c:prim",     type: "mentions" },
    { source: "f:accounting", target: "c:paintgreen", type: "mentions" },

    // apps-launcher
    { source: "f:apps-launcher", target: "a:apps-menu",     type: "mentions" },
    { source: "f:apps-launcher", target: "a:blvd-invoicing", type: "mentions" },
    { source: "f:apps-launcher", target: "a:cak-bid-tool",  type: "mentions" },
    { source: "f:apps-launcher", target: "a:cak-bid-est",   type: "mentions" },
    { source: "f:apps-launcher", target: "a:recurring-cl",  type: "mentions" },

    // building-apps
    { source: "f:building-apps", target: "a:apps-menu", type: "ref" },
    { source: "f:building-apps", target: "a:blvd-invoicing", type: "ref" },

    // voice-tone -> Kam (he's the writer)
    { source: "f:voice-tone", target: "e:kam",    type: "mentions" },
    { source: "f:voice-tone", target: "e:libby",  type: "mentions" },

    // request-patterns
    { source: "f:request-patterns", target: "e:kam",       type: "mentions" },
    { source: "f:request-patterns", target: "f:building-apps", type: "related" },

    // recurring task tracker contains the scheduled tasks
    { source: "a:task-tracker", target: "z:daily-pulse",     type: "contains" },
    { source: "a:task-tracker", target: "z:digest",          type: "contains" },
    { source: "a:task-tracker", target: "z:fuze-sum",        type: "contains" },
    { source: "a:task-tracker", target: "z:notion-rollover", type: "contains" },
    { source: "a:task-tracker", target: "r:tracker-write",   type: "related" },
    { source: "a:task-tracker", target: "r:sync-actions",    type: "related" },

    // daily pulse skill -> scheduled task -> tracker
    { source: "s:daily-pulse", target: "z:daily-pulse", type: "related" },
    { source: "s:daily-pulse", target: "m:imessage",   type: "uses" },
    { source: "z:daily-pulse", target: "m:imessage",   type: "uses" },

    // MCPs -> tools
    { source: "m:gmail-mcp",  target: "t:gmail",   type: "related" },
    { source: "m:asana-mcp",  target: "t:asana",   type: "related" },
    { source: "m:notion-mcp", target: "t:notion",  type: "related" },
    { source: "m:gdrive-mcp", target: "t:gdrive",  type: "related" },

    // brain-map -> everything (it visualizes the whole brain)
    { source: "a:brain-map", target: "f:readme",         type: "related" },
    { source: "a:brain-map", target: "r:persist-learned", type: "related" },
    { source: "a:brain-mobile", target: "a:brain-map",   type: "related" },
    { source: "a:brain-mobile", target: "r:sync-brain",  type: "related" },
    { source: "a:brain-mobile", target: "r:persist-learned", type: "related" },

    // CAK / Cross
    { source: "b:cak",   target: "b:blvd",         type: "related" },
    { source: "b:cak",   target: "s:cak-memory",   type: "related" },
    { source: "b:cak",   target: "a:blvd-invoicing", type: "related" },
    { source: "b:cak",   target: "a:cak-bid-tool", type: "related" },
    { source: "b:cak",   target: "s:cak-pricing-v4", type: "related" },
    { source: "b:cak",   target: "s:avid-workflow", type: "related" },
    { source: "b:cross", target: "f:cross-mgmt",   type: "related" },

    // Karl was Kam's VA before Aleph
    { source: "e:karl",  target: "b:aleph", type: "uses" },
    { source: "e:karl",  target: "e:kam",   type: "related" },
    { source: "e:grace", target: "e:kam",   type: "related" }
  ]
};
