; get-ticks.asm
SYS_CLOCK_GETTIME equ 228

section .bss
    ts resq 2   ; struct timespec { long tv_sec; long tv_nsec; }

section .text
global _getTickCount64

_getTickCount64:
    mov     rax, SYS_CLOCK_GETTIME
    mov     rdi, 1              ; CLOCK_MONOTONIC
    lea     rsi, [ts]
    syscall

    ; rax now undefined; ts contains time
    mov     rax, [ts]           ; tv_sec
    mov     rbx, 1000
    mul     rbx                 ; rdx:rax = tv_sec * 1000
                                ; rax = ms from seconds

    mov     r8, rax             ; save ms in r8

    mov     rax, [ts+8]         ; tv_nsec
    mov     rbx, 1000000
    xor     rdx, rdx
    div     rbx                 ; rax = tv_nsec / 1_000_000

    add     rax, r8             ; total = sec_ms + ns_ms
    ret