# Result

Represent recoverable failure as typed data and plain absence as `null`.
`@hraness/result` provides a dependency-free `Result<T, E>` and `Option<T>` for
TypeScript without adding a framework or runtime policy.

The `ok` discriminant narrows both branches. A caller that handles success must
also handle the declared failure type.

## Install an immutable release

Pin the GitHub dependency to a version tag. The current release is
[`v0.2.1`](https://github.com/hraness/result/releases/tag/v0.2.1).

```json
{
  "dependencies": {
    "@hraness/result": "github:hraness/result#v0.2.1"
  }
}
```

```sh
bun install
```

The lockfile records the resolved commit. Upgrading the package requires an
explicit tag change.

## Return one of two valid states

This example uses `Option<string>` for an input that can be absent and
`Result<number, PortError>` for validation that can fail.

```ts
import { err, ok, type Option, type Result } from "@hraness/result";

type PortError =
  | { readonly kind: "missing" }
  | { readonly kind: "invalid"; readonly input: string };

function parsePort(input: Option<string>): Result<number, PortError> {
  if (input === null) return err({ kind: "missing" });

  const port = Number(input);
  return Number.isInteger(port) && port > 0 && port <= 65_535
    ? ok(port)
    : err({ kind: "invalid", input });
}

const result = parsePort("3000");
if (result.ok) {
  console.log(result.value); // 3000
} else {
  console.error(result.error.kind);
}
```

The constructors return ordinary objects:

```ts
parsePort("3000"); // { ok: true, value: 3000 }
parsePort(null);   // { ok: false, error: { kind: "missing" } }
parsePort("auto"); // { ok: false, error: { kind: "invalid", input: "auto" } }
```

No exception represents these expected outcomes. `Result` keeps the failure
type on the function signature, while `Option<T>` means only `T | null`.

## Keep failure handling exhaustive

Use a discriminated error union when callers must handle different recovery
paths. `assertNever` turns an omitted case into a type error and retains a
runtime backstop for values that bypass TypeScript.

```ts
import { assertNever } from "@hraness/result";

function describePortError(error: PortError): string {
  switch (error.kind) {
    case "missing":
      return "Set PORT.";
    case "invalid":
      return `PORT must be an integer from 1 through 65535, received ${error.input}.`;
    default:
      return assertNever(error);
  }
}

const parsed = parsePort("auto");
if (!parsed.ok) console.error(describePortError(parsed.error));
```

Adding another `PortError` variant makes the `default` branch fail typechecking
until `describePortError` handles it.

## Preserve inference through the branch

The constructors keep the discriminant literal and infer their payloads:

```ts
const success = ok(42);       // Ok<number>
const failure = err("stop"); // Err<string>
```

An annotated function combines those variants into a `Result<T, E>`. Checking
`result.ok`, `isOk(result)`, or `isErr(result)` narrows without a cast.

```ts
import { mapOk, unwrapOr } from "@hraness/result";

const parsed = parsePort("3000");
const label = mapOk(parsed, (port) => `:${port}`); // Result<string, PortError>
const port = unwrapOr(parsed, 8080);               // number
```

`mapOk` transforms only the success value and preserves the failure type.
`unwrapOr` returns the success value or a caller-supplied fallback of the same
success type.

## API map

| Export | Type or signature | Contract |
|--------|-------------------|----------|
| `Result<T, E = Error>` | `Ok<T> | Err<E>` | Recoverable success or failure. |
| `Ok<T>` | `{ readonly ok: true; readonly value: T }` | Successful variant. |
| `Err<E>` | `{ readonly ok: false; readonly error: E }` | Failed variant. |
| `Option<T>` | `T | null` | Plain absence. It does not include `undefined`. |
| `ok(value)` | `T -> Ok<T>` | Construct a success. |
| `err(error)` | `E -> Err<E>` | Construct a failure. |
| `isOk(result)` | Type guard | Narrow a `Result` to `Ok<T>`. |
| `isErr(result)` | Type guard | Narrow a `Result` to `Err<E>`. |
| `mapOk(result, transform)` | `Result<T, E> -> Result<U, E>` | Transform success and preserve failure. |
| `unwrapOr(result, fallback)` | `Result<T, E> -> T` | Read success or use a fallback. |
| `isRecord(value)` | `unknown -> Record<PropertyKey, unknown>` | Exclude `null`, arrays, functions, and primitives before reading foreign fields. |
| `assertNever(value)` | `never -> never` | Enforce exhaustive handling and throw if an impossible value reaches runtime. |

The package does not provide matching syntax, asynchronous combinators,
validation accumulation, or application-specific error classes.

## Package and compatibility facts

| Concern | Contract |
|---------|----------|
| Runtime graph | Zero runtime dependencies. |
| Module format | ESM only. There is no CommonJS `require` export. |
| Runtime artifact | GitHub installs execute the committed `dist/index.js`; release `v0.2.1` contains 952 bytes of unminified JavaScript. |
| Type artifact | TypeScript reads `src/index.ts` through the package export map. |
| Build | Bun 1.3.14 bundles `src/index.ts` for the Node target as ESM. |
| Bun | The repository builds and runs its tests with Bun 1.3.14. |
| Node.js | Package smoke imports the packed ESM artifact with Node.js. |
| TypeScript | Package smoke typechecks a packed consumer with both `Bundler` and `NodeNext` module resolution. |

The repository commits `dist/index.js` because a GitHub dependency consumes the
checked-in tree. `bun run check` typechecks the source, rebuilds `dist`, packs and
imports a temporary consumer, checks both TypeScript resolution modes, and runs
deterministic and property tests.

## Choose the smallest failure model that fits

| Situation | Use |
|-----------|-----|
| A caller can recover from a declared failure | `Result<T, E>`. The failure remains visible in the return type. |
| A value can be absent without an error | `Option<T>`. Use `null` as the one absence state. |
| An invariant is impossible in a well-typed program | An assertion or thrown error. `assertNever` covers exhaustive unions. |
| A local function already returns `T | null` | Keep that shape. `Option<T>` adds a shared name, not new runtime behavior. |
| A product needs async pipelines, validation accumulation, matching syntax, or a large combinator set | Use a richer result library or a product-specific layer. This package intentionally stops at the shared primitives above. |

Compared with an object that independently makes `value` and `error` optional,
the `ok` discriminant rules out both-present and neither-present states. Compared
with thrown recoverable errors, `Result<T, E>` makes the failure part of the
caller's typechecking path.

## Verify release provenance

The supported distribution path is a versioned GitHub Release. A `v*` tag starts
the release workflow; it is not proof by itself. Before publishing, the workflow
requires all of these conditions:

- The tag is exactly `v<package.json version>` and uses a stable semantic version.
- The tagged commit is reachable from `main`, and the version is newer than every existing stable tag.
- `bun run check` passes with Bun 1.3.14.
- Rebuilding does not change committed `dist/index.js` or `bun.lock`.
- The packed package imports in Node.js and passes the package smoke contract.

Only then does the publisher create the matching immutable GitHub Release and
verify that GitHub reports it as the latest stable release. The current release,
[`v0.2.1`](https://github.com/hraness/result/releases/tag/v0.2.1), is the tag used
in the install example.

## Development and contributions

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

```sh
bun install --frozen-lockfile --ignore-scripts
bun run check
```

Report suspected vulnerabilities privately as described in
[SECURITY.md](./SECURITY.md).

## License

MIT
