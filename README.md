# JESP

A CLI to help you build and run simple Java projects.

## Installation

```bash
git clone https://github.com/djupudga/jesp.git
cd jesp
npm link
```

## Uninstall
```bash
npm unlink jesp
rm -rf jesp
```

## Usage
```
  Usage:
    jeps <command> <library@version> [options]

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
    jeps add com.google.guava:guava@31.0.1-jre

    Add a development dependency:
    jeps add com.google.guava:guava@31.0.1-jre --d

    Install all dependencies
    jeps install

    Install only runtime dependencies
    jeps install --runtime

    Compile project
    jeps compile src

    Run project
    jeps run com.package.MainClass
```
