ASM = nasm
ASMFLAGS = -f elf64
LD = ld
LDFLAGS =

SRC = src/calculator-example.asm
OBJ = build/calculator-example.o
BIN = build/calculator-example

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