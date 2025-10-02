; calculator.asm

SYS_WRITE   equ 0x1
SYS_READ    equ 0x0
SYS_EXIT    equ 0x3c

STD_OUT     equ 0x1
STD_IN      equ 0x0


section .bss
    input_buf   resw 1
    output_buf  resw 1
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

    res_output db "The Result is: NNN", 0xa
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

    mov rsi, second_num_prompt
    mov rdx, second_num_prompt_len
    call _write

    mov rsi, input_buf
    mov rdx, 8
    call _read

    mov rdi, input_buf
    call _atoi
    mov [num2], rax


    mov rsi, [num2]
    call _itoa

    mov rsi, rax
    mov rdx, 8
    call _write


    mov rsi, newln
    mov rdx, 1
    call _write

    jmp _exit

_atoi:
    xor rax, rax
.inc_char:
    movzx rsi, byte [rdi]   ; working, because this only affects the FIRST byte at that address, which will be increase below
                            ; and movzx, to fill up the rest of rsi (8 bytes) with zero extend (movZX)
    test rsi, rsi           ; at the zero extend -> finished
    je .success

    cmp rsi, '0'
    jl .error

    cmp rsi, '9'
    jg .error


    sub rsi, '0'
    imul rax, 10
    add rax, rsi


    inc rdi             ; increase the pointer offset?? 0x00000000 -> 0x00000001
    jmp .inc_char
.error:
    mov rax, -1
.success:
    ret

; Needs the number in rsi
; Clobbers rcx, r8, rdx, rdi = pointer to the digit
; Returns in rax
_itoa:
    xor rax, rax
.inc_digit:
    ; mov number to rax
    mov rax, rsi        ; rsi needs to be set first
    mov rcx, 10
    div rcx             ; divide rax by rcx (10)
                        ; the reserve is in rdx

    cmp rdx, 0
    jg .error

    cmp rdx, 9
    jg .error

    ; error hmmmm -> movzx, would destroy the record though -> no because thats "below"
    ; means using ah/al??
    movzx r8, byte[rdi]   ; write the current byte -> char into r8, at the rdi offset

    ; add '0'/48 as to get the ascii code
    add r8, '0'

    inc rdi
    jmp .inc_digit
.error:
    mov rax, -1
.success:
    mov rax, r8
    ret

_write:
    mov rax, SYS_WRITE
    mov rdi, STD_OUT
    syscall
    ret

_read:
    mov rax, SYS_READ
    mov rdi, STD_IN
    syscall
    ret

_exit:
    mov rax, SYS_EXIT
    xor rdi, rdi ; 0 no error
    syscall