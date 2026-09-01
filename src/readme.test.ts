import { existsSync, readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { isRecord } from "./index";

const repositoryRoot = new URL("../", import.meta.url);
const readme = readFileSync(new URL("README.md", repositoryRoot), "utf8");
const packageManifest: unknown = JSON.parse(
  readFileSync(new URL("package.json", repositoryRoot), "utf8"),
);
if (!isRecord(packageManifest) || typeof packageManifest.version !== "string") {
  throw new Error("package.json must contain a string version");
}
const packageVersion = packageManifest.version;

describe("README product contract", () => {
  test("leads from outcome through proof, boundaries, and provenance", () => {
    const landmarks = [
      "Represent recoverable failure as typed data and plain absence as `null`.",
      "## Install an immutable release",
      "## Return one of two valid states",
      "## Keep failure handling exhaustive",
      "## Preserve inference through the branch",
      "## API map",
      "## Package and compatibility facts",
      "## Choose the smallest failure model that fits",
      "## Verify release provenance",
    ];

    let previous = -1;
    for (const landmark of landmarks) {
      const current = readme.indexOf(landmark);
      expect(current, `missing README landmark: ${landmark}`).toBeGreaterThan(previous);
      previous = current;
    }
  });

  test("keeps the install, examples, and API map aligned with the package", () => {
    expect(readme).toContain(
      `"@hraness/result": "github:hraness/result#v${packageVersion}"`,
    );
    expect(readme).toContain("function parsePort(input: Option<string>): Result<number, PortError>");
    expect(readme).toContain("return assertNever(error);");
    expect(readme).toContain("const label = mapOk(parsed, (port) => `:${port}`);");

    for (const name of [
      "Result<T, E = Error>",
      "Ok<T>",
      "Err<E>",
      "Option<T>",
      "ok(value)",
      "err(error)",
      "isOk(result)",
      "isErr(result)",
      "mapOk(result, transform)",
      "unwrapOr(result, fallback)",
      "isRecord(value)",
      "assertNever(value)",
    ]) {
      expect(readme, `missing API map entry: ${name}`).toContain(`| \`${name}\``);
    }
  });

  test("keeps Markdown fences balanced and local links resolvable", () => {
    const fenceCount = readme.match(/^```/gmu)?.length ?? 0;
    expect(fenceCount).toBeGreaterThan(0);
    expect(fenceCount % 2).toBe(0);

    for (const match of readme.matchAll(/\[[^\]]+\]\((\.\/[^)#]+)(?:#[^)]+)?\)/gu)) {
      const relativePath = match[1];
      expect(relativePath).toBeDefined();
      expect(
        existsSync(new URL(relativePath ?? "", repositoryRoot)),
        `missing README link target: ${relativePath}`,
      ).toBe(true);
    }
  });
});
