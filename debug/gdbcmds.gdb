shell make clean && make
b gdb_breakpoint
layout regs

# Good to know for projects/sorting-algorithms/*
# running "info address arr"
# and "d/d *(int*)(<paste_address_here> + $rcx * 4) " <- supposed rcx is the enumerator register and its a 4 byte integer
# this displays the arr[i] equivalent
run
