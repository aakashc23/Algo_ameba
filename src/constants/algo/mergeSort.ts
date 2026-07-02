import type { AlgoImplementations } from '../algoInfo';

export const mergeSortImpl: AlgoImplementations = {
  python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return _merge(left, right)

def _merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`,

  java: `public static void mergeSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}

static void merge(int[] arr, int l, int m, int r) {
    int[] tmp = Arrays.copyOfRange(arr, l, r + 1);
    int i = 0, j = m - l + 1, k = l;
    while (i <= m - l && j <= r - l)
        arr[k++] = tmp[i] <= tmp[j] ? tmp[i++] : tmp[j++];
    while (i <= m - l) arr[k++] = tmp[i++];
    while (j <= r - l) arr[k++] = tmp[j++];
}`,

  cpp: `void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> tmp(arr.begin()+l, arr.begin()+r+1);
    int i = 0, j = m-l+1, k = l;
    while (i <= m-l && j <= r-l)
        arr[k++] = tmp[i] <= tmp[j] ? tmp[i++] : tmp[j++];
    while (i <= m-l) arr[k++] = tmp[i++];
    while (j <= r-l) arr[k++] = tmp[j++];
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m+1, r);
    merge(arr, l, m, r);
}`,

  javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const res = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length)
    res.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return [...res, ...left.slice(i), ...right.slice(j)];
}`,

  golang: `func mergeSort(arr []int) []int {
    if len(arr) <= 1 {
        return arr
    }
    mid := len(arr) / 2
    left := mergeSort(arr[:mid])
    right := mergeSort(arr[mid:])
    return mergeFn(left, right)
}

func mergeFn(l, r []int) []int {
    res := []int{}
    i, j := 0, 0
    for i < len(l) && j < len(r) {
        if l[i] <= r[j] {
            res = append(res, l[i]); i++
        } else {
            res = append(res, r[j]); j++
        }
    }
    return append(append(res, l[i:]...), r[j:]...)
}`,
};
