import type { AlgoImplementations } from '../algoInfo';

export const heapPopImpl: AlgoImplementations = {
  python: `def heappop(heap):
    if not heap: return None
    if len(heap) == 1: return heap.pop()
        
    val = heap[0]
    heap[0] = heap.pop()
    idx = 0
    
    
    while True:
        l = 2 * idx + 1
        r = 2 * idx + 2
        smallest = idx

        if l < len(heap) and heap[l] < heap[smallest]: smallest = l
        if r < len(heap) and heap[r] < heap[smallest]: smallest = r
        if smallest == idx: break

        heap[idx], heap[smallest] = heap[smallest], heap[idx]
        idx = smallest
        
    return val`,
  java: `public static Integer heapPop(List<Integer> heap) {
    if (heap.isEmpty()) return null;
    if (heap.size() == 1) return heap.remove(heap.size() - 1);

    int val = heap.get(0);
    heap.set(0, heap.remove(heap.size() - 1));
    int idx = 0;

    // Sift down
    while (true) {
        int l = 2 * idx + 1;
        int r = 2 * idx + 2;
        int smallest = idx;

        if (l < heap.size() && heap.get(l) < heap.get(smallest)) smallest = l;
        if (r < heap.size() && heap.get(r) < heap.get(smallest)) smallest = r;
        if (smallest == idx) break;

        int temp = heap.get(idx);
        heap.set(idx, heap.get(smallest));
        heap.set(smallest, temp);
        idx = smallest;
    }
    return val;
}`,
  cpp: `#include <vector>
#include <algorithm>
#include <stdexcept>

using namespace std;

int heapPop(vector<int>& heap) {
    if (heap.empty()) throw runtime_error("Heap is empty");
    if (heap.size() == 1) {
        int val = heap.back();
        heap.pop_back();
        return val;
    }
    
    int val = heap[0];
    heap[0] = heap.back();
    heap.pop_back();
    int idx = 0;
    
    // Sift down
    while (true) {
        int l = 2 * idx + 1;
        int r = 2 * idx + 2;
        int smallest = idx;
        
        if (l < heap.size() && heap[l] < heap[smallest]) smallest = l;
        if (r < heap.size() && heap[r] < heap[smallest]) smallest = r;
        if (smallest == idx) break;
        
        swap(heap[idx], heap[smallest]);
        idx = smallest;
    }
    return val;
}`,
  javascript: `function heapPop(heap) {
    if (heap.length === 0) return null;
    if (heap.length === 1) return heap.pop();
    
    const val = heap[0];
    heap[0] = heap.pop();
    let idx = 0;
    
    // Sift down
    while (true) {
        const l = 2 * idx + 1;
        const r = 2 * idx + 2;
        let smallest = idx;
        
        if (l < heap.length && heap[l] < heap[smallest]) smallest = l;
        if (r < heap.length && heap[r] < heap[smallest]) smallest = r;
        if (smallest === idx) break;
        
        [heap[idx], heap[smallest]] = [heap[smallest], heap[idx]];
        idx = smallest;
    }
    return val;
}`,
  golang: `func heapPop(heap *[]int) (int, bool) {
	if len(*heap) == 0 { return 0, false }
	if len(*heap) == 1 {
		val := (*heap)[0]
		*heap = (*heap)[:0]
		return val, true
	}

	val := (*heap)[0]
	lastIdx := len(*heap) - 1
	(*heap)[0] = (*heap)[lastIdx]
	*heap = (*heap)[:lastIdx]
	idx := 0
	
	// Sift down
	for {
		l := 2*idx + 1
		r := 2*idx + 2
		smallest := idx

		if l < len(*heap) && (*heap)[l] < (*heap)[smallest] { smallest = l }
		if r < len(*heap) && (*heap)[r] < (*heap)[smallest] { smallest = r }
		if smallest == idx { break }

		(*heap)[idx], (*heap)[smallest] = (*heap)[smallest], (*heap)[idx]
		idx = smallest
	}
	return val, true
}`,
};
