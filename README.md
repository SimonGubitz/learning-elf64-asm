# Learning ELF64 Assembly

> This repo targets ELF64, the 64-bit Linux executable format, with x86-64 assembly.

## How to run

Run `make run` in the root directory to build and start the Docker container, allowing you to work with ELF64 ABI Assembly even on other platforms.
This places you in the projects directory inside the container, if you want to run a project directly, you can run `make run <project-name>` and get placed in that projects folder in the container.

The container will start with the `-it` flag, launching it interactively.
Inside, you can `cd` into any project and run `make` or `make run` to build and execute the program.
Files are automatically updated, as the volume is shared between the emulated system and the host.

## How to debug

Generally its easy to debug any project. Use the `make debug <project-name>` target to start directly in debug mode.
For easy debugging there is a preconfigured `gdbcmds.gdb` which includes a preconfigured breakpoint, thus you only need to copy `gdb_breakpoint` onto the desired breakpoint, and run gdb with `gdb -x debug/gdbcmds.gdb -q ./build/<file>`.
Furthermore, when debugging there is no need to run `make` before gdb, as the config does that itself.

### Linux

The most straightforward, in here GDB obviously works natively.

### Crossplatform

Crossplatform debugging is harder, depending on the system architecture of the host machine. On Apple Silicon Macs, debugging does not work inside the Docker Container due to QEMU emulation, not allowing ptrace or strace calls.

- On **Windows** running the project in WSL on a linux disto works fine. [See more](./docs/gdb-windows.md)
- On **Mac** using [QEMU](https://www.qemu.org/) full system emulation, which gives more optionality than what Docker uses is the only real choice to actually get access to the registers. [See more](./docs/gdb-mac.md)

## Projects

### Current Projects

- [Hello World](./projects/hello/)
- [Calculator](./projects/calculator/)
- [Sorting Algorithms (WIP)](./projects/sorting-algorithms/)

### How to create a new project

Run `make new-project <project-name>` to create a new project and set up the corresponding internal Makefile, ready to be used inside the emulated Linux environment.
