import type { AlgoImplementations } from '../algoInfo';

export const heapPushImpl: AlgoImplementations = {
  python: `def heappush(heap, value):
    heap.append(value)
    idx = len(heap) - 1
    
    # Sift up
    while idx > 0:
        parent = (idx - 1) // 2
        if heap[idx] < heap[parent]:
            heap[idx], heap[parent] = heap[parent], heap[idx]
            idx = parent
        else:
            break`,
  java: `public static void heapPush(List<Integer> heap, int value) {
    heap.add(value);
    int idx = heap.size() - 1;
    
    // Sift up
    while (idx > 0) {
        int parent = (idx - 1) / 2;
        if (heap.get(idx) < heap.get(parent)) {
            int temp = heap.get(idx);
            heap.set(idx, heap.get(parent));
            heap.set(parent, temp);
            idx = parent;
        } else {
            break;
        }
    }
}`,
  cpp: `#include <vector>
#include <algorithm>

using namespace std;

void heapPush(vector<int>& heap, int value) {
    heap.push_back(value);
    int idx = heap.size() - 1;
    
    // Sift up
    while (idx > 0) {
        int parent = (idx - 1) / 2;
        if (heap[idx] < heap[parent]) {
            swap(heap[idx], heap[parent]);
            idx = parent;
        } else {
            break;
        }
    }
}`,
  javascript: `function heapPush(heap, value) {
    heap.push(value);
    let idx = heap.length - 1;
    
    // Sift up
    while (idx > 0) {
        let parent = Math.floor((idx - 1) / 2);
        if (heap[idx] < heap[parent]) {
            [heap[idx], heap[parent]] = [heap[parent], heap[idx]];
            idx = parent;
        } else {
            break;
        }
    }
}`,
  golang: `func heapPush(heap *[]int, value int) {
	*heap = append(*heap, value)
	idx := len(*heap) - 1
	
	// Sift up
	for idx > 0 {
		parent := (idx - 1) / 2
		if (*heap)[idx] < (*heap)[parent] {
			(*heap)[idx], (*heap)[parent] = (*heap)[parent], (*heap)[idx]
			idx = parent
		} else {
			break
		}
	}
}`,
};
