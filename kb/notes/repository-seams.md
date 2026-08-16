---
title: Repository seams
type: concept
tags:
  - architecture
  - dependencies
  - repositories
repository_scopes:
  - AGENTS.md
  - kb
  - WRITING.md
  - STYLE.md
  - package.json
  - src
---

# Repository seams

Result publishes a dependency-free TypeScript foundation for explicit recoverable failure and absence. Its stable seam is the small `Result<T, E>` and `Option<T>` surface plus narrowing, mapping, record checks, and exhaustiveness helpers. Runtime code, declarations, committed distribution artifacts, examples, and package metadata advance together as one independently released artifact.

Consumers pin a reviewed immutable release or full commit and validate upgrades on their own schedule. Do not replace that boundary with sibling paths, Git submodules, or coordinated `main` workflows. Keep the package product-neutral and headless. UI primitives, presentation layers, product policy, and Direct compositions belong to their respective owners.

Add a shared abstraction only after two concrete consumers need the same stable interface. Preserve readable deterministic regressions for concrete behavior and independent property laws for algebra, parsers, ordering, and round trips. Freeze public interfaces before parallel work and give manifests, locks, generated artifacts, and release convergence surfaces one owner.

## Related

The normative rules remain in the root `AGENTS.md`. [[documentation-ownership|Documentation ownership]] explains how those rules relate to executable contracts and this pull-based context.
