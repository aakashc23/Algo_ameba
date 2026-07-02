import type { AlgoImplementations } from '../algoInfo';

export const postorderImpl: AlgoImplementations = {
  python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def postorder(root):
    if root is None:
        return
    postorder(root.left)
    postorder(root.right)
    print(root.val)      # visit root last`,

  java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public static void postorder(TreeNode root) {
    if (root == null) return;
    postorder(root.left);
    postorder(root.right);
    System.out.println(root.val);  // visit root last
}`,

  cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

void postorder(TreeNode* root) {
    if (root == nullptr) return;
    postorder(root->left);
    postorder(root->right);
    cout << root->val << " ";  // visit root last
}`,

  javascript: `function postorder(root) {
    if (root === null) return;
    postorder(root.left);
    postorder(root.right);
    console.log(root.val);   // visit root last
}`,

  golang: `type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func postorder(root *TreeNode) {
    if root == nil {
        return
    }
    postorder(root.Left)
    postorder(root.Right)
    fmt.Println(root.Val)   // visit root last
}`,
};
