ASM       = nasm
ASMFLAGS  = -f elf64 -g -F dwarf
LD        = ld
LDFLAGS   =

SRC_DIR   = src
SHARED_DIR= ../../shared
BUILD_DIR = build

# All your sources
SRC =  	$(SRC_DIR)/sorting-algorithms.asm \
		$(SRC_DIR)/algorithms/selection-sort.asm \
		$(SRC_DIR)/time/get-ticks.asm \
		$(SHARED_DIR)/write_syscall.asm \
		$(SHARED_DIR)/print_arr.asm \
		$(SHARED_DIR)/itoa.asm

# Convert each source to a build path object file
OBJ = $(patsubst %.asm,$(BUILD_DIR)/%.o,$(SRC))

BIN = $(BUILD_DIR)/sorting-algorithms

.PHONY: all run clean

all: $(BIN)

# Link all .o files
$(BIN): $(OBJ)
	@mkdir -p $(dir $@)
	$(LD) $(LDFLAGS) $^ -o $@

# Assemble .asm → .o
# Uses a flexible pattern that ensures dirs exist before assembling
$(BUILD_DIR)/%.o: %.asm
	@mkdir -p $(dir $@)
	$(ASM) $(ASMFLAGS) $< -o $@

run: all
	./$(BIN)

clean:
	rm -rf $(BUILD_DIR)