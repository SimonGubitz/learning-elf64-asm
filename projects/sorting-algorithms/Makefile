ASM = nasm
ASMFLAGS = -f elf64 -g -F dwarf
LD = ld
LDFLAGS =

SRC = src/sorting-algorithms.asm
OBJ = build/sorting-algorithms.o
BIN = build/sorting-algorithms

.PHONY: all run clean

all: $(BIN)

$(OBJ): $(SRC)
	mkdir -p build
	$(ASM) $(ASMFLAGS) $< -o $@

$(BIN): $(OBJ)
	$(LD) $^ -o $@

run: all
	./$(BIN)

clean:
	rm -rf build