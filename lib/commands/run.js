import assert from "node:assert"
import {readFileSync} from "node:fs"
import { execSync } from "node:child_process"
import {parse} from "smol-toml"
import { DEPS_FILE } from "../constants.js"
import path from "node:path"

export async function run(args, flags) {
  assert(args, "Missing args")
  assert(flags, "Missing flags")
  let [file] = args
  let {target} = flags
  let depsFile = path.join(process.cwd(), DEPS_FILE)
  let parsedDeps = parse(readFileSync(depsFile).toString())
  let deps = [
    ...(parsedDeps.devDependency ?? []),
    ...(parsedDeps.runDependency ?? []),
  ]
  let classpath = deps
    .map(dep => path.join("deps", dep.name, dep.version, "*"))
    .join(path.delimiter)
  let cmd = `java -cp ${classpath} ${file}`
  console.log(cmd)
  execSync(cmd, { stdio: "inherit" })
}
