import assert from "node:assert"
import { execSync } from "node:child_process"
import {depsClasspath} from "../deps.js"
import { compile } from "./compile.js"

export async function run(args, flags) {
  assert(args, "Missing args")
  assert(flags, "Missing flags")
  let [file] = args
  let {target} = flags
  file = file ?? "Main"
  target = target ?? "target"
  compile(["."], {...flags, ...{output: target}})
  if (file && file.endsWith(".java")) {
    file = file.substring(0, file.indexOf(".java"))
  }
  let classpath = depsClasspath(target) 
  let cmd = `java ${classpath} ${file}`
  execSync(cmd, { stdio: "inherit" })
}
