# Resources for `Sorting Algorithms`

`src/algorithms/selection-sort.asm` double dereferencing in one line:
[reddit.com/r/learnprogramming/comments/1ax0et5/invalid_combination_of_opcode_and_operands_when/](https://www.reddit.com/r/learnprogramming/comments/1ax0et5/invalid_combination_of_opcode_and_operands_when/)

[stackoverflow.com/questions/37849881/gdb-print-array-or-array-element-with-element-of-various-size](https://stackoverflow.com/questions/37849881/gdb-print-array-or-array-element-with-element-of-various-size)

[stackoverflow.com/questions/35352915/qemu-rdrand-instruction-not-supported](https://stackoverflow.com/questions/35352915/qemu-rdrand-instruction-not-supported)

[felixcloutier.com/x86/rdrand](https://www.felixcloutier.com/x86/rdrand)

[linux.die.net/man/2/mmap](https://linux.die.net/man/2/mmap)

## Finding flags

```bash
    grep -R "MAP_" /usr/include/asm-generic/mman-common.h
    grep -R "PROT_" /usr/include/asm-generic/mman-common.h
    grep -R "SYS_mmap" /usr/include/x86_64-linux-gnu/asm/unistd_64.h
```
