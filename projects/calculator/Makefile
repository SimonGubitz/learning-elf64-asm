ASM = nasm
ASMFLAGS = -f elf64 -g -F dwarf
LD = ld
LDFLAGS =

SRC = src/calculator.asm
OBJ = build/calculator.o
BIN = build/calculator

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