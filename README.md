# Result

Result is a small, dependency-free set of TypeScript helpers for explicit failures and plain absence. It uses discriminated unions, so checking `result.ok` narrows the value without a cast.

## Install from GitHub

Pin the repository to an immutable version tag:

```json
{
  "dependencies": {
    "@hraness/result": "github:hraness/result#v0.2.0"
  }
}
```

Then install with Bun:

```sh
bun install
```

## Use Result

```ts
import { err, ok, type Result } from "@hraness/result";

function parsePort(value: string): Result<number, "invalid port"> {
  const port = Number(value);
  return Number.isInteger(port) && port > 0 && port <= 65_535
    ? ok(port)
    : err("invalid port");
}

const result = parsePort("3000");
if (result.ok) {
  console.log(result.value);
} else {
  console.error(result.error);
}
```

`Result<T, E>` represents success or failure. `Option<T>` represents a value or `null`; it does not include `undefined`.

The package also exports `Ok`, `Err`, `isOk`, `isErr`, `unwrapOr`, `mapOk`, `isRecord`, and `assertNever`.

## Runtime support

The package is ESM-only. Its committed JavaScript runs in Bun and modern Node.js projects; TypeScript reads the matching source types.

## Development and contributions

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

Report suspected vulnerabilities privately as described in [SECURITY.md](./SECURITY.md).

## License

MIT
