; selection-sort.asm

section .bss


section .data


section .text
global _selection_sort

; Clobbers  rcx as the arr counter,
;           rbx as the second counter
;           rdx as the min_val
_selection_sort:
    xor rcx, rcx
    xor rdx, rdx
.loop:

    test rcx, rcx
    jz .loop_end


    inc rcx
    jmp .loop

.loop_end:
    ret