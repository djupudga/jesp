import assert from "node:assert"
import fs from "fs"
import { DEPS_FILE } from "../constants.js"
import { downloadJar } from "../download-jar.js"
import { parse, stringify } from "smol-toml"

/**
 * Add a library to the project
 * @param {Array<string>} args - The library to add, in the format `library@version`
 * @param {object} flags - Flags for the command
 * @returns {Promise<void>}
 */
export async function add(args, flags) {
  assert(args, "Missing args")
  assert(flags, "Missing flags")
  let [versionedLibrary] = args
  let { dev } = flags
  let [library, version] = versionedLibrary.split("@")
  let parsedDeps = parse(fs.readFileSync(DEPS_FILE).toString())
  let deps = [
    ...(parsedDeps.devDependency ?? []),
    ...(parsedDeps.runDependency ?? []),
  ]
  let match = deps.find((dep) => dep.name == library)
  if (match) {
    console.log("Already added")
    console.log("Run `deps install` to reinstall missing dependencies")
    console.log(`or run \`deps upgrade ${versionedLibrary}\``)
    console.log("to upgrade to another version")
    process.exit(1)
  }
  console.log("Installing..")
  try {
    await downloadJar(library, version)
  } catch (e) {
    // If the file already exists we just continue
    if (e.code != "EEXIST") {
      throw e
    }
  }
  let dependency = {
    name: library,
    version: version,
  }
  let key = dev ? "devDependency" : "runDependency"
  let depList = parsedDeps[key] ?? []
  depList.push(dependency)
  parsedDeps[key] = depList
  fs.writeFileSync(DEPS_FILE, stringify(parsedDeps))
}
