import type { AlgoImplementations } from '../algoInfo';

export const queueImpl: AlgoImplementations = {
  python: `from collections import deque

class Queue:
    def __init__(self):
        self._data = deque()

    def enqueue(self, val):
        self._data.append(val)

    def dequeue(self):
        if self.is_empty():
            raise IndexError("dequeue from empty queue")
        return self._data.popleft()

    def front(self):
        return self._data[0]

    def is_empty(self):
        return len(self._data) == 0

    def __len__(self):
        return len(self._data)`,

  java: `import java.util.LinkedList;
import java.util.Queue;

Queue<Integer> q = new LinkedList<>();
q.offer(10);           // enqueue
int front = q.peek();  // front
q.poll();              // dequeue
boolean empty = q.isEmpty();`,

  cpp: `#include <queue>
using namespace std;

template<typename T>
class Queue {
    queue<T> q;
public:
    void enqueue(T val) { q.push(val); }
    T    dequeue()      { T v = q.front(); q.pop(); return v; }
    T    front()        { return q.front(); }
    bool isEmpty()      { return q.empty(); }
    int  size()         { return q.size(); }
};`,

  javascript: `class Queue {
  #data = [];

  enqueue(val)  { this.#data.push(val); }
  dequeue()     { return this.#data.shift(); }
  front()       { return this.#data[0]; }
  isEmpty()     { return this.#data.length === 0; }
  get size()    { return this.#data.length; }
}`,

  golang: `type Queue[T any] struct {
    data []T
}

func (q *Queue[T]) Enqueue(v T) {
    q.data = append(q.data, v)
}

func (q *Queue[T]) Dequeue() T {
    v := q.data[0]
    q.data = q.data[1:]
    return v
}

func (q *Queue[T]) Front() T      { return q.data[0] }
func (q *Queue[T]) IsEmpty() bool  { return len(q.data) == 0 }
func (q *Queue[T]) Size() int      { return len(q.data) }`,
};
