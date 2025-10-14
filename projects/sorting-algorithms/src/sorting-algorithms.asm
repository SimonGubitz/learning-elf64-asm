; sorting-algorithms.asm
extern _selection_sort
extern _getTickCount64
extern _write
extern _write_newln
extern _print_arr
extern _itoa

SYS_EXIT equ 0x3c

arr_len equ 500

section .bss
    itoa_buff resb 32
    time_buff resb 32
    elements_buff resb 32
    array_access_buff resb 32

section .data
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
    ; call _print_arr

    ; jmp _exit

    ; ; temporary debug blockage

    mov rsi, arr
    call _fill_arr_random

    ; capture start in r9
    call _getTickCount64
    mov r9, rax

    push r9
    mov r9, arr         ; temp disassociation of r9
    mov rax, arr_len
    call _selection_sort
    mov r12, rdi

    pop r9              ; restore r9

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
    call _write_newln

    mov rsi, total_arr_access
    mov rdx, total_arr_access_len
    call _write

    mov rsi, array_access_buff
    mov rdx, r14
    call _write

    call _write_newln
    call _write_newln

    jmp _exit




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


_exit:
    mov rax, SYS_EXIT
    xor rdi, rdi
    syscall