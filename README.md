# @hraness/result

Represent recoverable failure as typed data and plain absence as `null`.
`@hraness/result` provides a dependency-free `Result<T, E>` and `Option<T>` for
TypeScript without adding a framework or runtime policy.

Check `result.ok` to narrow the result to its success value or declared error
type.

## Install

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

## Handle thrown exceptions separately

`Result` does not catch exceptions for you. In particular, `mapOk` calls your transform directly on success; an exception from that callback propagates to the caller. On failure, it returns the failed result without calling the transform.

Use `err(...)` for the recoverable outcomes you declare in your function's return type. If you wrap a throwing API, catch its exception in your own adapter and decide which errors are recoverable. `unwrapOr` supplies a fallback for an `Err`; it does not recover from an exception thrown before the result exists.

The `readonly` fields are a TypeScript constraint, not a runtime freeze. The constructors return ordinary objects, so do not rely on them to freeze a payload or validate foreign input.

## API map

| Export | Type or signature | Contract |
|--------|-------------------|----------|
| `Result<T, E = Error>` | `Ok<T> \| Err<E>` | Recoverable success or failure. |
| `Ok<T>` | `{ readonly ok: true; readonly value: T }` | Successful variant. |
| `Err<E>` | `{ readonly ok: false; readonly error: E }` | Failed variant. |
| `Option<T>` | `T \| null` | Plain absence. It does not include `undefined`. |
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

## Compatibility

| Concern | Contract |
|---------|----------|
| Runtime graph | Zero runtime dependencies. |
| Module format | ESM only. There is no CommonJS `require` export. |
| Runtime artifact | GitHub installs execute the included `dist/index.js`. |
| Type artifact | TypeScript reads `src/index.ts` through the package export map. |
| Bun and Node.js | Import the package as ESM. |
| TypeScript | Supports `Bundler` and `NodeNext` module resolution. |

The GitHub dependency includes its JavaScript artifact, so you do not need to
build the package before importing it.

## Choose the smallest failure model that fits

| Situation | Use |
|-----------|-----|
| A caller can recover from a declared failure | `Result<T, E>`. The failure remains visible in the return type. |
| A value can be absent without an error | `Option<T>`. Use `null` as the one absence state. |
| An invariant is impossible in a well-typed program | An assertion or thrown error. `assertNever` covers exhaustive unions. |
| A local function already returns `T \| null` | Keep that shape. `Option<T>` adds a shared name, not new runtime behavior. |
| A product needs async pipelines, validation accumulation, matching syntax, or a large combinator set | Use [neverthrow](https://github.com/supermacro/neverthrow) for `ResultAsync` and method chaining, [true-myth](https://github.com/true-myth/true-myth) for `Result` and `Maybe` classes with methods, or [Effect](https://effect.website) for typed errors with concurrency and dependency injection. This package stops at the primitives above. |

Compared with an object that independently makes `value` and `error` optional,
the `ok` discriminant rules out both-present and neither-present states. Compared
with thrown recoverable errors, `Result<T, E>` makes the failure part of the
caller's typechecking path.

## Releases

Browse [GitHub Releases](https://github.com/hraness/result/releases) for version
history. The [contributor guide](./CONTRIBUTING.md#releases) explains how to
prepare a release.

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

Maintained by [Hraness](https://hraness.com).
