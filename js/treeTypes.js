// Binary Tree Implementation (level-order insertion)
function createBinaryTree(arr) {
    console.log("Creating Binary Tree with", arr.length, "nodes");
    if (!arr || arr.length === 0) {
        console.warn("Empty array for Binary Tree");
        return;
    }
    
    // Start with the first node as root
    const rootNode = arr[0];
    console.log("Binary Tree root:", rootNode.value);
    
    let queue = [rootNode]; // Start with the root
    let i = 1; // Start from the second element
    
    while (i < arr.length) {
        let current = queue.shift();
        if (!current) {
            console.warn("Queue empty before processing all nodes");
            break;
        }
        
        // Add left child
        if (i < arr.length) {
            console.log("Processing left child at index", i, ":", arr[i].value);
            if (arr[i].value !== "null") {
                current.left = arr[i];
                arr[i].parent = current;
                arr[i].isLeft = true;
                queue.push(arr[i]);
            }
            i++;
        }
        
        // Add right child
        if (i < arr.length) {
            console.log("Processing right child at index", i, ":", arr[i].value);
            if (arr[i].value !== "null") {
                current.right = arr[i];
                arr[i].parent = current;
                arr[i].isRight = true;
                queue.push(arr[i]);
            }
            i++;
        }
    }
    
    // Prepare the tree for visualization by setting up children array
    createData(rootNode);
    
    // Draw the tree
    try {
        drawGraph(arr);
        console.log("Binary Tree drawing complete");
    } catch (error) {
        console.error("Error drawing Binary Tree:", error);
    }
}

// Graph Implementation
function createGraph(arr) {
    console.log("Creating Graph with input:", arr.map(n => n.value));
    if (!arr || arr.length === 0) {
        console.warn("Empty array for Graph");
        return;
    }
    
    const isWeighted = getGraphWeightType() === 'weighted';
    const isDirected = getGraphDirectionType() === 'directed';
    console.log("Graph type:", isWeighted ? "Weighted" : "Unweighted", isDirected ? "Directed" : "Undirected");
    
    // Create nodes dictionary and track all components
    let nodes = {};
    let allNodes = [];
    let edges = [];
    let components = []; // Track separate components
    
    try {
        // First pass: Parse input and create nodes/edges
        for (let i = 0; i < arr.length; i++) {
            const input = arr[i].value.trim();
            
            if (input.includes(',')) {
                // Parse edge: source,target or source,target,weight
                let parts = input.split(',');
                let source = parts[0].trim();
                let target = parts[1].trim();
                let weight = isWeighted && parts[2] ? parts[2].trim() : '1';
                
                console.log("Processing edge:", source, "->", target, isWeighted ? `(weight: ${weight})` : "", isDirected ? "(directed)" : "(undirected)");
                
                // Create nodes if they don't exist
                if (!nodes[source]) {
                    nodes[source] = new Node(source, null, null);
                    allNodes.push(nodes[source]);
                }
                if (!nodes[target]) {
                    nodes[target] = new Node(target, null, null);
                    allNodes.push(nodes[target]);
                }
                
                // Store edge information
                edges.push({
                    source: source,
                    target: target,
                    weight: weight,
                    sourceNode: nodes[source],
                    targetNode: nodes[target],
                    isDirected: isDirected
                });
                
                // Add target as a child of source (for tree structure)
                if (!nodes[source].children.some(child => child.value === target)) {
                    nodes[source].children.push(nodes[target]);
                }
                
                // For undirected graphs, add reverse edge in visualization
                if (!isDirected && !nodes[target].children.some(child => child.value === source)) {
                    nodes[target].children.push(nodes[source]);
                }
                
            } else if (input) {
                // Handle single nodes without connections
                if (!nodes[input]) {
                    console.log("Adding standalone node:", input);
                    nodes[input] = new Node(input, null, null);
                    allNodes.push(nodes[input]);
                }
            }
        }
        
        // Find connected components
        let visited = new Set();
        
        for (let node of allNodes) {
            if (!visited.has(node.value)) {
                let component = [];
                dfsComponent(node, visited, component, nodes, isDirected);
                if (component.length > 0) {
                    components.push(component);
                }
            }
        }
        
        console.log("Found", components.length, "connected components:");
        components.forEach((comp, index) => {
            console.log(`Component ${index + 1}:`, comp.map(n => n.value));
        });
        
        // Draw all components
        if (allNodes.length > 0) {
            console.log("Drawing graph with", allNodes.length, "nodes and", edges.length, "edges");
            drawGraphWithComponents(components, edges, isWeighted, isDirected);
            console.log("Graph drawing complete");
        } else {
            console.warn("No nodes to draw in graph");
        }
    } catch (error) {
        console.error("Error creating or drawing graph:", error);
    }
}

// Helper function for DFS to find connected components
function dfsComponent(node, visited, component, nodes, isDirected) {
    if (visited.has(node.value)) return;
    
    visited.add(node.value);
    component.push(node);
    
    // Visit all children (connected nodes)
    for (let child of node.children) {
        if (!visited.has(child.value)) {
            dfsComponent(child, visited, component, nodes, isDirected);
        }
    }
}

// Event listener for tree type changes
document.addEventListener('DOMContentLoaded', function() {
    console.log("Setting up tree type listeners");
    const radioButtons = document.querySelectorAll('input[name="tree-type"]');
    const graphWeightButtons = document.querySelectorAll('input[name="graph-weight"]');
    const textarea = document.getElementById('inp');
    const graphOptions = document.getElementById('graph-options');
    
    // Update placeholder text and show/hide graph options
    function updatePlaceholder() {
        const treeType = getTreeType();
        const isWeighted = getGraphWeightType() === 'weighted';
        console.log("Tree type changed to:", treeType);
        
        if (treeType === 'bst') {
            textarea.placeholder = 'Enter values separated by space. The root is the first element.\nYou can use "null" to represent empty nodes.\nEx: 10 5 15 null 7 null 20';
            graphOptions.style.display = 'none';
        } else if (treeType === 'bt') {
            textarea.placeholder = 'Enter values separated by space in level order (breadth-first).\nYou can use "null" to represent empty nodes.\nEx: 10 5 15 null 7 null 20';
            graphOptions.style.display = 'none';
        } else if (treeType === 'graph') {
            if (isWeighted) {
                textarea.placeholder = 'Enter weighted edges: source,target,weight\nEx: A,B,5 A,C,3 B,D,2 C,E,4\nFor standalone nodes: F G H';
            } else {
                textarea.placeholder = 'Enter unweighted edges: source,target\nEx: A,B A,C B,D C,E\nFor standalone nodes: F G H';
            }
            graphOptions.style.display = 'flex';
        }
        
        // Clear current visualization if the type changes
        if (textarea.value) {
            action();
        }
    }
    
    // Add event listeners to all radio buttons
    radioButtons.forEach(button => {
        button.addEventListener('change', updatePlaceholder);
    });
    
    graphWeightButtons.forEach(button => {
        button.addEventListener('change', updatePlaceholder);
    });
    
    // Initialize with the default selection
    updatePlaceholder();
});
