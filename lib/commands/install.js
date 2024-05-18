import assert from "node:assert"
import {
  depsSpec,
  installedDeps,
  toVersionedLib,
  resolveToJar,
} from "../deps.js"
import { downloadJar } from "../download-jar.js"

export async function install(args, flags) {
  assert(args, "Missing args")
  assert(flags, "Missing flags")
  let deps = depsSpec()
  let libs = installedDeps()
  let allDeps = [...deps.runDependency.map(toVersionedLib)]
  if (!flags.runtime) {
    allDeps = [...allDeps, ...deps.devDependency.map(toVersionedLib)]
  }
  let missingLibs = intersect(libs, allDeps)

  if (missingLibs.length == 0) {
    console.log("Nothing to do. All dependencies are installed")
    return
  }
  console.log("Installing dependencies")
  for (let lib of missingLibs) {
    await installJar(lib)
  }
  console.log("Done")
}

/**
 * Installs a jar file.
 * @param {string} jarfile - The jar file to install.
 * @returns {Promise<void>}
 */
async function installJar(jarfile) {
  let [library, version] = jarfile.split("@")
  console.log(`Installing ${jarfile}`)
  return await downloadJar(library, version)
}

/**
 * Returns all elements of {b} not present in {a}.
 * @param {Array<string>} fileList Source array 
 * @param {Array<string>} versionedLibs Checked array
 * @returns Intersection of a and b.
 */
function intersect(fileList, versionedLibs) {
  assert(fileList instanceof Array, "a is not an array")
  assert(versionedLibs instanceof Array, "b is not an array")
  let intersection = []
  let check = {}
  fileList.forEach(it => check[it] = true)
  for (let it of versionedLibs) {
    let resolved = resolveToJar(it)
    console.log(`Resolved ${it} to ${resolved}`)
    if (!check[resolved]) {
      console.log(`Adding ${it} to download list`)
      intersection.push(it)
    } else {
      console.log(`Skipping ${it} as it's already installed`)
    }
  }
  return intersection
}

