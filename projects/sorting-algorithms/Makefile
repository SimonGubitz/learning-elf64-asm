ASM       = nasm
ASMFLAGS  = -f elf64 -g -F dwarf
LD        = ld
LDFLAGS   =

SRC_DIR   = src
SHARED_DIR= ../../shared
BUILD_DIR = build

PROJECT_SRC =  	$(SRC_DIR)/sorting-algorithms.asm \
				$(SRC_DIR)/algorithms/selection-sort.asm \
				$(SRC_DIR)/time/get-ticks.asm

SHARED_SRC = 	$(SHARED_DIR)/write_syscall.asm \
			 	$(SHARED_DIR)/print_arr.asm \
			 	$(SHARED_DIR)/itoa.asm

PROJECT_OBS = $(PROJECT_SRC:$(SRC_DIR)/%.asm=$(BUILD_DIR)/%.o)
SHARED_OBS  = $(SHARED_SRC:$(SHARED_DIR)/%.asm=$(BUILD_DIR)/shared/%.o)
OBS = $(PROJECT_OBS) $(SHARED_OBS)

BIN = $(BUILD_DIR)/sorting-algorithms

.PHONY: all run clean

all: $(BIN)

$(BIN): $(OBS) 
	$(LD) $(LDFLAGS) $(OBS) -o $@

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.asm
	@echo "Building $@"
	mkdir -p $(dir $@)
	$(ASM) $(ASMFLAGS) -o $@ $< 

$(BUILD_DIR)/shared/%.o: $(SHARED_DIR)/%.asm
	@echo "Building $(dir $@)/$@"
	mkdir -p $(dir $@)
	$(ASM) $(ASMFLAGS) -o $@ $<

run: all
	./$(BIN)

clean:
	rm -rf $(BUILD_DIR)
