import assert from "node:assert"
import {
  accessSync,
  constants,
  readFileSync,
  readdirSync,
} from "node:fs"
import { DEPS_FILE, DEPS_DIR } from "./constants.js"
import { parse } from "smol-toml"

/**
 * Retrieves dependencies from deps.toml
 * file if they exist, that is.
 * @return object Dependencies.
 */
export function depsSpec() {
  if (accessSync(DEPS_FILE, constants.F_OK | constants.R_OK)) {
    let parsedDeps = parse(readFileSync(DEPS_FILE).toString())
    assert(parsedDeps, "deps.toml empty")
    return {
      devDependency: parsedDeps.devDependency || [],
      runDependency: parsedDeps.runDependency || [],
    }
  } else {
    console.error("Can't read or find deps.toml")
    process.exit(1)
  }
}

/**
 * Returns a list of installed dependencies.
 * @return Array<string> List of installed dependencies.
 */
export function installedDeps() {
  if (accessSync(DEPS_DIR, constants.F_OK)) {
    const files = readdirSync(DEPS_DIR)   
    return files.map(file => file.endsWith(".jar"))
  }
  return [] 
}
