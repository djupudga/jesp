import assert from "node:assert"
import { depsSpec, installedDeps } from "../deps.js"
import { downloadJar } from "../download-jar.js"

export async function install(args, flags) {
  assert(args, "Missing args")
  assert(flags, "Missing flags")
  let deps = depsSpec()
  let libs = installedDeps()
  let allDeps = [...deps.runDependency]
  if (!flags.runtime) {
    allDeps = [...allDeps, ...deps.devDependency]
  }
  let missingLibs = intersect(allDeps, libs)

  console.log("Installing dependencies")
  for (let lib of missingLibs) {
    await installJar(lib)
  }
}

async function installJar(jarfile) {
  let [library, version] = jarfile.split("@")
  console.log(`Installing ${jarfile}`)
  return downloadJar(library, version)
}

/**
 * Returns all elements of {b} not present in {a}.
 * @param {Array<string>} Source array 
 * @param {Array<string>} Checked array
 * @returns Intersection of a and b.
 */
function intersect(a, b) {
  assert(a instanceof Array, "a is not an array")
  assert(b instanceof Array, "b is not an array")
  let intersection = []
  let check = {}
  a.forEach(it => check[it] = true)
  for (let it of b) {
    if (!check[it]) intersection.push(it)
  }
  return intersection
}
