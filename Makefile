DOCKER_NAME := asm-elf64
PROJECT := $(word 2, $(MAKECMDGOALS))

new-project:
	mkdir -p projects/$(PROJECT)/src
	cp templates/asm.template projects/$(PROJECT)/src/$(PROJECT).asm
	sed -i.bak "s|REPLACE_THIS|$(PROJECT)|g" projects/$(PROJECT)/src/$(PROJECT).asm && rm projects/$(PROJECT)/src/*.bak
	cp templates/Makefile.template projects/$(PROJECT)/Makefile
	sed -i.bak "s|REPLACE_THIS|$(PROJECT)|g" projects/$(PROJECT)/Makefile && rm projects/$(PROJECT)/*.bak
	cp templates/README.template projects/$(PROJECT)/README.md
	sed -i.bak "s|REPLACE_THIS|$(PROJECT)|g" projects/$(PROJECT)/README.md && rm projects/$(PROJECT)/*.bak


debug:
	

run:
	docker build -t $(DOCKER_NAME) --platform linux/amd64 .
	docker run --rm -it \
		--platform linux/amd64 \
		-v $$(pwd)/projects:/app/projects \
		-w /app/projects/$(PROJECT) \
		$(DOCKER_NAME)