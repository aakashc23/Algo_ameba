import type { AlgoImplementations } from '../algoInfo';

export const dfsImpl: AlgoImplementations = {
  python: `from collections import defaultdict

graph = defaultdict(list)

def add_edge(u, v):
    graph[u].append(v)
    graph[v].append(u)  # omit for directed graph

def dfs(node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    print(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(neighbor, visited)`,

  java: `import java.util.*;

Map<Integer, List<Integer>> graph = new HashMap<>();

public static void dfs(int node, Set<Integer> visited, Map<Integer, List<Integer>> graph) {
    visited.add(node);
    System.out.println(node);
    for (int neighbor : graph.getOrDefault(node, Collections.emptyList())) {
        if (!visited.contains(neighbor)) {
            dfs(neighbor, visited, graph);
        }
    }
}

// Usage:
// Set<Integer> visited = new HashSet<>();
// dfs(startNode, visited, graph);`,

  cpp: `#include <vector>
#include <unordered_set>
using namespace std;

vector<vector<int>> graph; // adjacency list

void dfs(int node, unordered_set<int>& visited) {
    visited.insert(node);
    cout << node << " ";
    for (int neighbor : graph[node]) {
        if (visited.find(neighbor) == visited.end()) {
            dfs(neighbor, visited);
        }
    }
}

// Usage:
// unordered_set<int> visited;
// dfs(startNode, visited);`,

  javascript: `const graph = new Map();

function addEdge(u, v) {
    if (!graph.has(u)) graph.set(u, []);
    if (!graph.has(v)) graph.set(v, []);
    graph.get(u).push(v);
    graph.get(v).push(u); // omit for directed graph
}

function dfs(node, visited = new Set()) {
    visited.add(node);
    console.log(node);
    for (const neighbor of graph.get(node) || []) {
        if (!visited.has(neighbor)) {
            dfs(neighbor, visited);
        }
    }
}`,

  golang: `package main

import "fmt"

var graph = map[int][]int{}

func dfs(node int, visited map[int]bool) {
    visited[node] = true
    fmt.Println(node)
    for _, neighbor := range graph[node] {
        if !visited[neighbor] {
            dfs(neighbor, visited)
        }
    }
}

// Usage:
// visited := map[int]bool{}
// dfs(startNode, visited)`,
};
