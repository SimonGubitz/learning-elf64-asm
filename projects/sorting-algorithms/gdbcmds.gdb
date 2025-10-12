shell make clean && make
file ./build/sorting-algorithms
b _selection_sort.gdb_breakpoint
display/d $r8d
display/d *(int*)(0x402022 + $rdx * 4)
display/d $esi
display $eflags
run