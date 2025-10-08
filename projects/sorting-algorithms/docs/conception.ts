

function selectionSort(arr: number[]) {
    let rcx = 0;
    let rdi = 0;
    for (let rcx = 0; rcx < arr.length; rcx++) {
        let rdx: number = rcx;
        const inner_loop = () => {
            for (let rbx = rcx; rbx < arr.length; rbx++) {
                if (arr[rbx] >= arr[rdx]) {         // jge .skip_update_min
                    console.log("skipping update");
                } else {
                    rdx = rbx;
                    console.log("setting min to: " + rdx);
                }
            }
        };
        inner_loop();

        let r8d = arr[rcx];       // mov r8d, dword[arr + rcx*4]
        if (arr[rdx] < r8d) {
            let temp = arr[rcx];
            arr[rcx] = arr[rdx];
            arr[rdx] = temp;
            rdi += 4;
            // console.log(arr);
        }
    }

    return arr; // ret
}


console.log(selectionSort([832, 32, 499, 427, 3, 6, 9, 1, 5, 2]));