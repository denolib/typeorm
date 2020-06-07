/**
 * As of Deno@v1.0.3, dependency analysis has been rewritten in Rust.
 * Due to this, CI has slowed down considerably...
 * This is due to the dynamic imports of a large number of entity files in the test code.
 *
 * As a workaround, We prebuild entity files before running tests.
 *
 * TODO remove this script.
 */

import * as fs from "../vendor/https/deno.land/std/fs/mod.ts";
import * as path from "../vendor/https/deno.land/std/path/mod.ts";
import { getDirnameOfCurrentModule } from "./utils/test-utils.ts";

async function collectEntityFiles(): Promise<string[]> {
  const dirname = getDirnameOfCurrentModule(import.meta);
  const entityDirectories = ["entity", "entities"];
  const files = [] as string[];
  for (const entityDirectory of entityDirectories) {
    const pattern = path.join(dirname, "**", entityDirectory, "*.ts");
    for await (const entry of fs.expandGlob(pattern, { includeDirs: false })) {
      files.push(entry.path);
    }
  }
  return files;
}

function renderSource(entityFiles: string[]): string {
  let source = "";
  for (const entityFile of entityFiles) {
    source += 'import("' + `file://${entityFile}` + '");\n';
  }
  return source;
}

async function generateEntityPrebuilder(): Promise<string> {
  const entityFiles = await collectEntityFiles();
  const source = renderSource(entityFiles);
  return source;
}

if (import.meta.main) {
  console.log(await generateEntityPrebuilder());
}
