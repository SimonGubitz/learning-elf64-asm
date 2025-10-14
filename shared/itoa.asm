section .text
global _itoa

; Needs  r8 = Decimal Number to be converted
;       rsi = buffer address
;
; Clobbers  rcx,
;           r8,
;           rdx,
;           rdi = pointer to the digit
;           rax / al = rev_loop temp swap regs
;           rbx / bl = rev_loop temp swap regs
; Returns in the buffer specified by rsi & rdi = number of bytes written
_itoa:
    xor rdi, rdi       ; buffer index
    mov rcx, 10        ; divisor

    ; If r8 = 0 then return 0
    cmp r8, 0
    jz .zero_done

.next_digit:
    test r8, r8
    je .reverse_buff   ; jump to reverse after loop

    mov rax, r8
    xor rdx, rdx
    idiv rcx

    add dl, '0'
    mov byte[rsi+rdi], dl

    mov r8, rax
    inc rdi
    jmp .next_digit

.reverse_buff:
    lea rdx, [rdi - 1] ; last valid index
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
.zero_done:
    mov rdi, 0
    mov byte[rsi], '0'
    ret
.done_reverse:
    ret                ; rdi still contains the number of bytes written