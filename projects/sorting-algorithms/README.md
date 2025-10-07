# sorting-algorithms

This project is inspired by a similar project I've recently done in Pascal: [Sorting-Algorithms-Benchmark](https://github.com/SimonGubitz/Sorting-Algorithms-Benchmark/tree/main).

## Goals

- [ ] Bubblesort
- [ ] Heapsort
- [ ] Insertion Sort
- [ ] Mergesort
- [ ] Quicksort
- [ ] Selection Sort
- [ ] Radix Sort

## Technique

Using the `SYS_CLOCK_GETTIME` ticks to capture start and end times, and calculating the runtime of the desired algorithm.
And inside the algorithms using the `rdi` register to capture the array accesses (total only, no read/write separation), to gain a benchmark insight.
