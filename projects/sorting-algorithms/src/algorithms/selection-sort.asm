; selection-sort.asm

section .bss


section .data


section .text
global _selection_sort

; Clobbers  rcx as the arr counter,
;           rdx as the min_val
;           rbx as the second counter
;           rsi as the temp/swap value
_selection_sort:
    xor rcx, rcx
    xor rdx, rdx
.loop:

    test rcx, rcx
    jz .loop_end

    ; keep in mind that we order 4 byte ints -> 32 bit -> e registers


    inc rcx
    jmp .loop

.loop_end:
    ret