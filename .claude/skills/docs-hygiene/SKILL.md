---
name: docs-hygiene
description: Audit, condense, merge, archive, and retire repository Markdown documentation. Use when cleaning documentation, reducing Markdown bloat, compacting long-running goal or specification files, checking documentation freshness, or updating the documentation index.
---

# Docs Hygiene

Use this skill to make repository Markdown documentation accurate, compact, and easy for future Codex tasks to load. Preserve project knowledge while reducing duplicate, stale, speculative, and session-by-session material from active docs.

## Workflow

1. Read the applicable `AGENTS.md` files before changing docs. Also read the documentation index, usually `docs/README.md`; create or update that index when it is missing or incomplete.
2. Find relevant Markdown files with `rg --files -g '*.md'`, excluding dependencies, generated output, caches, build directories, archives being treated as historical-only, and vendor directories. Common exclusions include `.git`, `node_modules`, `.venv`, `venv`, `dist`, `build`, `coverage`, `.next`, `.turbo`, `.cache`, `vendor`, and generated reports.
3. Inspect each candidate document before modifying it. Check current code, repository structure, imports, config, tests, and references as needed; do not rely on file age or size alone.
4. Classify every reviewed document as `KEEP`, `CONDENSE`, `MERGE`, `ARCHIVE`, `DELETE-CANDIDATE`, or `MANUAL-REVIEW`.
5. Determine whether each document is accurate, matches current code and structure, is referenced elsewhere, duplicates another document, contains current requirements, mainly records completed history or repeated reasoning, and should remain an active source of truth.
6. Ensure every major topic has one clear canonical current document. Treat `docs/archive/**` as historical evidence, not current requirements.
7. Prefer archiving over deletion. Use `git mv` when moving tracked files to an archive path, preserve uncommitted user changes, and update links after moves or merges.
8. Validate before finishing: Markdown links are not broken, removed filenames are no longer referenced, current docs do not contradict code, important operational or contractual information was not lost, and cleanup did not introduce unrelated formatting churn.

## Classification Guide

- `KEEP`: Accurate, current, non-duplicative, and useful as an active source of truth.
- `CONDENSE`: Still useful but bloated with repeated updates, old debugging notes, derivable details, or completed narratives.
- `MERGE`: Overlaps substantially with another active document; preserve unique facts in the canonical document and retire the duplicate.
- `ARCHIVE`: Useful historical context, completed plans, superseded specs, or old progress records that should not guide current work.
- `DELETE-CANDIDATE`: Empty, generated, exact duplicate, clearly replaced by a canonical document, or proven to have no independent value.
- `MANUAL-REVIEW`: Uncertain ownership, unclear accuracy, possible hidden contractual value, conflicting requirements, or insufficient evidence to modify safely.

Never delete an uncertain document. Mark it for manual review with the reason and evidence needed.

## Preserve

Keep or move into the canonical active document any important:

- Project goals and scope.
- Acceptance criteria and current requirements.
- API, data, integration, and migration contracts.
- Security requirements and threat assumptions.
- Deployment, recovery, and operational instructions.
- Architectural decisions and their current consequences.
- Active blockers, risks, unresolved questions, evidence, and references.

For long-running goal, planning, coverage, or specification files, retain only the compact current record:

- Goal, scope, current status, and current milestone.
- Acceptance criteria and current coverage or progress.
- Active decisions, blockers, risks, and immediate next actions.
- Canonical references and last verified date.

## Condense Or Archive

Move out of active docs, summarize, or archive:

- Completed task narratives and repeated status updates.
- Old debugging transcripts and session-by-session reasoning.
- Superseded plans and rejected alternatives already recorded elsewhere.
- Historical progress detail that remains useful only as evidence.
- Information that can be derived easily from current code, tests, config, or generated artifacts.

Keep active documentation focused on current state, durable decisions, and immediate next actions. Keep historical detail available through archives or Git history.

## Documentation Index

Maintain or create `docs/README.md` as the active documentation index unless the repository already has a clear equivalent. The index should identify canonical current documents by topic, distinguish archive paths from active requirements, and avoid becoming a long cleanup log.

## Final Report

End with a concise report covering:

- Files kept, condensed, merged, archived, deleted, and requiring manual review.
- Evidence supporting any deletion.
- Current canonical documentation paths.
- Links or contradictions corrected.
- Approximate reduction in active documentation size, such as removed active lines, bytes, or file count.
