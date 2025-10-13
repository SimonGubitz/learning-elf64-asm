# sorting-algorithms

This project is inspired by a similar project I've recently done in Pascal: [Sorting-Algorithms-Benchmark](https://github.com/SimonGubitz/Sorting-Algorithms-Benchmark/tree/main).

## Goals

- [ ] Bubblesort
- [ ] Heapsort
- [ ] Insertion Sort
- [ ] Mergesort
- [ ] Quicksort
- [x] Selection Sort
- [ ] Radix Sort

## Output

As a "benchmark" output, running the program will give a similar output to this:

```bash
- For 15000 Elements:
- Time: 53ms
- Total Array Accesses: 225105000
```

## Technique

Using the `SYS_CLOCK_GETTIME` ticks to capture start and end times, and calculating the runtime of the desired algorithm.
And inside the algorithms using the `rdi` register to capture the array accesses (total only, no read/write separation), to gain a benchmark insight.

## Conception

Higher language conceptional helpers are available [here](./docs/conception.ts). With Assembly-Idiomatic Typescript.
