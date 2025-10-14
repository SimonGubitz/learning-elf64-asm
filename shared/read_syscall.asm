SYS_READ    equ 0x0
STD_IN      equ 0x0

; Needs rsi = address of the output buffer
_read:
    push rsi

    mov rax, SYS_READ
    mov rdi, STD_IN
    syscall

    pop rsi

    mov byte [rsi + rax - 1], 0
    ret