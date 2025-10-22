/**
 * Use Better Comments in VS-Code to visualize the comments better and differentiate between normal comments //
 * and direct asm translations // *
 * or other distinct styles
 */

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

/*
 * start index in the array
        console.log(`before middle calculation`)
        console.log(`rsi: ${rsi}`);
        console.log(`rdi: ${rdi}`);
        console.log(`rdx: ${rdx}`);l * start address of the (sub)array
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
const fillArr = (length: number) => {
    console.log(`length: ${length}`);
    for (let i = 0; i <= length; i++) {
	    arr[i] = length - i;
    }
}

function mergesort_asm() {

    // calculate the length once to allocate the correct amount of memory
    rdx = rdi;
    rdx -= rsi;
    rdx += 1; // * inc rdx

    const init: () => void = () => {
        // reserve more space
        rax = mmap({length: rdx * 4});      // mmap returns the address of the new space in rax
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
	    rdx = rdi;
    	rdx -= rsi;

        console.log('\nin mergesort with addr:', rsi, 'and end index:', rdi);
        console.log(arr.subarray(rsi, rdi));

        if (rdx <= 1) {         // * cmp rdx 1, jle .return jmp, .skip
            console.log('\nreturning, due to rdx being: ' + rdx + '\n');
            // * .return:

            return;             // * ret
        }
        // * .skip:

        // push the start, end and length
        stack.push(rsi);        // push start index
        console.log(`pushed rsi ${rsi}`);
        stack.push(rdi);        // push end index
        console.log(`pushed rdi ${rdi}`);

        rdx = rdi;              // * mov rdx, rdi
        rdx -= rsi;             // * sub rdx, rsi
        stack.push(rdx);        // push length
        console.log(`pushed rdx ${rdx}`);


        // LEFT


        // console log hell here

        console.log(`before middle calculation`)
        console.log(`rsi: ${rsi}`);
        console.log(`rdi: ${rdi}`);
        console.log(`rdx: ${rdx}`);

        //rax = rdx;                      // ! this still uses end instead of length -> thus only working in 0-index arrays not addresses
        //rcx = 2;                        // divisor = 2
        //rdx = rax % rcx;                // simulate clobering rdx register in idiv operation
        //rax = Math.floor(rax / rcx);    // * idiv rcx
        //rdx += rax;                     // * add rdi, rax

        // goal: rdi needs the middle INDEX
        rax = rdx;			// set the dividend as the length
        rcx = 2;			// set the divisor as 2
        rdx = rax % rcx;		// simulate rdx clobber
        rax = Math.floor(rax / rcx);	// * idiv rcx -> divide rax by rcx


        // goal: get rdi to have the end ADDRESS
        // set the end INDEX
        rdi = rax;	// * lea rdi, [rax * 4] <- ADDRESS OFFSET
        rdi += rsi;	// add to get the end ADDRESS


        console.log('in left, middle: ', rdi);  // middle -> last element of left
        _mergesort();


        // RIGHT

        // i believe rdi and rsi are switched around

        rsi = stack.pop();                  // length -> pop the length of the previous array -> start index
        rsi -= 1;                           // zero indexed
        console.log(`popped rsi: ${rsi}`);

        rdi = stack.pop();                  // end -> this pops the end index of the left side
        console.log(`popped rdi: ${rdi}`);

        r8 = stack.pop();                   // start -> unneccesary for this
        console.log(`popped r8: ${r8}`);

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
    rdi = stack.pop();      // * pop rdi
    rsi = stack.pop();      // * pop rsi
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
rdi = 4;
fillArr(rdi - rsi + 1);
console.log(arr);
const merge_res = mergesort_asm();
console.log(arr.subarray(0, 4))
