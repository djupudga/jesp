import meow from "meow"
import { commands } from "./lib/commands.js"

let cli = meow(`
  Usage:
    jeps <command> <library@version> [options]

  Commands:
    add <library@version>  Add a library to the project
    remove <library>       Remove a package from the project
    install                Install all dependencies
  
  Options:
    --verbose, -v          Verbose
    --dev, -d              Add a dev dependency
    --runtime, -r          Only install runtime dependencies

  Examples:
    Add a runtime dependency:
    jeps add com.google.guava:guava@31.0.1-jre

    Add a development dependency:
    jeps add com.google.guava:guava@31.0.1-jre --d

    Install all dependencies
    jeps install

    Install only runtime dependencies
    jeps install --runtime
`, {
  importMeta: import.meta,
  flags: {
    verbose: {
      type: "boolean",
      shortFlag: "v",
    },
    dev: {
      type: "boolean",
      shortFlag: "d"
    },
    runtime: {
      type: "boolean",
      shortFlag: "r",
    }
  },
})

let [commandName, ...args] = cli.input

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

