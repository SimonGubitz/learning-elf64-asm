; selection-sort.asm

section .bss


section .data


section .text
global _selection_sort

; Needs arr = the .data array
;       rax = length of the array
;
; Clobbers  rcx as the arr counter,
;           rdx as the min
;           rbx as the second counter
;           rsi as the temp/swap value
;           r8d as a temp dereferencing register
;
; Returns   rdi = array accesses
;           arr = sorted in place
_selection_sort:
    xor rcx, rcx
    xor rdx, rdx
    xor rbx, rbx
    xor rdi, rdi
.loop:

    cmp rcx, rax
    je .loop_end

    ; keep in mind that we order 4 byte ints -> 32 bit -> e registers
    mov rbx, rcx        ;   j = i
    mov rdx, rcx        ; min = i
    .inner_loop:
        cmp rbx, rax
        je .inner_loop_end

        mov r8d, dword[arr + rdx*4]
        cmp r8d, dword[arr + rbx*4]
        add rdi, 2
        jge .skip_update_min        ; always skips, but r8d is correct
        mov rdx, rbx    ; min = j
        .skip_update_min:

        inc rbx
        jmp .inner_loop
    .inner_loop_end:


    mov r8d, dword[arr + rcx*4]
    cmp r8d, dword[arr + rdx*4]     ;
    add rdi, 2                      ;
    jg .skip_swap                   ; if ( arr[min] < arr[i] )
    mov esi, dword[arr + rcx*4]
    mov r8d, dword[arr + rdx*4]
    mov dword[arr + rcx*4], r8d
    mov dword[arr + rdx*4], esi
    add rdi, 4
    .skip_swap:

    inc rcx
    jmp .loop

.loop_end:
    ret