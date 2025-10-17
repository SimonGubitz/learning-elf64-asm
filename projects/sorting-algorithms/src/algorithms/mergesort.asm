; mergesort.asm

SYS_MMAP    equ  9
SYS_MUNMAP  equ 11

MAP_SHARED          equ 0x01
MAP_PRIVATE         equ 0x02
MAP_TYPE            equ 0x0f            ; /* Mask for type of mapping */
MAP_FIXED           equ 0x10            ; /* Interpret addr exactly */
MAP_ANONYMOUS       equ 0x20            ; /* don't use a file */
MAP_POPULATE        equ 0x008000        ; /* populate (prefault) pagetables */
MAP_NONBLOCK        equ 0x010000        ; /* do not block on IO */
MAP_STACK           equ 0x020000        ; /* give out an address that is best suited for process/thread stacks */
MAP_HUGETLB         equ 0x040000        ; /* create a huge page mapping */
MAP_SYNC            equ 0x080000        ; /* perform synchronous page faults for the mapping */
MAP_FIXED_NOREPLACE equ 0x100000        ; /* MAP_FIXED which doesn't unmap underlying mapping */
MAP_UNINITIALIZED   equ 0x4000000       ; /* For anonymous mmap, memory could be uninitialized */
MAP_FILE            equ 0

PROT_READ           equ 0x1             ; /* page can be read */
PROT_WRITE          equ 0x2             ; /* page can be written */
PROT_EXEC           equ 0x4             ; /* page can be executed */
PROT_SEM            equ 0x8             ; /* page may be used for atomic ops */
PROT_NONE           equ 0x0             ; /* page can not be accessed */
PROT_GROWSDOWN      equ 0x01000000      ; /* mprotect flag: extend change to start of growsdown vma */
PROT_GROWSUP        equ 0x02000000      ; /* mprotect flag: extend change to end of growsup vma */

section .bss


section .data

section .text
global _mergesort

; Clobbers  r12 = length / size of everything
;           r8  = left arr start
;           r9  = right arr start
;           rcx = counter / index of the array
_mergesort:
    xor rcx, rcx

.recursion:
    ; return with the length and the address of the sorted arr
    ; in this case return length will always be one
    cmp r12, 1
    mov rax, addr
    mov rdi, len
    je .recursion_finished


    ; reserve more memory (left & right together equals the current length)
    ; https://linux.die.net/man/2/mmap
    mov rax, SYS_MMAP
    mov rdi, addr           ; address
    lea rsi, len            ; length
    mov rdx, PROT_WRITE     ; prot
    mov r10, MAP_PRIVATE
    or  r10, MAP_ANONYMOUS  ; flags
    mov r8, -1              ; fd
    mov r9, 0               ; offset
    syscall

    push addr
    push len

.split_arrs:
    mov rcx, 2
    imul addr
    push len
    idiv len            ; truncated -> floor -> right >= left
    mov middle, len
    pop len
    mov middle, len
    add len, middle

    xor rcx
.split_arr_loop:
    cmp rcx, len
    je .split_arr_finished
.left_split:
.right_split:
.skip_split:


    inc rcx
    jmp .split_arr_loop


.merge:
    pop addr, rdi
.merge_iteration:
    ; Release unused memory again
    ; https://linux.die.net/man/2/munmap
    mov rax,
    mov rdi,                ; address
    lea rsi,                ; length
    mov rdx,                ; prot
    mov r10,
    or  r10,                ; flags
    mov r8,                 ; fd
    mov r9,                 ; offset
    syscall

.iteration_finished:
    ; TODO
.recursion_finished:
    ; ? pop addr
    ; ? pop len
    ret