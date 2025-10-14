SYS_WRITE   equ 0x1
STD_OUT     equ 0x1

section .data
    newln db 0xa

section .text
global _write
global _write_newln

; Needs rsi = address of the string
;       rdx = length of the string
;
; Clobbers  rax,
;           rdi
_write:
    mov rax, SYS_WRITE
    mov rdi, STD_OUT
    syscall
    ret

_write_newln:
    mov rsi, newln
    mov rdx, 1
    call _write
    ret