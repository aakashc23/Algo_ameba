import type { AlgoImplementations } from '../algoInfo';

export const monotonicDecStackImpl: AlgoImplementations = {
  python: `def monotonic_decreasing_stack(nums: list[int]) -> list[int]:
    """
    Maintains a stack where elements are always in
    strictly decreasing order from bottom to top.
    When a new element is larger than the top, we
    pop until the stack is valid again, then push.
    """
    stack: list[int] = []

    for num in nums:
        # Pop while top is <= current (breaks decreasing order)
        while stack and stack[-1] <= num:
            stack.pop()
        stack.append(num)

    return stack


# Example: Next Greater Element to the right
def next_greater(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n
    stack: list[int] = []  # stores indices

    for i in range(n):
        while stack and nums[stack[-1]] < nums[i]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)

    return result`,

  java: `import java.util.ArrayDeque;
import java.util.Deque;

public class MonotonicDecreasingStack {

    /**
     * Returns the final monotonic decreasing stack after
     * processing all elements in nums.
     */
    public static int[] build(int[] nums) {
        Deque<Integer> stack = new ArrayDeque<>();

        for (int num : nums) {
            // Pop while top <= current (breaks decreasing order)
            while (!stack.isEmpty() && stack.peek() <= num) {
                stack.pop();
            }
            stack.push(num);
        }

        // Convert stack to array (bottom → top order)
        int[] result = new int[stack.size()];
        int i = stack.size() - 1;
        for (int val : stack) result[i--] = val;
        return result;
    }

    /** Next Greater Element to the right using index stack */
    public static int[] nextGreater(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        java.util.Arrays.fill(result, -1);
        Deque<Integer> stack = new ArrayDeque<>(); // indices

        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
                result[stack.pop()] = nums[i];
            }
            stack.push(i);
        }
        return result;
    }
}`,

  cpp: `#include <vector>
#include <stack>
#include <algorithm>
using namespace std;

/**
 * Build a monotonic decreasing stack.
 * Elements are always strictly decreasing from bottom to top.
 */
vector<int> monotonicDecStack(const vector<int>& nums) {
    stack<int> st;

    for (int num : nums) {
        // Pop while top <= current (breaks decreasing order)
        while (!st.empty() && st.top() <= num) {
            st.pop();
        }
        st.push(num);
    }

    // Collect result (bottom → top)
    vector<int> result;
    while (!st.empty()) {
        result.push_back(st.top());
        st.pop();
    }
    reverse(result.begin(), result.end());
    return result;
}

/** Next Greater Element to the right */
vector<int> nextGreater(const vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st; // stores indices

    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[st.top()] < nums[i]) {
            result[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return result;
}`,

  javascript: `/**
 * Build a monotonic decreasing stack from nums.
 * Elements are always strictly decreasing from bottom to top.
 */
function monotonicDecStack(nums) {
  const stack = [];

  for (const num of nums) {
    // Pop while top <= current (breaks decreasing order)
    while (stack.length > 0 && stack.at(-1) <= num) {
      stack.pop();
    }
    stack.push(num);
  }

  return stack; // bottom-to-top order
}

/**
 * Next Greater Element to the right.
 * Returns an array where result[i] is the first element
 * to the right of nums[i] that is greater, or -1 if none.
 */
function nextGreater(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = []; // stores indices

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && nums[stack.at(-1)] < nums[i]) {
      result[stack.pop()] = nums[i];
    }
    stack.push(i);
  }

  return result;
}`,

  golang: `package main

// MonotonicDecStack builds a strictly decreasing stack from nums.
// Elements are always decreasing from bottom to top.
func MonotonicDecStack(nums []int) []int {
	stack := []int{}

	for _, num := range nums {
		// Pop while top <= current (breaks decreasing order)
		for len(stack) > 0 && stack[len(stack)-1] <= num {
			stack = stack[:len(stack)-1]
		}
		stack = append(stack, num)
	}

	return stack // bottom-to-top order
}

// NextGreater returns, for each element, the first greater
// element to its right. Returns -1 if none exists.
func NextGreater(nums []int) []int {
	n := len(nums)
	result := make([]int, n)
	for i := range result {
		result[i] = -1
	}
	stack := []int{} // index stack

	for i := 0; i < n; i++ {
		for len(stack) > 0 && nums[stack[len(stack)-1]] < nums[i] {
			idx := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			result[idx] = nums[i]
		}
		stack = append(stack, i)
	}

	return result
}`,
};
