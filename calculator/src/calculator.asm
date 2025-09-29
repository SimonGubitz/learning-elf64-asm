; calculator.asm

section .bss
    input_buf   resw 1
    num1        resq 1
    num2        resq 1

section .data
    newln db 0xa

    first_num_prompt db "Enter the first number: ", 0x0
    first_num_prompt_len equ $ - first_num_prompt

    second_num_prompt db "Enter the second number: ", 0x0
    second_num_prompt_len equ $ - second_num_prompt

    op_prompt db "Enter the operator ( +, -, /, * ):", 0x0
    op_prompt_len equ $ - op_prompt

    res_output db "The Result is: NN", 0xa
    res_output_len equ $ - res_output


section .text
global _start

_start:

    mov rsi, first_num_prompt
    mov rdx, first_num_prompt_len
    call _write

    mov rsi, input_buf
    mov rdx, 8
    call _read

    mov rdi, input_buf
    call _atoi
    mov [num1], rax

    ; WARNING: Write does not write literals, but only from memory addresses
    


    mov rsi, newln
    mov rdx, 1
    call _write

    jmp _exit

_atoi:
    xor rax, rax
.inc_char:
    movzx rsi, byte [rdi]   ; working, because this only affects the FIRST byte at that address, which will be increase below
                            ; and movzx, to fill up the rest of rsi (8 bytes) with zero extend (movZX)
    test rsi, register      ; at the zero extend -> finished
    je .success

    cmp rsi, '0'
    jl .error

    cmp rsi, '9'
    jg .error


    sub rsi, '0'
    imul rax, 10
    add rax, rsi


    inc rdi             ; increase the pointer offset??
    jmp .inc_char
.error:
    mov rax, -1
.success:
    ret

_write:
    mov rax, 1
    mov rdi, 1  ; stdout
    syscall
    ret

_read:
    mov rax, 0
    mov rdi, 0
    syscall
    ret

_exit:
    mov rax, 60
    xor rdi, rdi ; 0 no error
    syscall