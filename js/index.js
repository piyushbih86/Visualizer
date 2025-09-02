const output = document.getElementById("tree");

function validateTreeInput(arr, treeType) {
    // TEMPORARILY DISABLED - Allow everything through
    return { valid: true, message: "" };
    
    // Very minimal validation - only catch obvious errors
    if (!arr || arr.length === 0) {
        return { valid: false, message: "Input cannot be empty" };
    }
    
    // Only check if root is null - everything else is allowed
    if (arr[0] === "null") {
        return { valid: false, message: "Root node cannot be null" };
    }
    
    // Let everything else pass through - users can experiment freely
    return { valid: true, message: "" };
}

function showError(message) {
    // Clear the tree area
    const treeElement = document.getElementById("tree");
    treeElement.innerHTML = `
        <div class="flex items-center justify-center h-full">
            <div class="text-center p-6 max-w-md">
                <div class="text-6xl mb-4">⚠️</div>
                <h3 class="text-xl font-semibold text-red-400 mb-2">Invalid Tree Input</h3>
                <p class="text-gray-300 mb-4 text-sm leading-relaxed">${message}</p>
                <div class="space-y-2">
                    <button onclick="clearInput()" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                        Clear Input
                    </button>
                    <button onclick="showExamples()" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors ml-2">
                        Show Examples
                    </button>
                </div>
            </div>
        </div>
    `;
}

function showExamples() {
    const treeType = getTreeType();
    let examples = "";
    
    if (treeType === 'bt') {
        examples = `
            <div class="text-left space-y-2">
                <p class="font-semibold text-blue-400">Valid Binary Tree Examples:</p>
                <p class="font-mono text-sm bg-gray-700 p-2 rounded">1 2 3 null 4 5 null</p>
                <p class="font-mono text-sm bg-gray-700 p-2 rounded">10 5 15 null 7</p>
                <p class="font-mono text-sm bg-gray-700 p-2 rounded">1 2 3 4 5 6 7</p>
            </div>
        `;
    } else if (treeType === 'bst') {
        examples = `
            <div class="text-left space-y-2">
                <p class="font-semibold text-blue-400">Valid BST Examples:</p>
                <p class="font-mono text-sm bg-gray-700 p-2 rounded">10 5 15 3 7 12 18</p>
                <p class="font-mono text-sm bg-gray-700 p-2 rounded">50 30 70 20 40 60 80</p>
                <p class="font-mono text-sm bg-gray-700 p-2 rounded">8 3 10 1 6 null 14</p>
            </div>
        `;
    }
    
    const treeElement = document.getElementById("tree");
    treeElement.innerHTML = `
        <div class="flex items-center justify-center h-full">
            <div class="text-center p-6 max-w-lg">
                <div class="text-6xl mb-4">💡</div>
                <h3 class="text-xl font-semibold text-blue-400 mb-4">Example Inputs</h3>
                ${examples}
                <button onclick="clearInput()" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors mt-4">
                    Got it!
                </button>
            </div>
        </div>
    `;
}

function clearInput() {
    document.getElementById("inp").value = "";
    const treeElement = document.getElementById("tree");
    treeElement.innerHTML = `
        <div class="absolute inset-0 flex items-center justify-center text-white/50">
            <div class="text-center">
                <div class="text-6xl mb-4">🌳</div>
                <p class="text-lg">Enter values to build your Tree</p>
            </div>
        </div>
    `;
}

function getInput() {
    const treeType = getTreeType();
    const value = document.getElementById("inp").value;
    var arr = value.split(" ").filter(item => item.trim() !== ""); // Filter out empty strings
    var num = [];

    console.log("Raw input array:", arr);

    if (treeType === 'graph') {
        // For graph, accept any values including edge definitions like "A,B"
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] && arr[i] != "\n") {
                num.push(arr[i]);
            }
        }
    } else {
        // For BST and BT - get the APPLIED custom null value (with confirmation)
        const nullValueElement = document.getElementById("nullValue");
        const nullStatus = document.getElementById("nullStatus");
        
        // Check if null value is applied (green status) or pending (yellow status)
        let customNull = "null"; // default
        if (nullStatus && nullStatus.className.includes('green')) {
            // Only use custom null if it's been applied (green status)
            customNull = nullValueElement ? nullValueElement.value.trim() : "null";
        }
        
        console.log("Using null value:", customNull);
        
        for (var i = 0; i < arr.length; i++) {
            // Check for custom null value first (exact match, then case-insensitive)
            if (arr[i] === customNull || arr[i].toLowerCase() === customNull.toLowerCase()) {
                num.push("null");
            }
            // Accept numbers only if they're not the custom null value
            else if (!isNaN(arr[i]) && arr[i] != "\n") {
                num.push(arr[i]);
            }
        }
    }
    console.log("Parsed input:", num); // Debug line
    return num;
}

function action() {
    try {
        console.clear(); // Clear previous logs
        console.log("=== ACTION TRIGGERED ===");
        console.log("Action triggered - rebuilding tree/graph");
        
        // Skip validation completely for now
        // const inputData = getInput();
        // const treeType = getTreeType();
        // const validation = validateTreeInput(inputData, treeType);
        // if (!validation.valid) {
        //     showError(validation.message);
        //     return;
        // }
        
        // Force cleanup of any existing diagram
        remove();
        console.log("Removed existing diagrams");
        
        // Get input and build tree
        const root = getRoot();
        console.log("Root created:", root);
        
        // Set up mouse wheel zoom
        const el = document.querySelector('#tree');
        if (el) {
            el.onwheel = zoom;
        }
        console.log("=== ACTION COMPLETE ===");
    } catch (error) {
        console.error("Error in action function:", error);
        console.error("Error stack:", error.stack);
        // Don't show error to user - just log it and try to continue
    }
}

function getRoot() {
    console.log("Getting input and creating tree/graph");
    var result = getInput();
    console.log("Input processed:", result);
    
    if (result.length === 0) {
        console.warn("No valid input detected");
        return null;
    }

    var nodes = createNodes(result);
    console.log("Nodes created:", nodes);
    return nodes;
}

var tree = document.getElementById("tree");
var starty, startx, scrleft, scrtop, isdown;

//Mouse interaction for dragging functionality
tree.addEventListener('mousedown', e => MouseDown(e));
tree.addEventListener('mouseup', e => mouseUp(e))
tree.addEventListener('mouseleave', e => mouseLeave(e));
tree.addEventListener('mousemove', e => mouseMove(e));

function MouseDown(e) {
    isdown = true;
    startx = e.pageX - tree.offsetLeft;
    starty = e.pageY - tree.offsetTop;
    scrleft = tree.scrollLeft;
    scrtop = tree.scrollTop;
}

function mouseUp(e) {
    isdown = false;
}

function mouseLeave(e) {
    isdown = false;
}

function mouseMove(e) {
    if (isdown) {
        e.preventDefault();

        var y = e.pageY - tree.offsetTop;
        var goY = y - starty;
        tree.scrollTop = scrtop - goY;

        var x = e.pageX - tree.offsetLeft;
        var goX = x - startx;
        tree.scrollLeft = scrleft - goX;
    }
}
let scale = 1;

//https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
function zoom(event) {
    const el = document.querySelector('svg');

    event.preventDefault();

    scale += event.deltaY * -0.001;

    // Restrict scale
    scale = Math.min(Math.max(.250, scale), 1);

    // Apply scale transform
    el.style.transform = `scale(${scale})`;
}

function clear(el) {
    var allContainers = document.querySelectorAll(".numContainer")
    var inp = document.getElementById("inp")

    inp.value += ''

    allContainers.forEach(item => {
        if (item != el) {
            item.style.transform = "scale(0.9)"
            item.style.opacity = 0.7
        } else {
            item.style.transform = "scale(1.1)"
            item.style.opacity = 1
        }
    })
}

function toggleLock() {
    const lockBtn = document.getElementById('lockBtn');
    const inputArea = document.getElementById('inp');
    const findContainer = document.querySelector('.findContainer');
    const clearBtn = document.querySelector('.bg-red-500'); // Clear button

    if (lockBtn.innerText.includes('Lock')) {
        // Lock the visualization - hide input, disable editing
        lockBtn.innerText = '🔓 Unlock';
        lockBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
        lockBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
        
        inputArea.style.display = 'none';
        clearBtn.style.display = 'none';
        
        // If the input area is empty, show a message
        if (!inputArea.value.trim()) {
            findContainer.innerHTML = '<div class="p-3 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 rounded-lg">No data to lock. Visualization is empty.</div>';
        } else {
            findContainer.innerHTML = '<div class="p-3 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-lg">Visualization locked. Click Unlock to edit.</div>';
        }
    } else {
        // Unlock the visualization - show input, enable editing
        lockBtn.innerText = '🔒 Lock';
        lockBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
        lockBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
        
        inputArea.style.display = 'block';
        clearBtn.style.display = 'inline-flex';
        findContainer.innerHTML = '';
        
        // Reset node colors
        const nodes = document.querySelectorAll('.node circle');
        nodes.forEach(node => {
            node.classList.remove('green', 'gold', 'gray');
        });
    }
}

function clearAndCreate() {
    var inp = document.getElementById("inp");
    var btn_click = document.querySelector(".btn-clear");
    let cont = document.querySelector(".findContainer");
    document.querySelector(".findContainer").innerHTML = '';
    
    // Check if the lock button exists and reset it to locked state
    const lockBtn = document.getElementById('lockBtn');
    if (lockBtn && lockBtn.innerText.includes('Unlock')) {
        lockBtn.innerText = '🔒 Lock';
        lockBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
        lockBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
        inp.style.display = 'block';
        btn_click.style.display = 'inline-flex';
    }
    
    // Either way, make sure the input is cleared and action is called
    inp.value = '';
    action();
    
    var result = getInput();
    result = result.filter(item => item !== '');
    result = [...new Set(result)];

    if (result.length > 0) {
        inp.style.display = "none";
        btn_click.style.display = "block";
    }

    result.forEach((circle) => {
        var root = getRoot()[0];
        let el = document.createElement("button");
        el.classList.add("numContainer");
        el.innerHTML = circle;
        el.style.transition = "1s";
        el.onclick = function () {
            clear(el);
            findTheNode(root, el);
        };
        cont.appendChild(el);
    });
}

function findTheNode(root, node) {
    var value = parseFloat(node.innerHTML);

    fillToColor(root.value, root.value == value ? "green" : "gold");

    if (root.value == value) return;

    if (root.value > value) {
        findTheNode(root.left, node);
        fillTheCircle(root.right, value);
    } else {
        findTheNode(root.right, node);
        fillTheCircle(root.left, value);
    }
}

function fillTheCircle(root, value) {
    if (root == null || root.value == value) return;
    fillToColor(root.value, "gray");

    fillTheCircle(root.left);
    fillTheCircle(root.right);
}

function fillToColor(value, color) {
    var circles = document.querySelectorAll(".node");

    circles.forEach((circle, i) => {
        circle.firstChild.classList.remove("green");
        circle.firstChild.classList.remove("gold");
        circle.firstChild.classList.remove("gray");
        if (circle.lastChild.innerHTML === value) {
            setTimeout(() => {
                circle.firstChild.classList.add(color);
            }, i * 100);
        }
    });
}

// Function to remove existing SVG elements
function remove() {
    d3.select("#tree").selectAll("svg").remove();
}
