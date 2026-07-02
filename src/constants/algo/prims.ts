import type { AlgoImplementations } from '../algoInfo';

export const primsImpl: AlgoImplementations = {
  python: `import heapq

def prims(v, adj):
    pq = [(0, 0)] # (weight, node)
    visited = [False] * v
    mst_cost = 0

    while pq:
        w, u = heapq.heappop(pq)
        
        if visited[u]:
            continue
            
        visited[u] = True
        mst_cost += w

        for v, weight in adj[u]:
            if not visited[v]:
                heapq.heappush(pq, (weight, v))

    return mst_cost`,
  java: `import java.util.*;

class Solution {
    public static int prims(int v, List<List<int[]>> adj) {
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        boolean[] visited = new boolean[v];
        int mstCost = 0;

        pq.offer(new int[]{0, 0});

        while (!pq.isEmpty()) {
            int[] edge = pq.poll();
            int w = edge[0], u = edge[1];

            if (visited[u]) continue;

            visited[u] = true;
            mstCost += w;

            for (int[] neighbor : adj.get(u)) {
                if (!visited[neighbor[0]]) {
                    pq.offer(new int[]{neighbor[1], neighbor[0]});
                }
            }
        }

        return mstCost;
    }
}`,
  cpp: `#include <vector>
#include <queue>

using namespace std;

int prims(int v, vector<vector<pair<int, int>>>& adj) {
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<bool> visited(v, false);
    int mstCost = 0;

    pq.push({0, 0});

    while (!pq.empty()) {
        int w = pq.top().first;
        int u = pq.top().second;
        pq.pop();

        if (visited[u]) continue;

        visited[u] = true;
        mstCost += w;

        for (auto& neighbor : adj[u]) {
            if (!visited[neighbor.first]) {
                pq.push({neighbor.second, neighbor.first});
            }
        }
    }

    return mstCost;
}`,
  javascript: `function prims(v, adj) {
    const pq = [[0, 0]]; // [weight, node]
    const visited = new Array(v).fill(false);
    let mstCost = 0;

    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [w, u] = pq.shift();

        if (visited[u]) continue;

        visited[u] = true;
        mstCost += w;

        for (const [neighbor, weight] of adj[u]) {
            if (!visited[neighbor]) {
                pq.push([weight, neighbor]);
            }
        }
    }

    return mstCost;
}`,
  golang: `import (
	"container/heap"
)

type Edge struct { weight, node int }
type PriorityQueue []Edge
func (pq PriorityQueue) Len() int { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool { return pq[i].weight < pq[j].weight }
func (pq PriorityQueue) Swap(i, j int) { pq[i], pq[j] = pq[j], pq[i] }
func (pq *PriorityQueue) Push(x interface{}) { *pq = append(*pq, x.(Edge)) }
func (pq *PriorityQueue) Pop() interface{} {
	old := *pq
	n := len(old)
	item := old[n-1]
	*pq = old[0 : n-1]
	return item
}

func prims(v int, adj [][][2]int) int {
	pq := make(PriorityQueue, 0)
	visited := make([]bool, v)
	mstCost := 0

	heap.Push(&pq, Edge{weight: 0, node: 0})

	for len(pq) > 0 {
		edge := heap.Pop(&pq).(Edge)
		if visited[edge.node] { continue }

		visited[edge.node] = true
		mstCost += edge.weight

		for _, neighbor := range adj[edge.node] {
			if !visited[neighbor[0]] {
				heap.Push(&pq, Edge{weight: neighbor[1], node: neighbor[0]})
			}
		}
	}

	return mstCost
}`,
};
