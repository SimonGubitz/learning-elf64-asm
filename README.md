# Learning ELF64 Assembly

## How to run

Run `make` in the root directory to build and start the Docker container, allowing you to work with ELF64 ABI Assembly even on other platforms.

The container will start with the `-it` flag, launching it interactively.
Inside, you can `cd` into any project and run `make` or `make run` to build and execute the program.
Files are automatically updated, as the volume is shared between the emulated system and the host.

## Projects

### Current Projects

- Hello World
- Calculator (incomplete)

### How to create a new project

Run `make new-project <project-name>` to create a new project and set up the corresponding internal Makefile, ready to be used inside the emulated Linux environment.
