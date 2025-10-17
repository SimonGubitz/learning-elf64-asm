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
 *
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
 *
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
const arr = new Int32Array(arr_buff);  // 32 bit (4 byte) integer array

// just put it behind the array
const mmap: (bytes: number) => number = (bytes: number) => {
    let current_bytes = arr_buff.byteLength;
    arr_buff.resize(current_bytes + bytes);
    console.log(`Increase buffer size from ${current_bytes} to ${arr_buff.byteLength}.\n`)
    return rdx;
};
const munmap: () => number = () => {
    // rdx was poped before
    arr_buff.resize( rdx * 4 );
    return rdx;
};

// debug simple 5 to 1
const fillArr = () => {
    for (let i = rdx; i > 0; i--) {
        arr[rdx - i] = i;
    }
}

/**
 * Assembly idiomatic mergesort
 * @param rsi in this case the index in the array, in assembly the real address
 * @param rdx the elements in the array, in assembly the 1/4 offset in the memory due to 4 byte sized int elements
 */
function _mergesort() {

    const init: () => void = () => {
        rsi = 0;            // xor rcx, rcx
        // reserve more space
        rax = mmap(4 * rdx);    // mmap returns the address of the new space in rax
    };

    init();

    console.log('in mergesort with addr: ', rsi, ' and rdx: ', rdx);
    console.log(arr.subarray(rsi, rdx));
    if (rsi === rdx) {
        stack.push(rsi);    // push rsi
        stack.push(rdx);    // push rdx
        return;             // ret
    }

    stack.push(rsi);        // push rsi
    stack.push(rdx);        // push rdx

    // left
    // rax still holds the address of the new memory block
    rsi = rax;              // mov rsi, rax
    // get the middlepoint
    rax = rdx;
    rcx = 2;
    rdx = rax % rcx;
    rax = Math.floor(rax / rcx);    // idiv rcx
    rdx += rax;                     // add rdx, rax
                                    // now the bigger side is left

    console.log('left: ', rdx);   // middle -> last element of left
    _mergesort();


    // right
    rsi = rdx;
    rsi += 1;   // one more than the last of left
    rdx = stack.pop();
    stack.push(rdx);    // the length of the original array
    console.log('right: ', rdx);
    _mergesort();


    const fill_arr: () => void = () => {

    }



    const merge: () => void = () => {

    };

    merge();



    // pop in reverse LIFO
    rdx = stack.pop();      // pop rdx
    rsi = stack.pop();      // pop rsi

    const exit: () => void = () => {
        // free memory
        munmap();
    };

    exit();
}

// call it with the full array
rsi = 0;
rdx = 5;
fillArr();
console.log(arr);
const merge_res = _mergesort();
console.log(arr.subarray(0, 5))