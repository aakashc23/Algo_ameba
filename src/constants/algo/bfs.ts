import type { AlgoImplementations } from '../algoInfo';

export const bfsImpl: AlgoImplementations = {
  python: `from collections import defaultdict, deque

        graph = defaultdict(list)

def add_edge(u, v):
    graph[u].append(v)
    graph[v].append(u)  # omit for directed graph

def bfs(start):
    visited = set([start])
    queue = deque([start])
    while queue:
        node = queue.popleft()
        print(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,

  java: `import java.util.*;

Map<Integer, List<Integer>> graph = new HashMap<>();

public static void bfs(int start, Map<Integer, List<Integer>> graph) {
    Set<Integer> visited = new HashSet<>();
    Queue<Integer> queue = new LinkedList<>();
    visited.add(start);
    queue.offer(start);
    while (!queue.isEmpty()) {
        int node = queue.poll();
        System.out.println(node);
        for (int neighbor : graph.getOrDefault(node, Collections.emptyList())) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.offer(neighbor);
            }
        }
    }
}`,

  cpp: `#include <vector>
#include <queue>
#include <unordered_set>
using namespace std;

vector<vector<int>> graph; // adjacency list

void bfs(int start) {
    unordered_set<int> visited;
    queue<int> q;
    visited.insert(start);
    q.push(start);
    while (!q.empty()) {
        int node = q.front(); q.pop();
        cout << node << " ";
        for (int neighbor : graph[node]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
}`,

  javascript: `const graph = new Map();

function addEdge(u, v) {
    if (!graph.has(u)) graph.set(u, []);
    if (!graph.has(v)) graph.set(v, []);
    graph.get(u).push(v);
    graph.get(v).push(u); // omit for directed graph
}

function bfs(start) {
    const visited = new Set([start]);
    const queue = [start];
    while (queue.length > 0) {
        const node = queue.shift();
        console.log(node);
        for (const neighbor of graph.get(node) || []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
}`,

  golang: `package main

import "fmt"

var graph = map[int][]int{}

func bfs(start int) {
    visited := map[int]bool{start: true}
    queue := []int{start}
    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        fmt.Println(node)
        for _, neighbor := range graph[node] {
            if !visited[neighbor] {
                visited[neighbor] = true
                queue = append(queue, neighbor)
            }
        }
    }
}`,
};
