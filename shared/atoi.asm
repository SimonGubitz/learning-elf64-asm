section .text
global _atoi

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