; calculator.asm

section .bss
    first_num_input resb
    second_num_input resb
    operator_input resw

section .data
    input_msg_stnum db "Enter the first Number: "
    input_len_stnum equ $ - input_msg_stnum

    input_msg_ndnum db "Enter the second Number: "
    input_len_ndnum equ $ - input_msg_ndnum

    input_msg_op db "Enter the operation ( +, -, /, * ):"
    input_len_op equ $ - input_msg_op

section .text
global _start

_start:
    mov rax, 1              ; syscall 1 -> sys_write
    mov rdi, 1              ; fd: stdout
    mov rsi, input_msg_stnum
    mov rdx, input_len_stnum
    syscall


    mov rax, 0  ; sys_read
    mov rdi, 0  ; fd: stdin
    mov rsi, first_num_input
    mov rdx, 1
    syscall


    ; clean up

    mov rax, 60 ; exit
    syscall

_add:
    add rdi, rsi
    mov rax, rdi    ; mov rdi into rax <- return register

_sub:
    sub rdi, rsi
    mov rax, rdi

_div:
    div rdi, rsi
    mov rax, rdi

_mul:
    mul rdi, rsi
    mov rax, rdi
