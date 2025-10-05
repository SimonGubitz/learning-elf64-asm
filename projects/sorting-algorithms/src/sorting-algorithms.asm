; sorting-algorithms.asm
%include "src/algorithms/selection-sort.asm"
%include "src/time/get-ticks.asm"

SYS_WRITE   equ 0x1
SYS_READ    equ 0x0
SYS_EXIT    equ 0x3c

STD_OUT     equ 0x1
STD_IN      equ 0x0

arr_len equ 100

section .bss
    itoa_buff resb 32
    time_buff resb 32
    array_access_buff resb 32

section .data
    newln db 0xa
    arr times arr_len dd 0     ; 100 Element @ 4 Byte (int) array -> 32 bit
    ; arr times arr_len dq 0      ; 100 Element @ 8 byte (long long) array -> 64 bit

    elements db "- For 100 Elements: ", 0xa
    elements_len equ $ - elements

    time db "- Time: ", 0x0
    time_len equ $ - time

    total_arr_access db "- Total Array Accesses: ", 0x0
    total_arr_access_len equ $ - total_arr_access


section .text
global _start

_start:
    mov r8, arr
    call _fill_arr_random

    ; capture start in r8
    call _getTickCount64
    mov r8, rax

    mov rax, arr_len
    call _selection_sort

    ; capture end in r8
    call _getTickCount64
    mov r9, rax

    mov rdi, r9
    sub rdi, r8
    mov rsi, time_buff
    mov r8, rdi    ; array accesses
    call _itoa

    mov rsi, array_access_buff
    mov r8, rdi    ; array accesses
    call _itoa

    mov rsi, elements
    mov rdx, elements_len
    call _write

    mov rsi, time
    mov rdx, time_len
    call _write

    mov rsi, time_buff
    mov rdx, rdi
    call _write

    mov rsi, newln
    mov rdx, 1
    call _write

    mov rsi, total_arr_access
    mov rdx, total_arr_access_len
    call _write

    mov rsi, array_access_buff
    mov rdx, rdi
    call _write

    mov rsi, newln
    mov rdx, 1
    call _write
    mov rsi, newln
    mov rdx, 1
    call _write

    jmp _exit


; Clobbers  rcx as the arr counter,
;           rdx as the random number
_fill_arr_random:
    xor rcx, rcx    ; null the garbage out
    xor rdx, rdx
.inc_counter:

    cmp rcx, arr_len
    jz .done

    ; rdrand edx
    ; mov [arr + rcx*4], edx

    inc rcx
    jmp .inc_counter
.done:
    ret


; Needs  r8 = Number
;       rsi = buffer address
; Clobbers  rcx,
;           r8,
;           rdx,
;           rdi = pointer to the digit
; Returns in `itoa_buffer` & rdi = number of bytes written
_itoa:
    xor rdi, rdi       ; buffer index
    mov rcx, 10        ; divisor

.next_digit:
    test r8, r8
    je .reverse_buff   ; jump to reverse after loop

    mov rax, r8
    xor rdx, rdx
    idiv rcx

    add dl, '0'
    mov byte[rsi+rdi], dl

    mov r8, rax
    inc rdi
    jmp .next_digit

.reverse_buff:
    mov rdx, rdi       ; rdx = length of digits
    dec rdx            ; last valid index
    xor r8, r8         ; r8 = start index
.rev_loop:
    cmp r8, rdx
    jge .done_reverse

    mov al, [rsi+r8]
    mov bl, [rsi+rdx]
    mov [rsi+r8], bl
    mov [rsi+rdx], al
    inc r8
    dec rdx
    jmp .rev_loop

.done_reverse:
    ret                ; rdi still contains the number of bytes written

; Needs rsi = address of the string
;       rdx = length of the string
_write:
    mov rax, SYS_WRITE
    mov rdi, STD_OUT
    syscall
    ret

_exit:
    mov rax, SYS_EXIT
    xor rdi, rdi
    syscall