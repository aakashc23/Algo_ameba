import type { AlgoImplementations } from '../algoInfo';

export const stackImpl: AlgoImplementations = {
  python: `class Stack:
    def __init__(self):
        self._data = []

    def push(self, val):
        self._data.append(val)

    def pop(self):
        if self.is_empty():
            raise IndexError("pop from empty stack")
        return self._data.pop()

    def peek(self):
        return self._data[-1]

    def is_empty(self):
        return len(self._data) == 0

    def __len__(self):
        return len(self._data)`,

  java: `import java.util.ArrayDeque;

class Stack<T> {
    private final ArrayDeque<T> data = new ArrayDeque<>();

    public void push(T val)      { data.push(val); }
    public T    pop()            { return data.pop(); }
    public T    peek()           { return data.peek(); }
    public boolean isEmpty()     { return data.isEmpty(); }
    public int  size()           { return data.size(); }
}`,

  cpp: `#include <stack>
#include <stdexcept>
using namespace std;

template<typename T>
class Stack {
    stack<T> s;
public:
    void push(T val)   { s.push(val); }
    T    pop()         { T v = s.top(); s.pop(); return v; }
    T    peek()        { return s.top(); }
    bool isEmpty()     { return s.empty(); }
    int  size()        { return s.size(); }
};`,

  javascript: `class Stack {
  #data = [];

  push(val)    { this.#data.push(val); }
  pop()        { return this.#data.pop(); }
  peek()       { return this.#data.at(-1); }
  isEmpty()    { return this.#data.length === 0; }
  get size()   { return this.#data.length; }
}`,

  golang: `type Stack[T any] struct {
    data []T
}

func (s *Stack[T]) Push(v T) {
    s.data = append(s.data, v)
}

func (s *Stack[T]) Pop() T {
    n := len(s.data) - 1
    v := s.data[n]
    s.data = s.data[:n]
    return v
}

func (s *Stack[T]) Peek() T      { return s.data[len(s.data)-1] }
func (s *Stack[T]) IsEmpty() bool { return len(s.data) == 0 }
func (s *Stack[T]) Size() int     { return len(s.data) }`,
};
