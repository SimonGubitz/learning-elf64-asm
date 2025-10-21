type memory_address = number;

/**
 * hold the address of the new memory block
 */
let rax: memory_address;

/**
 * length of the (sub)array
 */
let rdx: number;

/**
 * temp idiv register
 */
let rcx: number;

/**
 * start index in the array
 * start address of the (sub)array
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
 * end index in the array
 * end address of the (sub)array
 */
let rdi: number;

/**
 * temporary stash for previous array length
 * will pop into it just garbage
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
    // rdi was poped before
    const current_bytes = arr_buff.byteLength;
    arr_buff.resize( rdi * 4 );
    console.log(`Increase buffer size from ${current_bytes}b to ${arr_buff.byteLength}b.`)
    console.log(`Increase buffer size from ${current_bytes / 4} elements to ${arr_buff.byteLength / 4} elements.\n`)
    return rdi;
};

// debug simple 5 to 1
const fillArr = () => {
    for (let i = rdi; i > 0; i--) {
        arr[rdi - i] = i;
    }
}

function mergesort_asm() {

    const init: () => void = () => {
        // reserve more space
        rax = mmap({length: 4 * rdi});      // mmap returns the address of the new space in rax
        rax /= 4;                           // to map this back into the style of element index instead of byte memory location TS/ASM Difference
    };

    init();

    /**
     * The main sorting function, seperated due to idiomatics
     * Assembly idiomatic mergesort
     * @param rsi in this case the index in the array, in assembly the real address
     * @param rdi the elements in the array, in assembly the 1/4 offset in the memory due to 4 byte sized int elements
     */
    const _mergesort: () => void = () => {
        console.log('\nin mergesort with addr:', rsi, 'and end index:', rdi);
        console.log(arr.subarray(rsi, rdi));

        rbx = rdi;      // mov rbx, rdi
        rbx -= rsi;     // sub rbx, rsi
        console.log(`rbx: ${rbx}`);
        if (rbx <= 1) {         // cmp rbx 1, jle .return jmp, .skip
            console.log('\nreturning, due to rbx being: ' + rbx + '\n');
            //.return:




            return;             // ret
        }
        // .skip:

        // push the start and length
        stack.push(rsi);        // push start index
        console.log(`pushed rsi ${rsi}`);
        stack.push(rdi);        // push end index
        console.log(`pushed rdi ${rdi}`);


        length = 

        stack.push();
        console.log(`pushed `);

        // TODO increase the recursion depth here
        // to have the correct start and length in the right side recursion


        // LEFT

        rax = rdi;
        rcx = 2;
        rdi = rax % rcx;
        rax = Math.floor(rax / rcx);    // idiv rcx
        rdi += rax;                     // add rdi, rax

        console.log('in left, middle: ', rdi);  // middle -> last element of left
        _mergesort();


        // RIGHT

        rsi = stack.pop();                  // this pops the start index of the right side
        console.log(`popped rsi: ${rsi}`);  // intentionally not inverted

        r8 = stack.pop();
        console.log(`popped r8: ${r8}`);


        // get the length of 2 iteration ago here



        console.log('in right, middle: ', rdi);
        _mergesort();


        // how to preserve the left and right arr addresses?

        const merge: () => void = () => {
            console.log('merging');
        };

        merge();
    };

    _mergesort();

    /**
     * copy the full buffer back into the array
     * @param rsi start of the buffer
     * @param rdi length of the buffer and the array
     */
    const memcpy: () => void = () => {

    };

    // ? here or above merge call
    rdi = stack.pop();      // pop rdi
    rsi = stack.pop();      // pop rsi
    memcpy();



    const exit: () => void = () => {
        // free memory
        munmap();
    };

    // TODO set rdi right again

    exit();
}

// call it with the full array
rsi = 0;
rdi = 5;
fillArr();
console.log(arr);
const merge_res = mergesort_asm();
console.log(arr.subarray(0, 5))