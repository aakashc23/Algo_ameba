import type { AlgoImplementations } from '../algoInfo';

export const inorderImpl: AlgoImplementations = {
  python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder(root):
    if root is None:
        return
    inorder(root.left)
    print(root.val)
    inorder(root.right)`,

  java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public static void inorder(TreeNode root) {
    if (root == null) return;
    inorder(root.left);
    System.out.println(root.val);
    inorder(root.right);
}`,

  cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

void inorder(TreeNode* root) {
    if (root == nullptr) return;
    inorder(root->left);
    cout << root->val << " ";
    inorder(root->right);
}`,

  javascript: `function inorder(root) {
    if (root === null) return;
    inorder(root.left);
    console.log(root.val);
    inorder(root.right);
}`,

  golang: `type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func inorder(root *TreeNode) {
    if root == nil {
        return
    }
    inorder(root.Left)
    fmt.Println(root.Val)
    inorder(root.Right)
}`,
};
