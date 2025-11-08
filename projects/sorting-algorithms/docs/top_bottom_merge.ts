// wikipedia.com/wiki/Merge_Sort

// Array A[] has the items to sort; array B[] is a work array.
function TopDownMergeSort(A: number[], B: number[], n: number)
{
	CopyArray(A, 0, n, B);           // one time copy of A[] to B[]
	TopDownSplitMerge(A, 0, n, B);   // sort data from B[] into A[]
}

// Split A[] into 2 runs, sort both runs into B[], merge both runs from B[] to A[]
// iBegin is inclusive; iEnd is exclusive (A[iEnd] is not in the set).
function TopDownSplitMerge(B: number[], iBegin: number, iEnd: number, A: number[])
{

	if (iEnd - iBegin <= 1) {		// if run size == 1
		return;				// consider it sorted
	}

	// split the run longer than 1 item into halves
	iMiddle = (iEnd + iBegin) / 2;              // iMiddle = mid point
	// recursively sort both runs from array A[] into B[]
	TopDownSplitMerge(A, iBegin,  iMiddle, B);  // sort the left  run
	TopDownSplitMerge(A, iMiddle,    iEnd, B);  // sort the right run

	console.log(`thus wanting to merge rsi-rdx: ${A.slice(iBegin, iMiddle - 1)} and rdi-rbx: ${A.slice(iMiddle, iEnd)}`);
	
	// merge the resulting runs from array B[] into A[]
	TopDownMerge(B, iBegin, iMiddle, iEnd, A);
}

//  Left source half is A[ iBegin:iMiddle-1].
// Right source half is A[iMiddle:iEnd-1   ].
// Result is            B[ iBegin:iEnd-1   ].
function TopDownMerge(B: number[], iBegin: number, iMiddle: number, iEnd: number, A: number[])
{
	i = iBegin, j = iMiddle;

	// While there are elements in the left or right runs...
	for (k = iBegin; k < iEnd; k++) {
		// If left run head exists and is <= existing right run head.
		if (i < iMiddle && (j >= iEnd || A[i] <= A[j])) {
			B[k] = A[i];
			i = i + 1;
		} else {
			B[k] = A[j];
			j = j + 1;
		}
	}
}

function CopyArray(A: number[], iBegin: number, iEnd: number, B: number[])
{
	for (k = iBegin; k < iEnd; k++) {
		B[k] = A[k];
	}
}

A_arr = [5, 4, 3, 2, 1];
B_arr = [0, 0, 0, 0, 0];
TopDownMergeSort(A_arr, B_arr, A_arr.length);
console.log('A_arr: ');
console.log(A_arr);
