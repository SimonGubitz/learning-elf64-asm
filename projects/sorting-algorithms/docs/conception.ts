type numbers = number[];

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

function mergesort(arr: numbers): numbers {

    if (arr.length <= 1) {
        return arr;
    }

    const concat: (l_arr: numbers, r_arr: numbers) => numbers = (l_arr: numbers, r_arr: numbers) => {

        let res: numbers = [];
        // res.length = l_arr.length + r_arr.length;

        let ri = 0, li = 0;
        for (let i = 0; i < res.length; i++) {
            // do something smart here
            if (arr[ri] > arr[li]) {
                // 
                res.push(arr[ri]);
                ri++;
            } else {
                res.push(arr[li]);
                li++;
            }
        }

        return []; // temp
    };

    // split in two
    let l_arr: numbers = [];
    let r_arr: numbers = [];
    let middle: number = arr.length / 2;
    for (let i = arr.length; i > 0; i--) {
        if (i > middle) {
            l_arr.push(arr[i]);
        } else {
            r_arr.push(arr[i]);
        }
    }

    l_arr = mergesort(l_arr);
    r_arr = mergesort(r_arr);

    return concat(l_arr, r_arr);
}


console.log(mergesort([832, 32, 499, 427, 3, 6, 9, 1, 5, 2]));