# Debugging with GDB on Windows

This is a guide on how to run ELF64 compiled files on a windows machine. It mirrors the same system as on docker, but is faster, and more comprehensive for GDB.

With Windows Subsystem for Linux (WSL) debugging with gdb becomes very easy.

1. Verify you have WSL 2
`wsl --version`

2. Verify that you have a Distro installed
`wsl --list --online`

3. If not Ubuntu is a recommended Distro
`wsl --install Ubuntu`

4. Launch Ubuntu
`wsl Ubuntu`

5. Inside WSL install all needed debug tools
`sudo apt-get update` &
`sudo apt-get install -y nasm build-essential gdb strace file bsdmainutils`

6. Navigate to the desired project
`cd projects/<project-name>`

7. Make
`make`

8. And Debug
`gdb -q ./build/<project-name>`
