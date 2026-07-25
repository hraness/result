# Contents

- `src/index.ts` – dependency-free `Result`, `Option`, constructors, narrowing helpers, mapping, record checks, and exhaustiveness.
- `src/index.test.ts` – readable API behavior and regression examples.
- `src/index.property.test.ts` – algebraic and arbitrary-input laws.
- `src/test-support.ts` – bounded property-test helpers used only by the test suite.
- `dist/` – committed ESM JavaScript and declarations consumed by GitHub dependencies.
- `.github/workflows/` – read-only branch validation and checks-gated immutable GitHub Release automation.
- `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `LICENSE` – public usage, project policy, and terms.
- `package.json`, `tsconfig.json`, and `bun.lock` – standalone package and verification configuration.

# Guidelines

- Use Bun 1.3.14 for repository commands and keep the ESM runtime portable to modern Bun and Node.js projects.
- Keep the `@cclrte/result` runtime dependency-free. Development-only test utilities must not enter the package exports or runtime graph.
- Preserve discriminated-union narrowing without assertions. Parse foreign values from `unknown` and throw only for violated programmer invariants.
- Use `Result<T, E>` for recoverable failures and `Option<T>` for plain absence. Keep helpers small, total, and justified by multiple consumers.
- Pair every concrete API change with a readable example test and add an independent property law for algebra, round trips, parsers, or arbitrary-input invariants.
- Treat this repository as the complete project. Files and Git prose may use only its public names, paths, commands, and examples; do not refer to or infer any non-public source, system, product, package, path, or implementation detail.
- Run `bun run check` before handing off a change.
- Treat a `v*` tag as a release request, not a completed release. Before tagging, confirm repository-level immutable releases are enabled; use a strictly increasing stable package version, keep the tag equal to `v<package.json version>` on `main`, and let the read-only verification job complete before its write-scoped publisher creates the Release. Do not create the next tag until that workflow and Release are verified because GitHub concurrency is not a durable queue. After tagging, verify the matching non-draft immutable Release is Latest.
