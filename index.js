import meow from "meow"
import { commands } from "./lib/commands.js"

let cli = meow(`
  Usage:
    jesp <command> <library@version> [options]

  Commands:
    add <library@version>  Add a library to the project
    compile <file>         Compile a Java file
    install                Install all dependencies
    remove <library>       Remove a package from the project
    run                    Run the project
  
  Options:
    --dev, -d              Add a dev dependency
    --output, -o           Output directory
    --runtime, -r          Only install runtime dependencies
    --verbose, -v          Verbose
    --target, -t           Directory where compiled classes are found

  Examples:
    Add a runtime dependency:
    jesp add com.google.guava:guava@31.0.1-jre

    Add a development dependency:
    jesp add com.google.guava:guava@31.0.1-jre -d

    Install all dependencies
    jesp install

    Install only runtime dependencies
    jesp install --runtime

    Compile project
    jesp compile src

    Run project
    jesp run yourpackage.MainClass
`, {
  importMeta: import.meta,
  flags: {
    dev: {
      type: "boolean",
      shortFlag: "d"
    },
    output: {
      type: "string",
      shortFlag: "o",
    },
    runtime: {
      type: "boolean",
      shortFlag: "r",
    },
    verbose: {
      type: "boolean",
      shortFlag: "v",
    },
  },
})

let [commandName, ...args] = cli.input
if (!commandName) {
  console.error("No command specified")
  cli.showHelp()
  process.exit(1)
}

let command = commands[commandName]
if (!command) {
  console.error(`Unknown command: ${commandName}`)
  cli.showHelp()
  process.exit(1)
}

try {
  await command(args, cli.flags)
} catch (e) {
  console.error("Aborting due to error:")
  console.error(e)
  process.exit(1)
}

