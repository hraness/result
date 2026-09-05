<!-- kb:context scopes/repository--cdb4ee2aea69 -->
# Contents

- `src/index.ts` – dependency-free `Result`, `Option`, constructors, narrowing helpers, mapping, record checks, and exhaustiveness.
- `src/index.test.ts` – readable API behavior and regression examples.
- `src/index.property.test.ts` – algebraic and arbitrary-input laws.
- `src/test-support.ts` – bounded property-test helpers used only by the test suite.
- `dist/` – committed ESM JavaScript and declarations consumed by GitHub dependencies.
- `kb/` – authored repository rationale, maintained synthesis, and durable plans.
- `.agents/skills/` – portable KB and phased-execution workflows.
- `WRITING.md` and `STYLE.md` – internal and public prose contracts.
- `.github/workflows/` – read-only branch validation and checks-gated immutable GitHub Release automation.
- `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `LICENSE` – public usage, project policy, and terms.
- `package.json`, `tsconfig.json`, and `bun.lock` – standalone package and verification configuration.

# Guidelines

- Use Bun 1.3.14 for repository commands and keep the ESM runtime portable to modern Bun and Node.js projects.
- Follow `WRITING.md` for internal prose and `STYLE.md` for public prose.
- Apply unreasonably robust programming when agent work is cheap. Prefer coherent cross-file correctness and focused deterministic evidence to a knowingly weaker design.
- Deliver changes to `main` through a current-head pull request. Keep the stable `Required` CI job green, resolve every review thread, and serialize merges. Human approval stays optional while one regular maintainer would otherwise self-review. Never force-push or bypass the gate.
- Keep the `@hraness/result` runtime dependency-free. Development-only test utilities must not enter the package exports or runtime graph.
- Preserve discriminated-union narrowing without assertions. Model invalid states out of existence, parse foreign values from `unknown`, and throw only for violated programmer invariants.
- Use `Result<T, E>` for recoverable failures and `Option<T>` for plain absence. Keep helpers small, total, and justified by multiple consumers.
- Pair every concrete API change with a readable deterministic regression test and add an independent property law for algebra, round trips, parsers, ordering, or arbitrary-input invariants.
- Pin Hraness dependencies to reviewed immutable releases or full commits. Never connect repositories with sibling paths, Git submodules, or coordinated `main` assumptions.
- Extract a shared abstraction only after two concrete consumers need the same stable interface. Keep this package product-neutral and independently releasable; consumers upgrade on their own validation schedule.
- Keep this package headless. Do not add UI, design-system, application composition, product policy, or product-specific variants.
- Freeze public interfaces before parallel lanes begin. Give manifests, lockfiles, generated files, and other convergence surfaces one owner while lanes edit disjoint paths.
- Keep mandatory rules in the closest `AGENTS.md`, current procedures in `docs/` when needed, executable contracts in types and tests, and pull-based rationale and plans in `kb/`.
- Run `bun run kb:check:lane` in an independent KB lane. The integrating agent runs `bun run kb:refresh` and `bun run kb:check`.
- Treat this repository as the complete project. Files and Git prose may use only its public names, paths, commands, and examples; do not refer to or infer any non-public source, system, product, package, path, or implementation detail.
- Run `bun run check` before handing off a change.
- Treat a `v*` tag as a release request, not a completed release. Before tagging, confirm repository-level immutable releases are enabled; use a strictly increasing stable package version, keep the tag equal to `v<package.json version>` on `main`, and let the read-only verification job complete before its write-scoped publisher creates the Release. Do not create the next tag until that workflow and Release are verified because GitHub concurrency is not a durable queue. After tagging, verify the matching non-draft immutable Release is Latest.

<!-- hra-local-efficiency:start -->
- Treat the user's request to change this repository as standing authorization for routine task-owned commits, pushes, pull requests, merges, releases, deployments, and production verification after the repository's required validation, review, identity, and rollout gates pass. Do not ask for another confirmation at each delivery step.
- Use the repository's documented delivery workflow and preserve every runtime-enforced approval, branch protection, environment rule, safety policy, and final gate. Ask for user input only when delivery needs a material product decision, missing credentials or authority, an irreversibly destructive action outside task scope, or resolution of a release failure that cannot be handled safely and autonomously.
- Prefer short-lived repository workload identities such as OIDC trusted publishing, GitHub Apps, and narrowly scoped machine identities. Do not add long-lived personal tokens, weaken two-factor authentication, or bypass provider controls to eliminate an interactive prompt. Batch unavoidable human-gated production promotions into intentional stable releases while agents publish validated prerelease or beta channels through workload identities when the repository supports them.
- Preserve useful reasoning fan-out, but avoid unnecessary checkout fan-out. Prefer subagents in the current task for bounded research, review, diagnosis, and focused checks when they can safely share one working tree; create a separate task or worktree only for independently deliverable divergent edits, an isolated verification tree, or a different execution environment.
- Give each expensive focused validation command and external wait one owner. The integration owner reviews that evidence and runs the repository-required aggregate or final gate once after convergence. Reuse evidence only for the exact Git tree, command, lockfiles, toolchain, relevant environment, and validity period, and never to skip a required final integration, merge, release, deployment, or production-verification gate.
- On Hraness development machines, use `$hra-local-efficiency` and the installed host scheduler for heavyweight top-level commands when available. Keep ordinary work in the compute lane; give authenticated browser/dev-server/Chromium work one `browser-auth` owner and Mac-only validation one `mac-native` owner.
- When a CI or policy gate scans complete Git history, check out the exact governed SHA and fetch only the fully qualified governed refs before scanning. Preserve the complete-history gate and reject unexpected refs instead of importing unrelated concurrent heads.
- At closeout, record applicable branch, PR, check, merge, release, deployment, and production evidence. Archive only conclusively finished tasks, never from silence alone, and reclaim only freshly revalidated clean merged worktrees through the guarded exact-path flow.
<!-- hra-local-efficiency:end -->
