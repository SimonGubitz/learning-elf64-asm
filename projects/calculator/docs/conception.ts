const buffer: any[] = []; // in .bss


function itoa(number: number): string {

    let res: string = "";
    let exit: boolean = false; // ← simulate the endless jmp back, and only je .success simulates "exit = true"


    let r8: number = number;    // mov r8, rsi
    let rdi: number = 0;        // xor rdi, rdi

    // .reverse_buff:
    const reverse_buff: () => string = () => {
        return buffer
                .map((e) => String.fromCharCode(e))
                .reverse()
                .join(" ");
    };

    // next_digit:
    const rcx: number = 10;         // mov rcx, 10

    const next_digit: () => void = () => {

        if (r8 <= 0) {              // test r8, r8
            res = reverse_buff();  // in asm jmp not call so no ret really needed
            return;
        }

        let   rdx: number = r8 % rcx;
                                        // mov rax, r8
                                        // xor rdx, rdx             ; clear the garbage out
        r8 = Math.floor(r8 / 10);       // idiv rcx                 ; rax = rax / rcx && rdx = rax / rcx

        let dl = rdx + '0'.charCodeAt(0);   // add dl, '0'
        buffer[rdi] = dl;                   // mov byte[buffer+rdi], dl ; the lowest byte of rax(al) how then rdx? -> dl ???

        rdi += 1;                   // inc rdi                  ; increase pointer offset in the buffer

        next_digit();
    }

    next_digit();

    return res
}

const x = itoa(123);
console.log(x, typeof x); // expected: 123, string