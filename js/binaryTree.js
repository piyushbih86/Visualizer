function Node(value, left, right, parent = "", children = []) {
    this.value = value;
    this.right = right;
    this.left = left;
    this.parent = parent;
    this.children = children;
    this.isRight = null;
    this.isLeft = null;
}

// Function to determine the current tree type
function getTreeType() {
    const radios = document.getElementsByName('tree-type');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return 'bst'; // Default to BST
}

// Function to determine if graph is weighted
function getGraphWeightType() {
    const radios = document.getElementsByName('graph-weight');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return 'unweighted'; // Default to unweighted
}

// Function to determine if graph is directed
function getGraphDirectionType() {
    const radios = document.getElementsByName('graph-direction');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return 'undirected'; // Default to undirected
}

function createTree(arr) {
    const treeType = getTreeType();
    console.log("Creating tree of type:", treeType, "with", arr.length, "nodes");
    
    if (!arr || arr.length === 0) {
        console.warn("No nodes to create tree");
        return;
    }
    
    // Remove any existing tree/graph visualization
    remove();
    
    try {
        if (treeType === 'bst') {
            createBST(arr);
        } else if (treeType === 'bt') {
            createBinaryTree(arr);
        } else if (treeType === 'graph') {
            createGraph(arr);
        } else {
            console.error("Unknown tree type:", treeType);
        }
    } catch (error) {
        console.error("Error creating tree:", error);
    }
}

// Binary Search Tree Implementation
function createBST(arr) {
    console.log("Creating BST with", arr.length, "nodes");
    
    if (!arr || arr.length === 0) {
        console.warn("Empty array for BST");
        return;
    }
    
    // Start with the first node as root
    const rootNode = arr[0];
    console.log("BST root:", rootNode.value);
    
    // Insert the rest of the nodes into the BST
    for (var i = 1; i < arr.length; i++) {
        console.log("Inserting node:", arr[i].value);
        nodeDirectionBST(rootNode, arr[i]);
    }

    // Prepare the tree for visualization by setting up children array
    createData(rootNode);
    
    // Draw the tree
    try {
        drawGraph(arr);
        console.log("BST drawing complete");
    } catch (error) {
        console.error("Error drawing BST:", error);
    }
}

function nodeDirectionBST(root, node) {
    // Safety check
    if (!root || !node) {
        console.error("Invalid root or node:", root, node);
        return;
    }
    
    // If node value is "null", we still want to insert it in the right place
    // but allow the tree to decide where it goes
    var a = node.value === "null" ? (root.left === null ? -1 : 1) : Number(node.value);
    var b = Number(root.value);
    
    // Handle NaN values
    if (isNaN(b)) {
        b = 0; // Default value for non-numeric roots
    }
    
    if (isNaN(a) && node.value !== "null") {
        a = node.value.toString().localeCompare(root.value.toString());
    }
    
    if (a < b) {
        if (root.left == null) {
            root.left = node;
            node.isLeft = true;
        } else {
            nodeDirectionBST(root.left, node);
        }
    } else if (a > b) {
        if (root.right == null) {
            root.right = node;
            node.isRight = true
        } else {
            nodeDirectionBST(root.right, node);
        }
    } else {
        // If values are equal, default to right
        if (root.right == null) {
            root.right = node;
            node.isRight = true
        } else {
            nodeDirectionBST(root.right, node);
        }
    }
}

function createData(node) {

    if (node == null) { return }

    if (node.left) {
        node.children.push(node.left);
        node.left.parent = node;
        if(!node.right){
            let newNode = new Node("Empty",null,null)
            newNode.isRight = true
            node.children.push(newNode);
            newNode.parent = node            
        }

    }

    if (node.right) {
        node.children.push(node.right);
        node.right.parent = node;
        if(!node.left){
            let newNode = new Node("Empty",null,null)
            newNode.isLeft = true
            node.children.unshift(newNode);
            newNode.parent = node
        }
    }

    createData(node.left);
    createData(node.right);

}

function createNodes(list) {
    const treeType = getTreeType();
    console.log("=== CREATE NODES START ===");
    console.log("Creating nodes for tree type:", treeType);
    console.log("Input list:", list);
    
    if (!list || list.length === 0) {
        console.warn("Empty list provided to createNodes");
        return [];
    }
    
    new_list = [];

    if (treeType === 'graph') {
        // For graph, keep the original format
        for (var i = 0; i < list.length; i++) {
            if (list[i] == "") { continue }
            new_list.push(new Node(list[i], null, null));
        }
    } else {
        // For trees, convert to numbers where possible
        for (var i = 0; i < list.length; i++) {
            if (list[i] == "") { continue }
            if (list[i].toLowerCase() === "null") {
                new_list.push(new Node("null", null, null));
            } else {
                new_list.push(new Node(list[i], null, null));
            }
        }
    }

    console.log("Node list created with", new_list.length, "nodes:", new_list);
    
    if (new_list.length > 0) {
        // Call createTree to build the structure and render it
        console.log("Calling createTree...");
        createTree(new_list);
        document.querySelector(".btn").disabled = false;
        console.log("=== CREATE NODES COMPLETE ===");
    } else {
        console.warn("No valid nodes created");
        document.querySelector(".btn").disabled = true;
    }

    return new_list;
}