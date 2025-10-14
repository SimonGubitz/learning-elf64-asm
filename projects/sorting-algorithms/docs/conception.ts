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

function mergesort(arr: number[]): number[] {

    if (arr.length <= 1) {
        return arr;
    }

    // split in two
    let l_arr: number[] = [];
    let r_arr: number[] = [];
    let middle: number = Math.floor(arr.length / 2);
    for (let i = 0; i < middle; i++) {
        l_arr.push(arr[i]);
    }
    for (let i = middle; i < arr.length; i++) {
        r_arr.push(arr[i]);
    }

    const merge: (l_arr: number[], r_arr: number[]) => number[] = (l_arr: number[], r_arr: number[]) => {
        let res: number[] = [];

        let ri = 0, li = 0;
        while (ri < r_arr.length && li < l_arr.length) {
            if (l_arr[li] <= r_arr[ri]) {
                res.push(l_arr[li]);
                li++;
            } else {
                res.push(r_arr[ri]);
                ri++;
            }
        }
        for (let i = li; i < l_arr.length; i++) {
            res.push(arr[li]);
            li++;
        }

        for (let i = ri; i < r_arr.length; i++) {
            res.push(r_arr[ri]);
            ri++;
        }


        return res; // temp
    };

    l_arr = mergesort(l_arr);
    r_arr = mergesort(r_arr);

    return merge(l_arr, r_arr);
}


console.log(mergesort([832, 32, 499, 427, 3, 6, 9, 1, 5, 2]));