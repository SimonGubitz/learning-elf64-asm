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
let rdi: memory_address;

/**
 * second/right iterator in the merge function
 * previously short lived gargabe collector to pop the full stash.
 */
let r8: memory_address | number;

/**
 * 
 */
let rbp: number;

/**
 *
 */
let r9: number;

/**
 *
 */
let r10: number;

/**
 *
 */
let r11: number;

/**
 * Callee saved, holding the address of the new memory block (buffer)
 */
let r12: number;

/**
 *
 */
let r13: number;

/**
 *
 */
let r14: number;

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

    stack.push(r12);

    // calculate the length once to allocate the correct amount of memory
    rdx = rdi;
    rdx -= rsi;
    rdx += 1; // * inc rdx

    const init: () => void = () => {
        // reserve more space
        rax = mmap({length: rdx * 4});      // mmap returns the address of the new space in rax
        rax /= 4;                           // to map this back into the style of element index instead of byte memory location TS/ASM Difference

        r12 = rax;                          // * mov r12, rax
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
        rdx += 1;

        console.log('\nin mergesort with addr:', rsi, 'and end index:', rdi);
        console.log(arr.subarray(rsi, rdi + 1));
        console.log(`rdx is: ${rdx}`);

        if (rdx <= 1) {         // * cmp rdx 1, jle .return jmp, .skip
            console.log('\nreturning, due to rdx being: ' + rdx);
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
        console.log('\nLEFT');


        // console log hell here

        console.log(`before middle calculation`)
        console.log(`rsi: ${rsi}`);
        console.log(`rdi: ${rdi}`);
        console.log(`rdx: ${rdx}`);

        // goal: rdi needs the middle INDEX
        rax = rdx;			    // set the dividend as the length
        rcx = 2;			    // set the divisor as 2
        rdx = rax % rcx;		// simulate rdx clobber
        rax = Math.floor(rax / rcx);	// * idiv rcx -> divide rax by rcx


        // goal: get rdi to have the end ADDRESS
        // set the end INDEX
        rdi = rax;	// * lea rdi, [rax * 4] <- ADDRESS OFFSET
        rdi += rsi;	// add to get the end ADDRESS


        console.log('in left, middle: ', rdi);  // middle -> last element of left
        _mergesort();


        // RIGHT
        console.log('\nRIGHT');

        rsi = stack.pop();                  // length -> pop the length of the previous array -> start index
        console.log(`popped rsi: ${rsi}`);

        rdi = stack.pop();                  // end -> this pops the end index of the left side
        console.log(`popped rdi: ${rdi}`);

        r8 = stack.pop();                   // start -> unneccesary for this
        console.log(`popped r8: ${r8}`);
        
        // push it all again in order ( start, end, length )
        stack.push(r8);
        stack.push(rdi);
        stack.push(rsi);


        console.log('in right, middle: ', rdi);
        _mergesort();

       

        // how to preserve the left and right arr addresses?

        /**
         * Merge the two split arrs into the newly created buffer
         * @param rsi - Left starting index
         * @param rdi - Right starting index
         * @param rdx - Length of the left array
         * @param rbx - Length of the right array
         * @param rax - buffer offset
         * ----------- i dont know about this below ----------------
         * @param dest - idk which register and I hate the rsi rdi left right and not source (rax) and dest (whatever) thing I do now 
         */
        const merge: () => void = () => {

            rcx = 0;    // * xor rcx, rcx - left index
            r8  = 0;    // * xor r8, r8 - right index


            console.log('=====================');
            console.log('merging');
            console.log('=====================');
            console.log(`rsi left: ${rsi}`);
            console.log(`rdi right: ${rdi}`);
            console.log(`rdx / left length: ${rdx}`);
            console.log(`rbx / right length: ${rdx}`);
            console.log('\n');


            console.log(`thus wanting to merge rsi-rdx: ${arr.subarray(rsi, rsi + rdx)} and rdi-rbx: ${arr.subarray(rdi, rdi + rbx)}`);

            /**
             * Writing the value at r12 + rcx into the buffer
             * @param rcx - left index offset
             * @param rsi - left start address
             * @param r12 - global offset
             */
            const push_left: () => void = () => {
                console.log(' === MERGE LEFT === ');
                console.log(`rcx / offset: ${rcx}`);
                console.log(`rsi /  start: ${rsi}`);
                console.log(`r12 / offset: ${r12}`);
                
                // write dword[rsi + rcx*4] into dword[r12 + rcx*4]
                arr[r12 + rax] = arr[rsi + rcx];
                
                console.log(`arr after push/merge`);
                console.log(arr);
                rcx += 1;
                rax += 1;
            };

            /**
             * Writing the value at r12 + r8 into the buffer 
             * @param r8 - right index offset
             * @param rdi - right start address
             * @param r12 - global offset
             */
            const push_right: () => void = () => {
                console.log(' === MERGE RIGHT === ');
                console.log(`r8  / offset: ${r8}`);
                console.log(`rdi /  start: ${rdi}`);
                console.log(`r12 / offset: ${r12}`);

                // write dword[rdi + r8*4] into dword[r12 + r8*4]
                arr[r12 + rax] = arr[rdi + r8];


                console.log(`arr after push/merge`);
                console.log(arr);

                r8  += 1;
                rax += 1;
            };


            const merge_while_loop: () => void = () => {
                if (rcx >= rdx) { // * cmp rcx, rdx
                    console.log(`exiting merge_while due to left index: ${rcx} >= length: ${rbx}\n`);
                    return; // * je .exit_loop
                }
                if (r8 >= rbx) { // * cmp r8, rbx
                     console.log(`exiting merge_while due to right index: ${r8} >= length: ${rbx}\n`);
                     return; // * je .exit_loop
                }

                // in "while" now

                // mov r9d, byte[arr + rcx * 4]
                // cmp r9d, byte[arr + r8 * 4]
                // jle .push_left
                // jmp .push_right
                // .push_left:
                // .push_right:

                // no two dereference operations in one instruction
                r9 = arr[rsi + rcx];
                if (r9 <= arr[rdi + r8]) {
                    console.log(`in while: ${r9} <= ${arr[r8]}, pushing left`);
                    push_left();
                } else {
                    console.log(`in while: ${r9} > ${arr[r8]}, pushing right`);
                    push_right();
                }

                merge_while_loop(); // * jmp merge_while_loop
            };
            merge_while_loop();


            /**
             * Merging the remaining elements from the left arr
             * @param rcx - remains as the left index
             */
            const merge_left_for_loop: () => void = () => {
                // * cmp rcx, rdx
                if (rcx >= rdx) {
                    console.log(`exiting left for: ${rcx} >= ${rbx}`);
                    return;
                }

                // in "for" now
                push_left();    // * call .push_left

                merge_left_for_loop();  // * jmp merge_left_for_loop
            };
            merge_left_for_loop();
            

            /**
             * Merging the remaining elements from the right array
             * @param r8 - remains as the right index
             */
            const merge_right_for_loop: () => void = () => {
                // * cmp r8, rbx
                if (r8 >= rbx) {
                    console.log(`exiting right for: ${r8} >= ${rbx}`);
                    return;
                }

                // in "for" now
                push_right();           // * call .push_right

                merge_right_for_loop(); // * jmp merge_right_for_loop
           };
            merge_right_for_loop();
            
            // pop here

            return;
        };


        // rsi is already set as the right start index -> thus 
        rdi = rsi; // right starting index
        // right length is already set by the comparison in mergesort recursion
        rdx = stack.pop(); // left array length
        r8  = stack.pop(); // <- left end index
        rsi = stack.pop(); // left starting index
    
        // rbx holding the left length temporarily
        rbx = rdi;  // * mov rbx, rdi
        rbx -= rsi; // * sub rbx, rsi

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
    console.log(`exit: popped rdi: ${rdi}`);
    rsi = stack.pop();      // * pop rsi
    console.log(`exit: popped rsi: ${rsi}`);
    memcpy();



    const exit: () => void = () => {
        // free memory
        munmap();

        r12 = stack.pop();

        return; // * ret
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
console.log(arr.subarray(rsi, rdi + 1))
