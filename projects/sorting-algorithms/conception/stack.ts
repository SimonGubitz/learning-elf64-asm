/**
 * class to roughly simulate the stack in assembly
 * TODO: 1. Catch over- & underflows of the stack
 *			 2. Enforce System-V ABI 16 byte stack alignment
 *			 and for easy error finding, enforce it with errors
 *
 * @param rsp - stack pointer
 */
export class Stack extends Array {
	push(val: any) {
		this.alignment++;
		console.log(`STACK push ${val}`);
		console.log(`STACK alignment ${this.length}`);
		return super.push(val);

		/*
		let ret = this.stack[rsp];
		rsp--; // 1 as used as an index not memory byte address by the BigUint64Array, but 8 bytes (64bit mode) in assembly
		return ret;
		*/
	}

	pop(): any {
		this.alignment--;
		const val: any = super.pop();
		console.log(`STACK pop ${val}`);
		console.log(`STACK alignment ${this.length}`);
		if (this.alignment !== this.length) {
			// console.log(`alignment non-aligned. Alignment: ${this.alignment}, length: ${this.length}`);
		}
		return val;
	}

	/**
	 * Simulate a `call` in assembly, which increases the rsp
	 *
	 * @param rsp - stack pointer
	 */
	Call() {
		rsp++;
	}


	/**
	 * Simulate the `ret` in assembly, returning from the last `call`
	 *
	 * @param rsp - stack pointer
	 */
	Ret() {
		rsp--;
	}


	alignment: number = 0;
	stack_size_buf = new ArrayBuffer(8 * 1024, { maxByteLength: 8 * 1024 });	// standard 8MiB buffer
	stack = new BigUint64Array(this.stack_size_buf);				// simulating a real 64 bit stack
}
