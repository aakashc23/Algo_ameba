import type { AlgoImplementations } from '../algoInfo';

export const kruskalsImpl: AlgoImplementations = {
  python: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, i):
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]

    def union(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            if self.rank[root_i] < self.rank[root_j]:
                self.parent[root_i] = root_j
            elif self.rank[root_i] > self.rank[root_j]:
                self.parent[root_j] = root_i
            else:
                self.parent[root_j] = root_i
                self.rank[root_i] += 1

def kruskals(v, edges):
    uf = UnionFind(v)
    mst_cost = 0
    # edges = [(weight, u, v)]
    edges.sort()

    for w, u, v in edges:
        if uf.find(u) != uf.find(v):
            uf.union(u, v)
            mst_cost += w

    return mst_cost`,
  java: `import java.util.*;

class Solution {
    static class UnionFind {
        int[] parent;
        int[] rank;

        public UnionFind(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
        }

        public int find(int i) {
            if (parent[i] == i) return i;
            return parent[i] = find(parent[i]);
        }

        public void union(int i, int j) {
            int rootI = find(i);
            int rootJ = find(j);
            if (rootI != rootJ) {
                if (rank[rootI] < rank[rootJ]) {
                    parent[rootI] = rootJ;
                } else if (rank[rootI] > rank[rootJ]) {
                    parent[rootJ] = rootI;
                } else {
                    parent[rootJ] = rootI;
                    rank[rootI]++;
                }
            }
        }
    }

    public static int kruskals(int v, List<int[]> edges) {
        UnionFind uf = new UnionFind(v);
        int mstCost = 0;
        
        // edges = [u, v, weight]
        Collections.sort(edges, (a, b) -> a[2] - b[2]);

        for (int[] edge : edges) {
            if (uf.find(edge[0]) != uf.find(edge[1])) {
                uf.union(edge[0], edge[1]);
                mstCost += edge[2];
            }
        }

        return mstCost;
    }
}`,
  cpp: `#include <vector>
#include <algorithm>

using namespace std;

class UnionFind {
    vector<int> parent, rank;
public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
    
    void unite(int i, int j) {
        int rootI = find(i);
        int rootJ = find(j);
        if (rootI != rootJ) {
            if (rank[rootI] < rank[rootJ]) {
                parent[rootI] = rootJ;
            } else if (rank[rootI] > rank[rootJ]) {
                parent[rootJ] = rootI;
            } else {
                parent[rootJ] = rootI;
                rank[rootI]++;
            }
        }
    }
};

int kruskals(int v, vector<vector<int>>& edges) {
    UnionFind uf(v);
    int mstCost = 0;
    
    // edges = {u, v, weight}
    sort(edges.begin(), edges.end(), [](const vector<int>& a, const vector<int>& b) {
        return a[2] < b[2];
    });
    
    for (auto& edge : edges) {
        if (uf.find(edge[0]) != uf.find(edge[1])) {
            uf.unite(edge[0], edge[1]);
            mstCost += edge[2];
        }
    }
    
    return mstCost;
}`,
  javascript: `class UnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }

    find(i) {
        if (this.parent[i] === i) return i;
        return this.parent[i] = this.find(this.parent[i]);
    }

    union(i, j) {
        let rootI = this.find(i);
        let rootJ = this.find(j);
        if (rootI !== rootJ) {
            if (this.rank[rootI] < this.rank[rootJ]) {
                this.parent[rootI] = rootJ;
            } else if (this.rank[rootI] > this.rank[rootJ]) {
                this.parent[rootJ] = rootI;
            } else {
                this.parent[rootJ] = rootI;
                this.rank[rootI]++;
            }
        }
    }
}

function kruskals(v, edges) {
    const uf = new UnionFind(v);
    let mstCost = 0;
    
    // edges = [u, v, weight]
    edges.sort((a, b) => a[2] - b[2]);

    for (const [u, v, weight] of edges) {
        if (uf.find(u) !== uf.find(v)) {
            uf.union(u, v);
            mstCost += weight;
        }
    }

    return mstCost;
}`,
  golang: `import "sort"

type UnionFind struct {
	parent []int
	rank   []int
}

func NewUnionFind(n int) *UnionFind {
	uf := &UnionFind{
		parent: make([]int, n),
		rank:   make([]int, n),
	}
	for i := range uf.parent {
		uf.parent[i] = i
	}
	return uf
}

func (uf *UnionFind) Find(i int) int {
	if uf.parent[i] == i {
		return i
	}
	uf.parent[i] = uf.Find(uf.parent[i])
	return uf.parent[i]
}

func (uf *UnionFind) Union(i, j int) {
	rootI := uf.Find(i)
	rootJ := uf.Find(j)
	if rootI != rootJ {
		if uf.rank[rootI] < uf.rank[rootJ] {
			uf.parent[rootI] = rootJ
		} else if uf.rank[rootI] > uf.rank[rootJ] {
			uf.parent[rootJ] = rootI
		} else {
			uf.parent[rootJ] = rootI
			uf.rank[rootI]++
		}
	}
}

func kruskals(v int, edges [][]int) int {
	uf := NewUnionFind(v)
	mstCost := 0

	// edges = []int{u, v, weight}
	sort.Slice(edges, func(i, j int) bool {
		return edges[i][2] < edges[j][2]
	})

	for _, edge := range edges {
		u, v, weight := edge[0], edge[1], edge[2]
		if uf.Find(u) != uf.Find(v) {
			uf.Union(u, v)
			mstCost += weight
		}
	}

	return mstCost
}`,
};
