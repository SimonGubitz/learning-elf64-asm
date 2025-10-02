# Conceptual Simulation: `_itoa` in TypeScript

This file (`conception.ts`) is a **high-level simulation** of the `_itoa` routine used in `src/calculator.asm`.

It is **not meant to be compiled or run**, but rather to help mentally build a real model on how to implement it in asm.

```TypeScript
const buffer: any[] = []; // in .bss


function itoa(number: number): string {

    let res: string = "";
    let exit: boolean = false; // ← simulate the endless jmp back, and only je .success simulates "exit = true"


    let r8: number = number;    // mov r8, rsi
    let rdi: number = 0;        // xor rdi, rdi

    // .reverse_stack:
    const reverse_stack: () => string = () => {
        return buffer.reverse().join(" ");
    };

    // inc_digit:
    const inc_digit: () => void = () => {

        if (r8 <= 0) {              // test r8, r8
            res = reverse_stack();  // in asm jmp not call so no ret really needed
            return;
        }

        const rcx: number = 10;       // mov rcx, 10
        let   rdx: number = r8 % rcx; // div rcx                ; rax = rax / rcx && rdx = rax / rcx

        let dl = rdx + '0'.charCodeAt(0);   // add dl, '0'
        buffer[rdi] = dl;           // mov byte[buffer+rdi], dl ; the lowest byte of rax(al) how then rdx? -> dl ???
        console.log("adding dl: ", dl);

                                    // mov rax, r8
                                    // xor rdx, rdx             ; clear the garbage out
        r8 = Math.floor(r8 / 10);   // idiv rcx
                                    // mov r8, rax              ; the full quotient no remainder this time

        rdi += 1;                   // inc rdi                  ; increase pointer offset in the buffer

        inc_digit();
    }

    inc_digit();

    return res
}

const x = itoa(123);
console.log(x, typeof x); // expected: 123, string
```