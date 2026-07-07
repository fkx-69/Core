---
name: code-refactoring
description: Analyze, write, and refactor code to make it clean, modular, maintainable, testable, secure, and consistent with the repository architecture. Use when improving code quality, reducing duplication, separating responsibilities, simplifying complex code, strengthening types and validation, or restructuring modules without changing expected behavior.
---

# Code Refactoring

Use this skill to improve code structure while preserving expected behavior. Prefer the repository's existing architecture, language conventions, framework patterns, and helper APIs over generic designs.

## Core Principles

- Understand the current behavior before changing it.
- Preserve public behavior, data contracts, and compatibility unless the user explicitly asks for a breaking change.
- Make small, progressive, verifiable changes.
- Reuse existing abstractions when they fit; simplify or remove abstractions that add friction without value.
- Avoid unnecessary layers, premature design patterns, broad rewrites, and clever code that is harder to read.
- Favor code another developer can understand without long explanations.
- Keep refactoring separate from new feature work unless the user asks for both.

## Required Workflow

1. Read applicable repository instructions before editing: `AGENTS.md`, the main README, project conventions, relevant architecture docs, lint and formatting config, test config, build config, and nearby code.
2. Define the scope: affected feature, inputs, outputs, dependencies, callers, callees, side effects, business rules, existing tests, and public APIs that must not break.
3. Establish a baseline when feasible by running targeted tests, type checks, lint, formatting checks, and relevant builds. Distinguish pre-existing failures from failures introduced by the refactor.
4. Diagnose the code before editing. Look for long functions, files with mixed responsibilities, large classes, duplication, dead code, deep nesting, vague names, circular or overly tight dependencies, hidden side effects, magic values, hard-coded config, weak types, missing validation, swallowed errors, overly broad exceptions, premature abstractions, oversized UI components, mixed business/presentation/data-access logic, repeated queries, and obvious security or performance issues.
5. For important changes, give a short plan covering the problems found, files involved, proposed changes, risks, and validations. For small local changes, keep the plan brief.
6. Refactor incrementally. After each meaningful step, verify behavior with the most relevant tests or checks.
7. Update affected tests and documentation. Do not create new Markdown docs when an existing document should be updated instead.
8. Finish with validation and a concise report of changes, tests, risks, and remaining follow-ups.

## Modularity

- Give each module one clear primary responsibility.
- Separate business logic, presentation, data access, and external integrations when it genuinely improves the project.
- Extract a function when a block represents a coherent operation.
- Extract a module when a group of functions shares one cohesive responsibility.
- Avoid vague files such as `utils`, `helpers`, `common`, or `misc` when a domain-specific name is possible.
- Keep dependencies explicit and limited; avoid circular dependencies.
- Keep public interfaces small and stable.
- Place code near the feature that uses it when that matches the repository architecture.

## Functions And Naming

- Prefer functions with one clear purpose, intention-revealing names, only necessary parameters, predictable returns, limited side effects, and manageable nesting.
- Use early returns when they improve readability.
- Do not split a short, cohesive function only to reduce line count.
- Use repository and domain vocabulary in names.
- Avoid ambiguous abbreviations and vague names such as `data`, `item`, `temp`, `result`, or `manager` when a precise name exists.
- Keep naming consistent across models, services, APIs, components, and tests.

## Types, Validation, And Errors

- Strengthen vague types and avoid universal types such as `any` unless there is a clear justification.
- Model business states explicitly and distinguish optional, null, and absent values.
- Type public interfaces.
- Validate data at system boundaries: user input, APIs, files, environment variables, databases, and external services.
- Do not silently ignore errors.
- Prefer specific errors or exceptions with useful messages.
- Preserve original error causes when the language supports it.
- Distinguish user, business, network, database, and system failures when useful.
- Avoid leaking secrets, sensitive data, or internal implementation details in errors or logs.

## Tests

- Preserve existing tests.
- Add tests before risky refactors when behavior is not covered well enough.
- Test behavior rather than internal implementation details.
- Cover important happy paths, edge cases, and error paths.
- Avoid fragile tests.
- Update tests only when expected behavior intentionally changes.
- Do not delete a test only because it fails after refactoring; explain if the test appears obsolete or incorrect.

## Security And Performance

- Check input validation, authorization, secret handling, injection risks, sensitive data exposure, unsafe external calls, dangerous file operations, sensitive logs, and errors that expose internals.
- Do not change a security rule without explaining the consequence.
- Fix obvious in-scope performance issues such as repeated work, N+1 queries, repeated network calls, unnecessary data loading, unnecessary UI renders, and inappropriate data structures.
- Do not sacrifice readability for unmeasured micro-optimizations.

## Compatibility

Preserve these unless the user explicitly requests otherwise:

- Public APIs and signatures.
- Data formats and database schemas.
- Contracts with external services.
- Environment variables.
- Behavior used by other modules.

When a breaking change is necessary, identify it explicitly, explain the impact, propose a migration path, and do not make it silently.

## Avoid

- Full rewrites without strong justification.
- Mass renames without clear benefit.
- Unnecessary dependencies or new frameworks.
- Premature generic abstractions.
- Unrelated formatting churn.
- Mixing large refactors with new functionality.
- Removing logic whose purpose has not been checked.
- Excessive comments, comments that repeat code, or stale comments.
- Hard-coded values, broad exceptions, or weak types without justification.
- Silent behavior changes.
- Duplicating an architecture that already exists in the repository.

## Final Validation

Run the relevant available checks after refactoring:

- Unit and integration tests.
- Type checks.
- Linting.
- Formatting checks or formatting.
- Build commands.
- Feature-specific tests.

Also check for unused imports, dead code, broken references, circular dependencies, accidental API changes, unintended behavior changes, and unrelated file modifications.

## Final Report

Summarize:

- Problems identified.
- Changes made.
- Files added, moved, or deleted.
- Duplication removed and responsibilities separated.
- Type, validation, error-handling, security, or performance improvements.
- Tests added or changed.
- Validation commands run and whether they passed.
- Remaining risks, limits, and recommended next improvements that are outside the current scope.
