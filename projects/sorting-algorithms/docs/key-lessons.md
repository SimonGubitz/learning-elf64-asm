# Key Lessons

## 1. No more than one dereferencing per line

### Change

> [selection-sort.asm:39](../src/algorithms/selection-sort.asm)

```diff
-     cmp dword[arr + rbx*4], dword[arr + rdx*4]
+     mov r8d, dword[arr + rdx*4]
+     cmp dword[arr + rbx*4], r8d
```

## 2. CMP with ADD right behind it

### Change

> [selection-sort.asm:40](../src/algorithms/selection-sort.asm)

```diff
    cmp dword[arr + rbx*4], r8d
-   add rdi, 2
+   lea rdi, [rdi + 2]
```

### Why it needed to be changed

`cmp %1, %2` is an instruction, that subtracts %2 from %1, and modifies the `eflags` register based on the result.
Based on the state of the `eflags` the `jl` or `jg` either jumps or ignores it.
Thus normally it's written direcly beneath each other, but since I wanted to count the array access in a benchmark style, I wanted to add 2 to the access counter, which I used `rdi` for.
Yet I completely forgot, that a `add rdi, 2` instruction changes the flags into an unusable state for conditional jumping.
Thus I had to use `lea rdi, [rdi + 2]` which essentially does the same thing, but without affecting any flags.

## 3. Mergesort

### Change

> [merge.ts](./merge.ts)

```diff
    rcx = rax;          // pepare the counter
    rbx = rax;          // prepare the comparator
    rbx += rdx;         //  "       "   "
    rsi = rax;          // prepare the starting index as the start of the new memory block
-    fill_loop();
    _mergesort();
```

### Why it could be removed

Filling up the left and right arrays is a common step in higher level languages implementing mergesort, but its not needed, as the left and right arrays arent modified, and only in the merge operation is a new array or rather a new memory buffer needed.

## 4. Learned about [REP/REPE/REPZ/REPNE/REPNZ](https://www.felixcloutier.com/x86/rep:repe:repz:repne:repnz)
