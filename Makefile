DOCKER_NAME := asm-elf64
PROJECT := $(word 2,$(MAKECMDGOALS))

new-project:
	mkdir -p $(PROJECT)/src
	touch $(PROJECT)/src/$(PROJECT).asm
	cp Makefile.template $(PROJECT)/Makefile
	sed -i '' "s|REPLACE_THIS|$(PROJECT)|g" $(PROJECT)/Makefile


run:
	docker build -t $(DOCKER_NAME) .
	docker run -it --platform linux/amd64 -v $$(pwd):/app $(DOCKER_NAME)