# Debugging with GDB on Mac

## Setup

> (i): This assumes that [Homebrew](https://brew.sh) is already installed.

1. Install QEMU:
To be able to debug on an Apple Silicon Mac, we first need to install QEMU: `brew install qemu`.

2. Run the `setup-mac-debug` target:
Beware that this uses curl to download from `dl-cdn.alpinelinux.org`.

3. Setup the Alpine Linux VM
You should be inside the Alpine VM at this point and be asked for a "localhost login: " the user here is  just `root`.

4. Run `setup-alpine`

5. Follow the steps in the guided installation, this can vary from device to device, BUT at `Which disk(s) would you like to use? (or '?' for help or 'none')` choose `sda`

6. How would you like to use it? -> `sys`

7. WARNING: Erase the above disk(s) and continue? Choose `y`, as this does not apply to your host system.

8. Reboot by `poweroff`

9. Run `make debug` to get in again

10. Install all the needed tools inside: `apk update` &
`apk add nasm build-base gdb strace file gcompat`

11. Mount the directory: `mkdir -p /mnt/host` & `mount -t 9p -o trans=virtio hostshare /mnt/host`

12. Navigate to mnt/home: `cd /mnt/home/`

13. Done

## Debugging

Once the setup is complete, you can `cd projects/<project-name>` and begin debugging as you wish.
