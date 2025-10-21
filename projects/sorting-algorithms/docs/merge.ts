type memory_address = number;

/**
 * hold the address of the new memory block
 */
let rax: memory_address;

/**
 * length of the array
 */
let rdx: number;

/**
 * temp idiv register
 */
let rcx: number;

/**
 * address of the array
 */
let rsi: memory_address;

/**
 * compare length register
 */
let rbx: number;

/**
 *
 */
let rsp: number;

/**
 * current memory address
 */
let rdi: number;

/**
 * temporary stash for previous array length
 */
let r8: number;

/**
 *
 */
let rbp: number;

/**
 *
 */
let r10: number;

/**
 *
 */
let r9: number;

/**
 *
 */
let r12: number;

/**
 *
 */
let r11: number;

/**
 *
 */
let r14: number;

/**
 *
 */
let r13: number;

/**
 *
 */
let r15: number;


const stack: any = [];
// allow double the size, as O(n) + O(n) auxilliary space complexity in mergesort
const arr_buff = new ArrayBuffer(4 * 5, { maxByteLength: 2 * 4 * 5 });
const arr = new Int32Array(arr_buff);  // 32 bit (4 byte) integer array -> although less a real array but the memory structure

// just put it behind the array
const mmap = (options: {
    addr?: number
    length: number
    prot?: string[]
    flags?: string[]
    fd?: number
    offset?: number
}) => {
    const current_bytes = arr_buff.byteLength;
    arr_buff.resize(current_bytes + options.length);
    console.log(`Increase buffer size from ${current_bytes}b to ${arr_buff.byteLength}b.`)
    console.log(`Increase buffer size from ${current_bytes / 4} elements to ${arr_buff.byteLength / 4} elements.\n`)
    return current_bytes;
};
const munmap: () => number = () => {
    // rdx was poped before
    const current_bytes = arr_buff.byteLength;
    arr_buff.resize( rdx * 4 );
    console.log(`Increase buffer size from ${current_bytes}b to ${arr_buff.byteLength}b.`)
    console.log(`Increase buffer size from ${current_bytes / 4} elements to ${arr_buff.byteLength / 4} elements.\n`)
    return rdx;
};

// debug simple 5 to 1
const fillArr = () => {
    for (let i = rdx; i > 0; i--) {
        arr[rdx - i] = i;
    }
}

function mergesort_asm() {

    const init: () => void = () => {
        // reserve more space
        rax = mmap({length: 4 * rdx});      // mmap returns the address of the new space in rax
        rax /= 4;                           // to map this back into the style of element index instead of byte memory location TS/ASM Difference
    };

    init();

    /**
     * The main sorting function, seperated due to idiomatics
     * Assembly idiomatic mergesort
     * @param rsi in this case the index in the array, in assembly the real address
     * @param rdx the elements in the array, in assembly the 1/4 offset in the memory due to 4 byte sized int elements
     */
    const _mergesort: () => void = () => {
        console.log('\nin mergesort with addr:', rsi, 'and length:', rdx);
        console.log(arr.subarray(rsi, rdx));

        rbx = rdx;      // mov rbx, rdx
        rbx -= rsi;     // sub rbx, rsi
        console.log(`rbx: ${rbx}`);
        if (rbx <= 1) {         // cmp rbx 1, jle .return jmp, .skip
            console.log('\nreturning, due to rbx being: ' + rbx + '\n');
            //.return:


            return;             // ret
        }
        // .skip:

        // push the start and length
        stack.push(rsi);        // push rsi
        stack.push(rdx);        // push rdx
        // TODO increase the recursion depth here
        // to have the correct start and length in the right side recursion


        // stack.push(rax);
        // maybe align the stack here
        // add rsp, 8
        rax = rdx;
        rcx = 2;
        rdx = rax % rcx;
        rax = Math.floor(rax / rcx);    // idiv rcx
        rdx += rax;                     // add rdx, rax
        // now the bigger side is left
        // rax now also holds the length of the rest

        console.log('left middle: ', rdx);  // middle -> last element of left
        stack.push(rdx);                    // push the middle
        stack.push(rsi);
        _mergesort();


        // right
        rsi = stack.pop();
        rdx = stack.pop();                  // pop the middle
        rsi = rdx;                          //
        stack.push(rdx);    // the length of the original array
        console.log('right middle: ', rdx);
        _mergesort();


        // how to preserve the left and right arr addresses?

        const merge: () => void = () => {

        };

        merge();
    };

    _mergesort();

    /**
     * copy the full buffer back into the array
     * @param rsi start of the buffer
     * @param rdx length of the buffer and the array
     */
    const memcpy: () => void = () => {

    };

    // ? here or above merge call
    rdx = stack.pop();      // pop rdx
    rsi = stack.pop();      // pop rsi
    memcpy();



    const exit: () => void = () => {
        // free memory
        munmap();
    };

    // TODO set rdx right again

    exit();
}

// call it with the full array
rsi = 0;
rdx = 5;
fillArr();
console.log(arr);
const merge_res = mergesort_asm();
console.log(arr.subarray(0, 5))