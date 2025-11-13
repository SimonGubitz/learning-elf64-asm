/**
 * Use Better Comments in VS-Code to visualize the comments better and differentiate between normal comments //
 * and direct asm translations // *
 * or other distinct styles
 */

type memory_address = number;

/**
 * temporarily holds the address of the new memory block
 * later hold the full buffer iterator offset (TODO)
 */
let rax: memory_address;

/**
 * length of the (sub)array
 * in the merge steps only the length of the left (sub)array
 */
let rdx: number;

/**
 * temp idiv clobbered register
 * first/left iterator in the merge function
 */
let rcx: number;

/*
 * start index in the array
 */
let rsi: memory_address;

/**
 * Holds the length of the right subarray in merge steps
 */
let rbx: number;

/**
 * Stack pointer, actively used as such
 */
let rsp: number;

/**
 * end index in the array
 * end address of the (sub)array
 */
let rdi: memory_address;

/**
 * short lived gargabe collector to pop the full stash.
 * second/right iterator in the merge function
 */
let r8: memory_address | number;

/**
 * 
 */
let rbp: number;

/**
 * r9d gets clobbered in the merge_while_function as a dereferencing helper
 */
let r9: memory_address | number;

/**
 * effective address holder for the merge function source address
 */
let r10: memory_address;

/**
 * effective address holder for the merge function destination address
 */
let r11: number;

/**
 * Callee saved, holding the address of the original array, to have reference point
 * NOTE will switch with r13 temporarily during the lifetime of the program
 */
let r12: number;

/**
 * Callee saved, holding the address of the new memory block (buffer)
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

/**
 * class to simulate 
 *
 * @
 */
class Stack extends Array {
	push(val: any) {
		this.alignment++;
		console.log(`STACK push ${val}`);
		console.log(`STACK alignment ${this.length}\n`);
		return super.push(val);

		/*
		let ret = this.stack[rsp];
		rsp--; // 1 as used as an index not memory byte address, but 8 bytes (64bit mode) in assembly
		return ret;
		*/
	}

	pop(): any {
		this.alignment--;
		const val: any = super.pop();
		console.log(`STACK pop ${val}`);
		console.log(`STACK alignment ${this.length}\n`);
		if (this.alignment !== this.length) {
			console.log(`alignment non-aligned. Alignment: ${this.alignment}, length: ${this.length}`);
		}
		return val;
	}


	alignment: number = 0;
	stack_size_buf = new ArrayBuffer();
	stack = new Uint8Array(this.stack_size_buf);
}

const stack: Stack = new Stack();



// override the push and pop functions to be able to align stacks




// allow double the size, as O(n) + O(n) auxilliary space complexity in mergesort
const arr_buf = new ArrayBuffer(4 * 5, { maxByteLength: 2 * 4 * 5 });
const arr = new Int32Array(arr_buf);  // 32 bit (4 byte) integer array -> although less a real array but the memory structure

// just put it behind the array
const mmap = (options: {
	addr?: number
	length: number
	prot?: string[]
	flags?: string[]
	fd?: number
	offset?: number
}) => {
	const current_bytes = arr_buf.byteLength;
	arr_buf.resize(current_bytes + options.length);
	console.log(`Increase buffer size from ${current_bytes}b to ${arr_buf.byteLength}b.`);
	console.log(`Increase buffer size from ${current_bytes / 4} elements to ${arr_buf.byteLength / 4} elements.\n`);
	return current_bytes;
};
const munmap: () => number = () => {
	// rdi was popped before
	const current_bytes = arr_buf.byteLength;
	arr_buf.resize( rdi * 4 );
	console.log(`Increase buffer size from ${current_bytes}b to ${arr_buf.byteLength}b.`);
	console.log(`Increase buffer size from ${current_bytes / 4} elements to ${arr_buf.byteLength / 4} elements.\n`);
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

	/**
	 * copy the full buffer back into the array
	 * @param rsi start of the buffer
	 * @param rdx length of the buffer and the array
	 * @param rcx iterator
	 */
	const memcpy: () => void = () => {
		rcx = rdx;
		// * mov rsi, r13
		// * mov rdi, r12
		// * rep movsq

		for (let rcx = 0; rcx < rdx; rcx++) {
			arr[r13 + rcx] = arr[r12 + rcx];
		}
	};


	const init: () => void = () => {
		// reserve more space
		rax = mmap({length: rdx * 4});	// mmap returns the address of the new space in rax
		rax /= 4;			// to map this back into the style of element index instead of byte memory location TS/ASM Difference


		// the starting memory region -> the "original" array
		r12 = rsi;

		// write the global memory offset into r13
		r13 = rax;			// * mov r13, rax


		memcpy();
		
	};
	init();

	console.log("logging r12");
	stack.push(r12);
	stack.push(r13);

	/**
	 * The main sorting function, seperated due to idiomatics
	 * Assembly idiomatic mergesort
	 * @param rsi - start index
	 * @param rdi - end index
	 * @param r12 - source address
	 * @param r13 - dest address
	 */
	const _mergesort: () => void = () => {
		rdx = rdi;
		rdx -= rsi;
		rdx += 1;

		// console.log('\nin mergesort with addr:', rsi, 'and end index:', rdi);
		// console.log(arr.subarray(rsi, rdi + 1));
		// console.log(`rdx is: ${rdx}`);

		if (rdx <= 1) {         // * cmp rdx 1 / jle .return jmp / .skip
			// console.log('\nreturning, due to rdx being: ' + rdx);
			// * .return:

			return;             // * ret
		}
		// * .skip:

		// push the start, end and length
		stack.push(rsi);        // push start index
		// console.log(`pushed rsi ${rsi}`);
		stack.push(rdi);        // push end index
		// console.log(`pushed rdi ${rdi}`);
		rdx = rdi;              // * mov rdx, rdi
		rdx -= rsi;             // * sub rdx, rsi
		stack.push(rdx);        // push length
		// console.log(`pushed rdx ${rdx}`);


		// LEFT
		// console.log('\nLEFT');


		// console.log(`before middle calculation`)
		// console.log(`rsi: ${rsi}`);
		// console.log(`rdi: ${rdi}`);
		// console.log(`rdx: ${rdx}`);

		// goal: rdi needs the middle INDEX
		rax = rdx;			// set the dividend as the length
		rcx = 2;			// set the divisor as 2
		rdx = rax % rcx;		// simulate rdx clobber
		rax = Math.floor(rax / rcx);	// * idiv rcx -> divide rax by rcx


		// goal: get rdi to have the end ADDRESS
		// set the end INDEX
		rdi = rax;	// * lea rdi, [rax * 4] <- ADDRESS OFFSET
		rdi += rsi;	// add to get the end ADDRESS


		// console.log('in left, middle: ', rdi);  // middle -> last element of left
		// TODO: switch r12 and r13
		// * xor r12, r13
		// * xor r13, r12
		// * xor r12, r13
		let temp = r12;
		r12 = r13;
		r13 = temp;
		_mergesort();


		// switch rdi and rsi here?
		// let temp = rdi;
		// rdi = rsi;
		// rsi = temp;
		// console.log(`switched ${rdi} with ${rsi}`);


		// RIGHT
		// console.log('\nRIGHT');

		rsi = stack.pop();                  // length -> pop the length of the previous array -> start index
		rdi = stack.pop();                  // end -> this pops the end index of the left side
		r8 = stack.pop();                   // start -> unneccesary for this

		// TODO: Calculate the left and right lenghts correctly here

		// push it all again in order ( start, end, length )
		stack.push(r8);
		stack.push(rdi);
		stack.push(rsi);

		// goal -> have rdx hold the left length
		// 	&& have rbx hold the right length


		// console.log('in right, middle: ', rdi);
		// TODO: switch r12 and r13
		// * xor r12, r13
		// * xor r13, r12
		// * xor r12, r13
		temp = r12;
		r12 = r13;
		r13 = temp;
		_mergesort();



		// how to preserve the left and right arr addresses?

		/**
		 * Merge the two split arrs into the newly created buffer
		 * @param rsi - Left starting index
		 * @param rdi - Right starting index
		 * @param rdx - Length of the left array
		 * @param rbx - Length of the right array
		 * @param r12 - source array address
		 * @param r13 - dest array address
		 * -------- WORKING REGISTERS --------
		 * @param rcx - left iterator
		 * @param  r8 - right iterator
		 */
		const merge: () => void = () => {

			console.log(`left length ${rdx}`);
			console.log(`right length ${rbx}`);

			// console.log('setting rax to 0');
			// rax = 0;	// * xor rax, rax - buffer target index
			rcx = 0;	// * xor rcx, rcx - left iterator
			r8  = 0;	// * xor r8, r8   - right iterator


			// console.log('=====================');
			// console.log('merging');
			// console.log('=====================');
			// console.log(`rax: ${rax}`);
			// console.log(`rsi left: ${rsi}`);
			// console.log(`rdi right: ${rdi}`);
			// console.log(`rdx / left length: ${rdx}`);
			// console.log(`rbx / right length: ${rdx}`);
			// console.log('\n');


			console.log(`thus wanting to merge rsi-rdx: ${arr.subarray(r12 + rsi, rsi + rdx)} and rdi-rbx: ${arr.subarray(r12 + rdi, rdi + rbx)}`);

			/**
			 * Writing the value at r13 + rcx into the buffer
			 * @param rcx - left index offset
			 * @param rsi - left start address
			 * @param r12 - source copy address
			 * ----------    ------------------
			 * @param rax - dest copy iterator offset
			 * @param r13 - dest copy start offset
			 */
			const push_left: () => void = () => {
				console.log(' === MERGE LEFT === ');
				// console.log(`rcx / offset: ${rcx}`);
				// console.log(`rsi /  start: ${rsi}`);
				// console.log(`r12 / offset: ${r12}`);
				// console.log(`r13 / offset: ${r13}`);

				// * lea r10, [r13 + rsi]
				// * mov r11, dword[r10 + rcx*4]
				// * mov r10, dword[r13 * rcx*4]
				// * mov r10, r11 <- maybe switched around???
				//
				// write original + iterator into buffer + iterator
				// write dword[rsi + rcx*4]  into dword[r13 + rcx*4]

				arr[r13 + rax] = arr[r12 + rsi + rcx];

				console.log(`arr after left push/merge`);
				console.log(arr);

				console.log(`BEFORE rcx: ${rcx}, rax: ${rax}`);
				rcx += 1; // increase left iterator
				rax += 1; // increase global iterator
				console.log(`AFTER rcx: ${rcx}, rax: ${rax}`);
			};

			/**
			 * Writing the value at r13 + r8 into the buffer 
			 * @param r8 - right index offset
			 * @param rdi - right start address
			 * @param r13 - global offset
			 */
			const push_right: () => void = () => {
				console.log(' === MERGE RIGHT === ');
				// console.log(`r8  / offset: ${r8}`);
				// console.log(`rdi /  start: ${rdi}`);
				// console.log(`r12 / offset: ${r12}`);
				// console.log(`r13 / offset: ${r13}`);

				// write dword[rdi + r8*4] into dword[r13 + r8*4]
				arr[r13 + rax] = arr[r12 + rdi + r8];


				console.log(`arr after right push/merge`);
				console.log(arr);


				console.log(`BEFORE r8: ${r8}, rax: ${rax}`);
				r8  += 1; // increase right iterator
				rax += 1; // increase global iterator
				console.log(`AFTER r8: ${r8}, rax: ${rax}`);
			};


			const merge_while_loop: () => void = () => {

				// console.log(`in merge while loop -> rax: ${rax}`);


				if (rcx >= rdx) { // * cmp rcx, rdx
					// console.log(`exiting merge_while due to left index: ${rcx} >= length: ${rdx}\n`);
					return; // * je .exit_loop
				}
				if (r8 >= rbx) { // * cmp r8, rbx
					// console.log(`exiting merge_while due to right index: ${r8} >= length: ${rbx}\n`);
					return; // * je .exit_loop
				}

				// in "while" now

				// mov r9l, byte[arr + rcx * 4]
				// cmp r9l, byte[arr + r8 * 4]
				// jle .push_left
				// jmp .push_right
				// .push_left:
				// .push_right:

				// no two dereference operations in one instruction
				// ↓ left source
				console.log(`r12  (source start): ${r12}`);
				console.log(`rsi    (left start): ${rsi}`);
				console.log(`rcx (left iterator): ${rcx}`);
				console.log(`r8 (right iterator): ${r8}`);
				console.log(`left access index: ${r12 + rsi + rcx}`);
				console.log(`right access index: ${r12 + rdi + r8}`);
				// ↓ right source
				r9 = arr[r12 + rsi + rcx];
				if (r9 <= arr[r12 + rdi + r8]) {
					console.log(`in while: left -> ${r9} <= right -> ${arr[r12 + rdi + r8]}, pushing left \n`);
					push_left();
				} else {
					console.log(`in while: left -> ${r9} > right -> ${arr[r12 + rdi + r8]}, pushing right \n`);
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

				console.log('in for left loop');

				// * cmp rcx, rdx
				if (rcx >= rdx) {
					// console.log(`exiting left "for": ${rcx} >= ${rbx}`);
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
					// console.log(`exiting right "for": ${r8} >= ${rbx}`);
					return;
				}

				// in "for" now
				push_right();           // * call .push_right

				merge_right_for_loop(); // * jmp merge_right_for_loop
			};
			merge_right_for_loop();


			// Switch dest and source here
			// * xor r12, r13
			// * xor r13, r12
			// * xor r12, r13
			let temp = r12;
			r12 = r13;
			r13 = temp;

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

		rax = 0;
		merge();
	};


	// copy the merge to the source
	const copy_merge: () => void = () => {
		// possiably another loop
		// or just switch r12 and r13?
	};
	copy_merge();

	_mergesort();



	// ? here or above merge call
	rdi = stack.pop();      // * pop rdi
	console.log(`exit: popped rdi: ${rdi}`);
	rsi = stack.pop();      // * pop rsi
	console.log(`exit: popped rsi: ${rsi}`);
	memcpy();



	const exit: () => void = () => {
		// free memory
		munmap();

		// r13 = stack.pop();
		// r12 = stack.pop();

		return; // * ret
	};

	// TODO set rdi right again

	exit();
}

// call it with the full array
rsi = 0;
rdi = 4;
fillArr(rdi - rsi + 1);
// switch 2, 1 around, as to test the while left filling
let temp = arr[3];
arr[3] = arr[2];
arr[2] = temp;

console.log(arr);
const merge_res = mergesort_asm();
console.log(arr.subarray(rsi, rdi + 1))
