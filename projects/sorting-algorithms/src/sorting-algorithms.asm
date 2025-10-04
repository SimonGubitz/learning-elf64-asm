; sorting-algorithms.asm
%include "src/algorithms/selection-sort.asm"

SYS_WRITE   equ 0x1
SYS_READ    equ 0x0
SYS_EXIT    equ 0x3c

STD_OUT     equ 0x1
STD_IN      equ 0x0

arr_len equ 100

section .bss
    itoa_buff resb 32

section .data
    arr times arr_len dd 0     ; 100 Element @ 4 Byte (int) array


section .text
global _start

_start:
    call _fill_arr_random

    jmp _exit


; Clobbers  rcx as the arr counter,
;           rdx as the random number
_fill_arr_random:
    xor rcx, rcx    ; null the garbage out
    xor rdx, rdx
.inc_counter:

    cmp rcx, arr_len
    jz .done

    rdrand edx
    mov [arr + rcx*4], edx

    mov esi, edx
    call _itoa

    mov rsi, itoa_buff
    mov rdx, rdi
    call _write

    mov rsi, itoa_buff

    inc rcx
    jmp .inc_counter
.done:
    ret


; Needs the number in rsi
; Clobbers rcx, r8, rdx, rdi = pointer to the digit
; Returns in itoa_buffer & rdi = number of bytes written
_itoa:
    xor rdi, rdi       ; buffer index
    mov r8, rsi        ; working number
    mov rcx, 10        ; divisor

.next_digit:
    test r8, r8
    je .reverse_buff   ; jump to reverse after loop

    mov rax, r8
    xor rdx, rdx
    idiv rcx

    add dl, '0'
    mov byte[itoa_buff+rdi], dl

    mov r8, rax
    inc rdi
    jmp .next_digit

.reverse_buff:
    mov rsi, itoa_buff
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

_write:
    mov rax, SYS_WRITE
    mov rdi, STD_OUT
    syscall
    ret

_exit:
    mov rax, SYS_EXIT
    xor rdi, rdi
    syscall