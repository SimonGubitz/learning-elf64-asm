; selection-sort.asm

section .bss


section .data
    skip_msg db "skipping update", 0xa
    skip_msg_len equ $ - skip_msg

    setting_msg db "setting min to:", 0x0
    setting_msg_len equ $ - setting_msg

section .text
global _selection_sort

; Needs arr = the .data array
;       rax = length of the array
;
; Clobbers  rcx as the arr counter,
;           rdx as the min
;           rbx as the second counter
;           esi as the temp/swap value
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
        cmp dword[arr + rbx*4], r8d
        ; add rdi, 2
        lea rdi, [rdi + 2]  ; add modified the flags
        jl .update_min
        jmp .skip_update_min
        .update_min:
        mov rdx, rbx        ; min = j

        ; print out the message
        mov rsi, setting_msg
        mov rdx, setting_msg_len
        call _write

        push rsi    ; temp storage for rdi access counter
        push r8     ; temp storage for r8d

        mov r8, rdx
        mov rsi, itoa_buff
        call _itoa

        mov rsi, itoa_buff
        mov rdx, rdi
        call _write

        mov rsi, newln
        mov rdx, 1
        call _write

        pop r8      ; temp storage for r8d
        pop rsi     ; temp storage for rdi access counter

        jmp .continue

        .skip_update_min:
            mov rsi, skip_msg
            mov rdx, skip_msg_len
            call _write
        .continue:

        inc rbx
        jmp .inner_loop
    .inner_loop_end:


    mov r8d, dword[arr + rcx*4]
    cmp r8d, dword[arr + rdx*4]     ;
    lea rdi, [rdi + 2]
    jg .skip_swap                   ; if ( arr[min] < arr[i] )
    mov esi, dword[arr + rcx*4]
    mov r8d, dword[arr + rdx*4]
    mov dword[arr + rcx*4], r8d
    mov dword[arr + rdx*4], esi
    add rdi, 4

    ; print out the message

    ; xor swap
    ; mov esi, dword[arr + rcx*4]
    ; xor r8d, dword[arr + rdx*4]
    ; xor dword[arr + rcx*4], r8d
    ; xor dword[arr + rdx*4], esi

    .skip_swap:

    inc rcx
    jmp .loop

.loop_end:
    ret