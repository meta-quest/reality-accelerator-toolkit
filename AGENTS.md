# Agent Instructions — Reality Accelerator Toolkit (RATK)

TypeScript WebXR utilities library that bridges low-level WebXR mixed-reality APIs (planes, meshes, anchors, hit tests) to three.js `Object3D` instances.

## Source-of-truth files (read these first, do not duplicate their contents in this file)

For setup, build steps, SDK versions, and project layout, read:

- `README.md` — official setup and instructions
- `package.json` — Node / npm dependencies, peer dependencies, build scripts
- `tsconfig.json` — TypeScript configuration
- `rollup.config.js` — bundler configuration
- `LICENSE.md` — license terms

## Quest / Horizon-specific notes

- This is a publishable library (`ratk` on npm), not a runnable Quest APK — there is no `AndroidManifest.xml` and no app to deploy. The Quest target is reached indirectly via Quest Browser running a WebXR page that consumes the library.
- `three.js` is a **peer dependency**, not bundled — the consuming app must supply it. Do not move it to `dependencies`.
- The `example/` directory contains a runnable demo (hosted via the GitHub Pages site referenced in the README) that exercises planes, meshes, anchors, and hit-testing — it is the most useful end-to-end reference when changing toolkit behavior.
- The WebXR session must request the relevant features (`hit-test`, `plane-detection`, `mesh-detection`, `anchors`) at session-init time or the corresponding RATK code paths stay empty.

## Meta Quest tooling

This repository is part of the Meta Quest / Horizon OS ecosystem (a sample, library, template, or related project — the bespoke intro above describes which). Use that intro and the source-of-truth files it references for project-specific decisions; don't restate or invent facts from memory.

When the user asks anything about Quest device behavior, build / deploy / debug / capture flows, on-device performance, or Horizon OS APIs, reach for these tools instead of generic WebXR answers:

- **`hzdb`** — Quest-aware ADB wrapper (device list, install / launch / stop, logs, screenshots, Perfetto traces, on-device docs search). Already wired up as an MCP server via `.mcp.json`, `.vscode/mcp.json`, and `.cursor/mcp.json`. Also runnable directly: `npx -y @meta-quest/hzdb <subcommand>`.
- **Meta Quest Agentic Tools** — the full skill set, including WebXR-specific skills: [github.com/meta-quest/agentic-tools](https://github.com/meta-quest/agentic-tools). Install per your client (Claude Code: `/plugin install meta-vr@meta-quest`; Gemini CLI: `gemini extensions install https://github.com/meta-quest/agentic-tools`; Cursor / VS Code: install the **Meta Horizon** extension from the Marketplace).

A few behavior expectations:

- **Read this repo's files first.** Before answering anything project-specific, read `README.md` and whichever source-of-truth files the intro above points at. Don't restate their contents in chat — quote or link instead.
- **Use `hzdb` for device-side work.** Anything that touches an attached Quest (install, launch, logs, screenshot, capture, manifest inspection) goes through `hzdb`, not raw `adb`.
- **Check live Horizon OS docs before answering API questions.** `hzdb docs search "..."` queries the live docs; training data on Horizon OS APIs goes stale fast.
- **Don't fabricate SDK / engine versions.** If a version isn't visible in this repo's files, say so rather than guessing.
