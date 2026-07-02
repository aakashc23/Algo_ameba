import type { AlgoImplementations } from '../algoInfo';

export const linearSearchImpl: AlgoImplementations = {
  python: `def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i   # found
    return -1          # not found`,

  java: `public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,

  cpp: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < (int)arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,

  javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,

  golang: `func linearSearch(arr []int, target int) int {
    for i, v := range arr {
        if v == target {
            return i
        }
    }
    return -1
}`,
};
