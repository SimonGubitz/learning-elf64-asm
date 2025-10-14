extern _write
extern _write_newln
extern _itoa

section .text
global _print_arr

; Needs rax = add of the array
;       rdi = length of the array
;       rsi = address of the string
;       rdx = length of the string
; Clobbers  rcx, r8, rdx, rdi, rax, rbx = all from _itoa
_print_arr:
    push r13        ; rsp % 16 =
    xor r13, r13
.loop_display:

    cmp r13, rdi
    jge .loop_display_end

    ; itoa
    mov  r8d, dword[rax + r13*4]
    push rax
    push rsi
    push r13

    call _itoa

    pop r13
    pop rsi
    pop rax
    call _write
    call _write_newln

    inc r13
    jmp .loop_display
.loop_display_end:
    pop r13
    ret