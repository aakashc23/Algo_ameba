import type { AlgoImplementations } from '../algoInfo';

export const binarySearchImpl: AlgoImplementations = {
  python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif target < arr[mid]:
            right = mid - 1
        else:
            left = mid + 1
    return -1`,

  java: `public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (target < arr[mid]) right = mid - 1;
        else left = mid + 1;
    }
    return -1;
}`,

  cpp: `int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = (int)arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (target < arr[mid]) right = mid - 1;
        else left = mid + 1;
    }
    return -1;
}`,

  javascript: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    else if (target < arr[mid]) right = mid - 1;
    else left = mid + 1;
  }
  return -1;
}`,

  golang: `func binarySearch(arr []int, target int) int {
    left, right := 0, len(arr)-1
    for left <= right {
        mid := left + (right-left)/2
        if arr[mid] == target {
            return mid
        } else if target < arr[mid] {
            right = mid - 1
        } else {
            left = mid + 1
        }
    }
    return -1
}`,
};
