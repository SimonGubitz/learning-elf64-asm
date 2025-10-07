; calculator.asm

SYS_WRITE   equ 0x1
SYS_READ    equ 0x0
SYS_EXIT    equ 0x3c

STD_OUT     equ 0x1
STD_IN      equ 0x0


section .bss
    itoa_buff   resb 32
    input_buf   resb 32
    output_buf  resb 32
    num1        resq 1
    num2        resq 1

section .data
    newln db 0xa

    inside_calc db "Inside Calc", 0xa
    inside_calc_len equ $ - inside_calc

    first_num_prompt db "Enter the first number: ", 0x0
    first_num_prompt_len equ $ - first_num_prompt

    second_num_prompt db "Enter the second number: ", 0x0
    second_num_prompt_len equ $ - second_num_prompt

    op_prompt db "Enter the operator ( +, -, /, * ):", 0x0
    op_prompt_len equ $ - op_prompt

    res_output db "The Result is: ", 0x0
    res_output_len equ $ - res_output


section .text
global _start

_start:

    ; Read in the first number
    mov rsi, first_num_prompt
    mov rdx, first_num_prompt_len
    call _write

    mov rsi, input_buf
    mov rdx, 8
    call _read

    mov rdi, input_buf
    call _atoi
    mov [num1], rax


    ; Read in the first number
    mov rsi, second_num_prompt
    mov rdx, second_num_prompt_len
    call _write

    mov rsi, input_buf
    mov rdx, 8
    call _read

    mov rdi, input_buf
    call _atoi
    mov [num2], rax

    ; Read in the operator
    mov rsi, op_prompt
    mov rdx, op_prompt_len
    call _write

    mov rsi, input_buf
    mov rdx, 2          ; one byte for the operator and one for the null-terminator
    call _read

    ; Conditional calculation
    cmp byte[input_buf], '+'
    jne .skip_add
    call _add
.skip_add:
    cmp byte[input_buf], '-'
    jne .skip_sub
    call _sub
.skip_sub:
    cmp byte[input_buf], '/'
    jne .skip_div
    call _div
.skip_div:
    cmp byte[input_buf], '*'
    jne .skip_mul
    call _mul
.skip_mul:

    ; Stringify the result
    mov rsi, rax
    call _itoa
    mov r9, rdi             ; rdi get clobbered later, so save in r9

    ; Display the result
    mov rsi, res_output     ; The Result is:
    mov rdx, res_output_len
    call _write

    mov rsi, itoa_buff      ; <result>
    mov rdx, r9             ; the `unclobbered` rdi
    call _write

    mov rsi, newln          ; /n
    mov rdx, 1
    call _write

    jmp _exit

; Needs the address of the string in rdi
; Clobbers rax, rdi
; Returns the int in
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

_add:
    mov rax, [num1]
    add rax, [num2]
    ret

_sub:
    mov rax, [num1]
    sub rax, [num2]
    ret

_mul:
    mov rax, [num1]
    mov rdx, [num2]
    imul rdx
    ret

_div:
    mov rax, [num1]
    mov rdx, [num2]
    idiv rdx
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

    mov byte [input_buf + rax - 1], 0
    ret

_exit:
    mov rax, SYS_EXIT
    xor rdi, rdi ; 0 no error
    syscall