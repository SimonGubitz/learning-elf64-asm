; get-ticks.asm

SYS_CLOCK_GETTIME equ 228

section .bss
    ts resq 2

section .text
global _getTickCount64

_getTickCount64:
    mov rax, SYS_CLOCK_GETTIME
    mov rdi, 1
    mov rsi, [ts]

    syscall

    ; convert to milliseconds: tv_sec*1000 + tv_nsec/1000000
    mov rax, [ts]       ; tv_sec
    mov rbx, 1000
    mul rbx             ; seconds -> milliseconds
    mov rdx, [ts+8]     ; tv_nsec
    mov rcx, 1000000
    div rcx             ; nanoseconds -> milliseconds
    add rax, rdx        ; total milliseconds in RAX
    ret