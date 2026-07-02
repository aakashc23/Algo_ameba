import type { AlgoImplementations } from '../algoInfo';

export const preorderImpl: AlgoImplementations = {
  python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def preorder(root):
    if root is None:
        return
    print(root.val)      # visit root first
    preorder(root.left)
    preorder(root.right)`,

  java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public static void preorder(TreeNode root) {
    if (root == null) return;
    System.out.println(root.val);  // visit root first
    preorder(root.left);
    preorder(root.right);
}`,

  cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

void preorder(TreeNode* root) {
    if (root == nullptr) return;
    cout << root->val << " ";  // visit root first
    preorder(root->left);
    preorder(root->right);
}`,

  javascript: `function preorder(root) {
    if (root === null) return;
    console.log(root.val);   // visit root first
    preorder(root.left);
    preorder(root.right);
}`,

  golang: `type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func preorder(root *TreeNode) {
    if root == nil {
        return
    }
    fmt.Println(root.Val)   // visit root first
    preorder(root.Left)
    preorder(root.Right)
}`,
};
