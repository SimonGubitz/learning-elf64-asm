shell make clean && make
file ./build/sorting-algorithms
b _selection_sort.gdb_breakpoint
display/d $r8d
display/d *(int*)($r9 + $rdx * 4)
display/d $esi
display $eflags
run