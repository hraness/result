# Contributing

Issues and focused pull requests are welcome in the public repository.

Open an issue before starting a broad API or compatibility change so the design can be agreed first. Maintainers review pull requests for focused scope, runtime portability, narrowing behavior, tests, and documentation.

Run the local checks before opening a pull request:

```sh
bun install
bun run check
```

Keep API changes small and include readable example tests. Add a property test when the change introduces an algebraic law, parser, round trip, or invariant over arbitrary input.

## Releases

The supported distribution path is a versioned GitHub Release. A `v*` tag starts
the release workflow, and the workflow publishes only when all of these
conditions hold:

- The tag is exactly `v<package.json version>` and uses a stable semantic version.
- The tagged commit is reachable from `main`, and the version is newer than every existing stable tag.
- `bun run check` passes with Bun 1.3.14.
- Rebuilding does not change committed `dist/index.js` or `bun.lock`.
- The packed package imports in Node.js and passes the package smoke contract.

The publisher then creates the matching immutable GitHub Release and verifies
that GitHub reports it as the latest stable release.

## npm

After the GitHub Release, the release workflow's `npm` job publishes the
tagged commit to npm as `@hraness/result` with a provenance attestation. It uses npm
trusted publishing, so GitHub Actions proves the workflow's identity to npm
and no npm token is stored anywhere. No one needs to approve a release. The
job skips a version that npm already has.

npm only accepts trusted publishing for a package that already exists, so the
job warns and skips until a maintainer does this once:

1. From a clean checkout of the newest `v*` tag, which the release workflow
   has already checked, publish the first version by hand:
   `npm publish --access public --ignore-scripts`.
2. Let this workflow publish from now on:
   `npm trust github @hraness/result --repo hraness/result --file release.yml --allow-publish --yes`
   (npm 11.16 or newer).
3. In the package settings on npmjs.com, require two-factor authentication and
   disallow tokens.
