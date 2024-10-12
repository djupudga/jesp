import assert from "node:assert"
import {readdirSync, statSync} from "node:fs"
import { execSync } from "node:child_process"
import {depsClasspath} from "../deps.js"
import path from "node:path"

export async function compile(args, flags) {
  assert(args, "Missing args")
  assert(flags, "Missing flags")
  let [file] = args
  let {output, verbose} = flags
  let classpath = depsClasspath();
  output = output ?? "target"
  if (!file) {
    file = "."
  }
  let files =
    file.endsWith(".java") ?
      [file] :
      findSrcFiles([file])
  let cmd = `javac ${classpath} -d ${output} ${files.join(" ")}`
  if (verbose) {
    console.log(`Compiling ${files.length} files to ${output}/`)
  }
  execSync(cmd, { stdio: "inherit" })
  if (verbose) {
    console.log("Done")
  }
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
    else if (file.endsWith(".java")) {
      files.push(file)
    }
  }
  return files
}
