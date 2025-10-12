; selection-sort.asm

section .bss


section .data
    skip_msg db "skipping update", 0xa
    skip_msg_len equ $ - skip_msg

    setting_msg db "setting min to: ", 0x0
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
    lea rdi, [rdi + 2]  ; add modified the flags
    jl .update_min
    jmp .skip_update_min
    .update_min:

    mov rdx, rbx        ; min = j

    push rsi    ; temp storage for rdi access counter
    push rcx
    push r8
    push rdi
    push rax
    push rbx

    push rdx
    ; print out the message
    mov rsi, setting_msg
    mov rdx, setting_msg_len
    call _write

    pop rdx
    push rdx
    mov r8, rdx
    mov rsi, itoa_buff
    call _itoa

    mov rsi, itoa_buff
    mov rdx, rdi
    call _write

    mov rsi, newln
    mov rdx, 1
    call _write

    pop rdx

    pop rbx
    pop rax
    pop rdi
    pop r8
    pop rcx
    pop rsi

    jmp .continue

.skip_update_min:
    push rsi
    push rcx
    push r8
    push rdx
    push rdi
    push rax
    push rbx

    mov rsi, skip_msg
    mov rdx, skip_msg_len
    call _write

    pop rbx
    pop rax
    pop rdi
    pop rdx
    pop r8
    pop rcx
    pop rsi
.continue:

    inc rbx
    jmp .inner_loop
.inner_loop_end:


.gdb_breakpoint:
    mov r8d, dword[arr + rcx*4]     ; i
    cmp r8d, dword[arr + rdx*4]     ; min
                                    ; i - min < 0 -> ZF = 1
    lea rdi, [rdi + 2]
    jl .skip_swap                   ; ZF == 0 && SF == OF
                                    ; if ( arr[min] < arr[i] )
    mov esi, dword[arr + rcx*4]
    mov r8d, dword[arr + rdx*4]
    mov dword[arr + rcx*4], r8d
    mov dword[arr + rdx*4], esi
    lea rdi, [rdi + 4]              ; out of uniformity

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