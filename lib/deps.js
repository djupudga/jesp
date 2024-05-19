import assert from "node:assert"
import {
  accessSync,
  constants,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs"
import { DEPS_FILE, DEPS_DIR } from "./constants.js"
import path from "node:path"
import { parse } from "smol-toml"

/**
 * Ensures that a deps.toml file exists.
 * @param {string} file - The file to ensure exists.
 */
export function ensureDepsFileExists() {
  let file = path.join(process.cwd(), DEPS_FILE)
  try {
    accessSync(file, constants.F_OK)
  } catch (e) {
    console.log("Creating deps.toml")
    writeFileSync(file, "")
  }
}

/**
 * Retrieves dependencies from deps.toml
 * file if they exist, that is.
 * @return object Dependencies.
 */
export function depsSpec() {
  let depsFilePath = path.join(process.cwd(), DEPS_FILE)
  console.log(`Reading ${depsFilePath}`)
  try { 
    accessSync(depsFilePath, constants.F_OK | constants.R_OK)
    let parsedDeps = parse(readFileSync(depsFilePath).toString())
    assert(parsedDeps, "deps.toml empty")
    return {
      devDependency: parsedDeps.devDependency || [],
      runDependency: parsedDeps.runDependency || [],
    }
  } catch (e){
    console.error("Can't read or find deps.toml")
    process.exit(1)
  }
}

/**
 * Returns a list of installed dependencies.
 * @return Array<string> List of installed dependencies.
 */
export function installedDeps() {
  let depsDir = path.join(process.cwd(), DEPS_DIR)
  try {
    accessSync(depsDir, constants.F_OK)
    const files = readdirSync(depsDir)
    return files.map(file => file.endsWith(".jar") ? file : undefined)
  } catch (e) {
    return []
  }
}

/**
 * Converts a library to a versioned library.
 * @param {object} lib - The library to convert.
 * @returns {string} The versioned library.
 */
export function toVersionedLib(lib) {
  return `${lib.name}@${lib.version}`
}

/**
 * Resolves a versioned library to a jar file.
 * @param {string} versionedLib - The versioned library to resolve.
 * @returns {string} The resolved jar file.
 */ 
export function resolveToJar(versionedLib) {
  let [_, artifactAndVersion] = versionedLib.split(":")
  let [library, version] = artifactAndVersion.split("@")
  return `${library}-${version}.jar`
}

export const depsToJar = (dep) => resolveToJar(toVersionedLib(dep))


