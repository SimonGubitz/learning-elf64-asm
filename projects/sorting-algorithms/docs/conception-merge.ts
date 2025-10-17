// Workaround to simulate being able to set multiple "return" registers
type ret = {

}

/**
 *
 */
let rax: number;

/**
 * length of the array
 */
let rdx: number;

/**
 *
 */
let rcx: number;

/**
 * address of the array
 */
let rsi: number;

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
const arr = new Int32Array([ 5, 4, 3, 2, 1 ]);  // 32 bit (4 byte) integer array

// just put it behind the array
const mmap: (bytes: number) => number = (bytes: number) => {
    arr.buffer.resize(bytes);
    return rdx;
};

/**
 * Assembly idiomatic mergesort
 * @param rsi in this case the index in the array, in assembly the real address
 * @param rdx the elements in the array, in assembly the 1/4 offset in the memory due to 4 byte sized int elements
 */
function _mergesort() {
    rsi = 0;            // xor rcx, rcx

    if (rsi === rdx) {
        stack.push(rsi);    // push rsi
        stack.push(rdx);    // push rdx
        return;             // ret
    }

    stack.push(rsi);        // push rsi
    stack.push(rdx);        // push rdx

    // left
    // reserve more space
    rax = mmap(4 * rdx);    // mmap returns the address of the new space in rax

    rsi = rax;              // mov rsi, rax
    _mergesort();


    // right

    _mergesort();



    // pop in reverse LIFO
    rdx = stack.pop();      // pop rdx
    rsi = stack.pop();      // pop rsi

    return {

    }
}

// call it with the full array
rsi = 0;
rdx = arr.length;
const merge_res = _mergesort();
console.log(arr.subarray(0, arr.length))