import meow from "meow"
import { commands } from "./lib/commands.js"

let cli = meow(`
  Usage:
    jeps <command> <library@version> [options]

  Commands:
    add <library@version>  Add a library to the project
    compile <file>         Compile a Java file
    install                Install all dependencies
    remove <library>       Remove a package from the project
  
  Options:
    --dev, -d              Add a dev dependency
    --output, -o           Output directory
    --runtime, -r          Only install runtime dependencies
    --verbose, -v          Verbose

  Examples:
    Add a runtime dependency:
    jeps add com.google.guava:guava@31.0.1-jre

    Add a development dependency:
    jeps add com.google.guava:guava@31.0.1-jre --d

    Install all dependencies
    jeps install

    Install only runtime dependencies
    jeps install --runtime

    Compile a Java file
    jeps compile src/Main.java
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

