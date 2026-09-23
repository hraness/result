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

describe("README facts", () => {
  test("names the installable package", () => {
    expect(readme.startsWith("# @hraness/result\n")).toBe(true);
  });

  test("escapes pipes inside code spans in table rows", () => {
    for (const line of readme.split("\n")) {
      if (!line.startsWith("|")) continue;
      for (const span of line.matchAll(/`[^`]*`/gu)) {
        expect(span[0], `unescaped pipe splits a table cell: ${line}`).not.toMatch(/(?<!\\)\|/u);
      }
    }
  });

  test("uses no em dashes", () => {
    expect(readme).not.toContain("\u2014");
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
