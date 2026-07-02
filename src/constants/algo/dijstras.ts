import type { AlgoImplementations } from '../algoInfo';

export const dijstrasImpl: AlgoImplementations = {
  python: `import heapq

def dijkstras(adj, src):
    v = len(adj)
    dist = [float('inf')] * v
    dist[src] = 0
    pq = [(0, src)]

    while pq:
        d, node = heapq.heappop(pq)

        if d > dist[node]:
            continue

        for neighbor, weight in adj[node]:
            if dist[node] + weight < dist[neighbor]:
                dist[neighbor] = dist[node] + weight
                heapq.heappush(pq, (dist[neighbor], neighbor))

    return dist`,
  java: `import java.util.*;

public static List<Integer> dijkstras(List<List<int[]>> adj, int src) {
    int v = adj.size();
    int[] dist = new int[v];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;

    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, src});

    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int d = top[0];
        int node = top[1];

        if (d > dist[node]) continue;

        for (int[] edge : adj.get(node)) {
            int neighbor = edge[0];
            int weight = edge[1];

            if (dist[node] + weight < dist[neighbor]) {
                dist[neighbor] = dist[node] + weight;
                pq.offer(new int[]{dist[neighbor], neighbor});
            }
        }
    }

    List<Integer> ans = new ArrayList<>();
    for (int x : dist) ans.add(x);
    return ans;
}`,
  cpp: `#include <vector>
#include <queue>

using namespace std;

vector<int> dijkstras(int v, vector<vector<pair<int, int>>>& adj, int src) {
    vector<int> dist(v, 1e9);
    dist[src] = 0;
    
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    pq.push({0, src});
    
    while (!pq.empty()) {
        int d = pq.top().first;
        int node = pq.top().second;
        pq.pop();
        
        if (d > dist[node]) continue;
        
        for (auto& edge : adj[node]) {
            int neighbor = edge.first;
            int weight = edge.second;
            
            if (dist[node] + weight < dist[neighbor]) {
                dist[neighbor] = dist[node] + weight;
                pq.push({dist[neighbor], neighbor});
            }
        }
    }
    
    return dist;
}`,
  javascript: `function dijkstras(adj, src) {
    const v = adj.length;
    const dist = new Array(v).fill(Infinity);
    dist[src] = 0;
    
    // For optimal performance, a real MinHeap should be used
    const pq = [[0, src]];
    
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [d, node] = pq.shift();
        
        if (d > dist[node]) continue;
        
        for (const [neighbor, weight] of adj[node]) {
            if (dist[node] + weight < dist[neighbor]) {
                dist[neighbor] = dist[node] + weight;
                pq.push([dist[neighbor], neighbor]);
            }
        }
    }
    
    return dist;
}`,
  golang: `import (
	"container/heap"
	"math"
)

type Item struct { node, dist int }
type PriorityQueue []*Item
func (pq PriorityQueue) Len() int { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool { return pq[i].dist < pq[j].dist }
func (pq PriorityQueue) Swap(i, j int) { pq[i], pq[j] = pq[j], pq[i] }
func (pq *PriorityQueue) Push(x interface{}) { *pq = append(*pq, x.(*Item)) }
func (pq *PriorityQueue) Pop() interface{} {
	old := *pq
	n := len(old)
	item := old[n-1]
	*pq = old[0 : n-1]
	return item
}

func dijkstras(v int, adj [][][2]int, src int) []int {
	dist := make([]int, v)
	for i := range dist {
		dist[i] = math.MaxInt32
	}
	dist[src] = 0

	pq := make(PriorityQueue, 0)
	heap.Push(&pq, &Item{node: src, dist: 0})

	for len(pq) > 0 {
		top := heap.Pop(&pq).(*Item)
		d, node := top.dist, top.node

		if d > dist[node] {
			continue
		}

		for _, edge := range adj[node] {
			neighbor, weight := edge[0], edge[1]
			if dist[node]+weight < dist[neighbor] {
				dist[neighbor] = dist[node] + weight
				heap.Push(&pq, &Item{node: neighbor, dist: dist[neighbor]})
			}
		}
	}
	return dist
}`,
};
