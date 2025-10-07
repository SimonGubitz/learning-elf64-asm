DOCKER_NAME := asm-elf64
FAV_WSL_DISTRO := Ubuntu
PROJECT := $(word 2, $(MAKECMDGOALS))
UNAME_S := $(shell uname -s)	# Linux, Darwin
IS_WINDOWS := $(shell [ "$(OS)" = "Windows_NT" ] && echo yes)

.PHONY: new-project debug

new-project:
	mkdir -p projects/$(PROJECT)/src
	cp templates/asm.template projects/$(PROJECT)/src/$(PROJECT).asm
	sed -i.bak "s|REPLACE_THIS|$(PROJECT)|g" projects/$(PROJECT)/src/$(PROJECT).asm && rm projects/$(PROJECT)/src/*.bak
	cp templates/Makefile.template projects/$(PROJECT)/Makefile
	sed -i.bak "s|REPLACE_THIS|$(PROJECT)|g" projects/$(PROJECT)/Makefile && rm projects/$(PROJECT)/*.bak
	cp templates/README.template projects/$(PROJECT)/README.md
	sed -i.bak "s|REPLACE_THIS|$(PROJECT)|g" projects/$(PROJECT)/README.md && rm projects/$(PROJECT)/*.bak

setup-mac-debug:
	mkdir -p debug

	curl -L https://dl-cdn.alpinelinux.org/alpine/v3.20/releases/x86_64/alpine-standard-3.20.0-x86_64.iso \
	-o ./debug/x86_64-alpine.iso

	qemu-img create -f qcow2 ./debug/x86_64-alpine.qcow2 2G

	qemu-system-x86_64 \
	-m 4G \
	-cpu qemu64 \
	-machine accel=tcg \
	-cdrom ./debug/x86_64-alpine.iso \
	-drive file=./debug/x86_64-alpine.qcow2,format=qcow2 \
	-fsdev local,id=fsdev0,path=$(shell pwd),security_model=none \
	-device virtio-9p-pci,fsdev=fsdev0,mount_tag=hostshare \
	-boot d \
	-nographic



# Mac: use cpu max to be able to run rdrand and similar instructions
debug:
ifeq ($(strip $(UNAME_S)),Darwin)
	qemu-system-x86_64 \
		-m 4G \
		-cpu max \
		-M pc-q35-9.2 \
		-machine accel=tcg \
		-drive file=./debug/x86_64-alpine.qcow2,format=qcow2 \
		-fsdev local,id=fsdev0,path=$(shell pwd),security_model=none \
		-device virtio-9p-pci,fsdev=fsdev0,mount_tag=hostshare \
		-nographic
else
ifeq ($(strip $(UNAME_S)),Linux)
	@echo "Running on native Linux → no emulation needed"
else
ifeq ($(IS_WINDOWS),yes)
	wsl --distribution $(FAV_WSL_DISTRO)
else
	@echo "Unknown OS, cannot run debug"
endif
endif
endif

run:
	docker build -t $(DOCKER_NAME) --platform linux/amd64 .
	docker run --rm -it \
		--platform linux/amd64 \
		-v $$(pwd)/projects:/app/projects \
		-w /app/projects/$(PROJECT) \
		$(DOCKER_NAME)