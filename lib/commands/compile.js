import assert from "node:assert"
import {readdirSync, readFileSync, statSync} from "node:fs"
import { execSync } from "node:child_process"
import {parse} from "smol-toml"
import { DEPS_FILE } from "../constants.js"
import {depsToJar} from "../deps.js"
import path from "node:path"

export async function compile(args, flags) {
  assert(args, "Missing args")
  assert(flags, "Missing flags")
  let [file] = args
  let {output} = flags
  let depsFile = path.join(process.cwd(), DEPS_FILE)
  let parsedDeps = parse(readFileSync(depsFile).toString())
  let deps = [
    ...(parsedDeps.devDependency ?? []),
    ...(parsedDeps.runDependency ?? []),
  ]
  let classpath = deps
    .map(dep => path.join("deps", depsToJar(dep)))
    .join(path.delimiter)
  output = output ?? "target"
  let files =
    file.endsWith(".java") ?
      [file] :
      findSrcFiles([path.join(process.cwd(), file)])
  let cmd = `javac -cp ${classpath} -d ${output} ${files.join(" ")}`
  console.log(`Compiling ${files.length} files to ${output}/`)
  execSync(cmd, { stdio: "inherit" })
  console.log("Done")
}


function findSrcFiles(src) {
  let files = []
  for (let file of src) {
    let stat = statSync(file)
    if (stat.isDirectory()) {
      let filesInDir = 
        readdirSync(file)
          .map(f => path.join(file, f))
      files = files.concat(findSrcFiles(filesInDir))
    }
    else {
      files.push(file)
    }
  }
  return files
}
