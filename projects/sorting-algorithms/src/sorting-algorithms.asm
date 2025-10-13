; sorting-algorithms.asm
%include "src/algorithms/selection-sort.asm"
%include "src/time/get-ticks.asm"

SYS_WRITE   equ 0x1
SYS_READ    equ 0x0
SYS_EXIT    equ 0x3c

STD_OUT     equ 0x1
STD_IN      equ 0x0

arr_len equ 15000

section .bss
    itoa_buff resb 32
    time_buff resb 32
    elements_buff resb 32
    array_access_buff resb 32

section .data
    newln db 0xa
    arr times arr_len dd 0     ; 100 Element @ 4 Byte (int) array -> 32 bit
    ; arr times arr_len dd 832, 32, 499, 427, 3, 6, 9, 1, 5, 2
    ; arr times arr_len dq 0      ; 100 Element @ 8 byte (long long) array -> 64 bit

    elements db "- For ", 0x0
    elements_len equ $ - elements

    elements_suffix db " Elements:", 0xa
    elements_suffix_len equ $ - elements_suffix

    time db "- Time: ", 0x0
    time_len equ $ - time

    time_suffix db "ms", 0x0
    time_suffix_len equ $ - time_suffix

    total_arr_access db "- Total Array Accesses: ", 0x0
    total_arr_access_len equ $ - total_arr_access

    divider db "----------", 0xa
    divider_len equ $ - divider


section .text
global _start

; Register use: r9  = start time
;               r10 = end time
;               r11 = total time
;               r12 = access counter
;               r13 = time_buff length
;               r14 = arr_access_buff length
;               r15 = elements_buff length
_start:

    ; ;call _fill_arr_random
    ; call _debug_display_arr


    ; mov rax, arr_len
    ; call _selection_sort
    ; call _debug_display_arr

    ; jmp _exit

    ; ; temporary debug blockage

    mov rsi, arr
    call _fill_arr_random

    ; capture start in r9
    call _getTickCount64
    mov r9, rax

    mov rax, arr_len
    call _selection_sort
    mov r12, rdi

    ; capture end in r10
    call _getTickCount64
    mov r10, rax


    ; Display the Benchmark Results
    mov rdi, r10
    sub rdi, r9         ; subtract the end from start to get runtime
    mov r11, rdi

    mov rsi, time_buff
    mov r8, rdi
    call _itoa
    mov r13, rdi

    mov r8, r12                 ; write the array accesses
    mov rsi, array_access_buff  ; into array_access_buff
    call _itoa
    mov r14, rdi

    mov r8, arr_len
    mov rsi, elements_buff
    call _itoa
    mov r15, rdi

    mov rsi, elements
    mov rdx, elements_len
    call _write

    mov rsi, elements_buff
    mov rdx, r15
    call _write

    mov rsi, elements_suffix
    mov rdx, elements_suffix_len
    call _write

    mov rsi, time
    mov rdx, time_len
    call _write

    mov rsi, time_buff
    mov rdx, r13
    call _write

    mov rsi, time_suffix
    mov rdx, time_suffix_len
    call _write

    mov rsi, newln
    mov rdx, 1
    call _write

    mov rsi, total_arr_access
    mov rdx, total_arr_access_len
    call _write

    mov rsi, array_access_buff
    mov rdx, r14
    call _write

    mov rsi, newln
    mov rdx, 1
    call _write
    mov rsi, newln
    mov rdx, 1
    call _write

    jmp _exit


_debug_display_arr:
    push r13
    xor r13, r13
.loop_display:

    cmp r13, arr_len
    jge .loop_display_end

    ; itoa
    mov  r8d, dword[arr + r13*4]
    mov rsi, itoa_buff
    call _itoa

    mov rsi, itoa_buff; rsi = address of the string
    mov rdx, rdi ; rdx = length of the string
    call _write

    mov rsi, newln
    mov rdx, 1
    call _write

    inc r13
    jmp .loop_display
.loop_display_end:
    pop r13
    ret


; Clobbers  rcx as the arr counter,
;           rdx as the random number
_fill_arr_random:
    xor rcx, rcx    ; null the garbage out
    xor rdx, rdx
.inc_counter:

    cmp rcx, arr_len
    jz .done

.rdrand_loop:
    rdrand edx
    jnc .rdrand_loop

    mov [arr + rcx*4], edx

    inc rcx
    jmp .inc_counter
.done:
    ret


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

_exit:
    mov rax, SYS_EXIT
    xor rdi, rdi
    syscall