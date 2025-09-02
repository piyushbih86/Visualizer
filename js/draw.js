//Data Structure Visualizer - Graph Drawing Module
//GitHub: https://github.com/piyushbih86/Visualizer
function drawGraph(data) {
    console.log("Drawing graph with", data.length, "data points");
    
    if (!data || data.length === 0) {
        console.error("No data to draw");
        return;
    }

    try {
        var list = [];

        for (var i = 0; i < data.length; i++) {
            var now = data[i];
            if (!now) {
                console.warn("Undefined node at index", i);
                continue;
            }
            
            var obj = {
                "value": now.value,
                "children": [].concat(now.children || []),
                "parent": now.parent
            };
            list.push(obj);
        }

        //Array deduplication technique
        var unique = [...new Set(data.map(x => x.value))];
        
        // Ensure we have at least a minimum width and height
        var nodeCount = Math.max(unique.length, 3);
        
        var margin = {
            top: 50,
            right: 5,
            bottom: 5,
            left: 20
        },
            width = Math.max(300, (100 * nodeCount)) - margin.right - margin.left,
            height = Math.max(300, (100 * nodeCount)) - margin.top - margin.bottom;

        var i = 0;

        var tree = d3.layout.tree().size([height, width]);
        var diagonal = d3.svg.diagonal().projection(function (d) {
            return [d.x, d.y];
        });
        
        // Create the SVG container
        var svg = d3.select("#tree").append("svg")
            .attr("width", width )
            .attr("height", height + margin.top)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Get the root node
        var root = list[0];
        
        if (!root) {
            console.error("No root node found in list");
            return;
        }
        
        console.log("Drawing with root:", root.value);

        // Create the tree layout
        var nodes = tree.nodes(root),
            links = tree.links(nodes);

        nodes.forEach(function (d) {
            d.y = d.depth * 70;
        });

        var gNode = svg.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });

        var nodeEnter = gNode.enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        var circle = nodeEnter.append("circle")
            .attr("r", 0);

        circle.transition()
            .delay(function (d, i) {
                return i * 80;
            })
            .attr("r", 25)
            .style("fill", function (d, i) {
                if (d.value === "null" || d.value === "Empty") {
                    return '#f0f0f0'; // Light gray for null nodes
                }
                
                // Different coloring based on tree type
                const treeType = getTreeType();
                if (treeType === 'graph') {
                    return '#A8D5BA'; // Greenish for graph nodes
                } else if (treeType === 'bt') {
                    return '#FFD8B1'; // Orangish for binary tree
                } else {
                    return d.children || d._children ? 'lightblue' : 'lightgray'; // BST default
                }
            })
            .style("visibility",function(d){
                // Hide both Empty and null nodes
                return (d.value === "Empty" || d.value === "null") ? "hidden" : "visible"
            })
            .style("stroke", function(d) {
                return d.value === "null" ? "red" : "black"; // Red border for null nodes
            })
            .style("stroke-dasharray", function(d) {
                return d.value === "null" ? "5,5" : "none"; // Dashed border for null nodes
            })
            .duration(1000)
            .ease('elastic');

        var charText = nodeEnter.append('text')
            .attr('y', 5)
            .attr("text-anchor", "middle");

        charText.transition()
            .delay(function (d, i) {
                return i * 90;
            })
            .text(function (d) {
                return d.value;
            })
            .style("visibility",function(d){
                return (d.value === "Empty" || d.value === "null") ? "hidden" : "visible"
            })
            .style("fill", function(d) {
                return d.value === "null" ? "red" : "black"; // Red text for null nodes
            })
            .style("font-size", function(d) {
                return d.value === "null" ? "12px" : "14px"; // Smaller font for null
            });

        //PATH 
        var path = svg.selectAll("path.link")
            .data(links, function (d) {
                return d.target.id;
            })
            .style("visibility",function(d){
                return (d.target.value === "Empty" || d.target.value === "null") ? "hidden" : "visible"
            })
            .style("stroke-dasharray", function(d) {
                return d.target.value === "null" ? "3,3" : "none"; // Dashed lines for null nodes
            });
            
        var pathT = path.enter().insert("path", "g")
            .attr("class", "link")
            .attr("fill", "none")
            .attr("stroke", "black")
            .style("visibility",function(d){
                return (d.target.value === "Empty" || d.target.value === "null") ? "hidden" : "visible"
            })
            .style("stroke-dasharray", function(d) {
                return d.target.value === "null" ? "3,3" : "none"; // Dashed lines for null nodes
            });

        pathT.transition()
            .delay(function (d, i) {
                return i * 85;
            })
            .attr("d", diagonal);
    } catch (error) {
        console.error("Error in drawGraph:", error);
    }
}

// Function to draw graph with multiple components and weighted edges
function drawGraphWithComponents(components, edges, isWeighted, isDirected = false) {
    console.log("Drawing graph with", components.length, "components", isDirected ? "(directed)" : "(undirected)");
    
    if (!components || components.length === 0) {
        console.error("No components to draw");
        return;
    }

    try {
        // Calculate total nodes for sizing
        const totalNodes = components.reduce((sum, comp) => sum + comp.length, 0);
        const componentSpacing = 350; // Increased space between components
        
        var margin = {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
        };
        
        // Dynamic sizing based on components - much wider spacing
        var width = Math.max(600, (components.length * componentSpacing)) - margin.right - margin.left;
        var height = Math.max(400, (Math.max(...components.map(c => c.length)) * 100)) - margin.top - margin.bottom;

        // Create the SVG container
        var svg = d3.select("#tree").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add arrow markers for directed graphs
        if (isDirected) {
            svg.append("defs").selectAll("marker")
                .data(["arrow"])
                .enter().append("marker")
                .attr("id", "arrow")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 25)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5")
                .style("fill", "#666")
                .style("stroke", "#666");
        }

        // Position nodes for each component with better spacing
        let allPositionedNodes = [];
        let allPositionedEdges = [];
        
        components.forEach((component, compIndex) => {
            const compWidth = width / components.length;
            const compCenterX = compIndex * compWidth + compWidth / 2;
            
            // Arrange nodes in a circle for each component with larger radius
            const radius = Math.min(compWidth / 2.5, height / 3); // Increased radius
            const angleStep = (2 * Math.PI) / component.length;
            
            // For single node components, place them at center
            if (component.length === 1) {
                component[0].x = compCenterX;
                component[0].y = height / 2;
                component[0].componentIndex = compIndex;
                allPositionedNodes.push(component[0]);
            } else {
                component.forEach((node, nodeIndex) => {
                    const angle = nodeIndex * angleStep;
                    node.x = compCenterX + radius * Math.cos(angle);
                    node.y = height / 2 + radius * Math.sin(angle);
                    node.componentIndex = compIndex;
                    allPositionedNodes.push(node);
                });
            }
        });
        
        // Filter edges to only include those between positioned nodes
        edges.forEach(edge => {
            const sourceNode = allPositionedNodes.find(n => n.value === edge.source);
            const targetNode = allPositionedNodes.find(n => n.value === edge.target);
            if (sourceNode && targetNode) {
                allPositionedEdges.push({
                    source: sourceNode,
                    target: targetNode,
                    weight: edge.weight,
                    isDirected: edge.isDirected
                });
            }
        });

        // Add background rectangles for each component to show separation
        if (components.length > 1) {
            var componentBgs = svg.selectAll(".component-bg")
                .data(components)
                .enter().append("rect")
                .attr("class", "component-bg")
                .attr("x", (d, i) => (i * width / components.length) + 10)
                .attr("y", 10)
                .attr("width", (width / components.length) - 20)
                .attr("height", height - 20)
                .style("fill", (d, i) => {
                    const bgColors = ['rgba(168, 213, 186, 0.1)', 'rgba(255, 216, 177, 0.1)', 
                                    'rgba(245, 183, 177, 0.1)', 'rgba(213, 166, 189, 0.1)', 
                                    'rgba(169, 204, 227, 0.1)', 'rgba(249, 231, 159, 0.1)'];
                    return bgColors[i % bgColors.length];
                })
                .style("stroke", (d, i) => {
                    const strokeColors = ['#A8D5BA', '#FFD8B1', '#F5B7B1', '#D5A6BD', '#A9CCE3', '#F9E79F'];
                    return strokeColors[i % strokeColors.length];
                })
                .style("stroke-width", "1px")
                .style("stroke-dasharray", "5,5")
                .style("rx", "10")
                .style("ry", "10");
                
            // Add component labels
            var componentLabels = svg.selectAll(".component-label")
                .data(components)
                .enter().append("text")
                .attr("class", "component-label")
                .attr("x", (d, i) => (i * width / components.length) + (width / components.length) / 2)
                .attr("y", 30)
                .attr("text-anchor", "middle")
                .style("fill", "#666")
                .style("font-size", "12px")
                .style("font-weight", "bold")
                .text((d, i) => `Component ${i + 1}`);
        }

        // Draw edges first (so they appear behind nodes)
        var links = svg.selectAll(".link")
            .data(allPositionedEdges)
            .enter().append("line")
            .attr("class", "link")
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
            .style("stroke", "#666")
            .style("stroke-width", "3px")
            .style("opacity", "0.8")
            .attr("marker-end", d => (isDirected ? "url(#arrow)" : "none"));

        // Add edge labels for weighted graphs
        if (isWeighted) {
            var edgeLabels = svg.selectAll(".edge-label")
                .data(allPositionedEdges)
                .enter().append("text")
                .attr("class", "edge-label")
                .attr("x", d => (d.source.x + d.target.x) / 2)
                .attr("y", d => (d.source.y + d.target.y) / 2)
                .attr("text-anchor", "middle")
                .attr("dy", "-8px")
                .style("fill", "#333")
                .style("font-size", "14px")
                .style("font-weight", "bold")
                .style("background", "white")
                .style("padding", "2px 6px")
                .style("border-radius", "4px")
                .text(d => d.weight);
                
            // Add background for edge labels
            edgeLabels.each(function() {
                const bbox = this.getBBox();
                d3.select(this.parentNode).insert("rect", "text")
                    .attr("x", bbox.x - 4)
                    .attr("y", bbox.y - 2)
                    .attr("width", bbox.width + 8)
                    .attr("height", bbox.height + 4)
                    .style("fill", "rgba(255, 255, 255, 0.9)")
                    .style("stroke", "#ddd")
                    .style("stroke-width", "1px")
                    .style("rx", "4px");
            });
        }

        // Draw nodes
        var nodeGroups = svg.selectAll(".node")
            .data(allPositionedNodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.x},${d.y})`);

        // Node circles with component-based coloring and enhanced styling
        var circles = nodeGroups.append("circle")
            .attr("r", 0)
            .style("fill", function(d) {
                const colors = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'];
                return colors[d.componentIndex % colors.length];
            })
            .style("stroke", "#fff")
            .style("stroke-width", "3px")
            .style("filter", "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))")
            .style("cursor", "pointer");

        // Animate circles with staggered timing
        circles.transition()
            .delay((d, i) => i * 150)
            .duration(1000)
            .attr("r", 30)
            .ease(d3.ease('bounce'));

        // Node labels with better styling
        var labels = nodeGroups.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .style("fill", "#fff")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.5)")
            .style("pointer-events", "none")
            .text(d => d.value);

        // Animate links with drawing effect
        links.style("stroke-dasharray", function() {
                const length = this.getTotalLength();
                return length + " " + length;
            })
            .style("stroke-dashoffset", function() {
                return this.getTotalLength();
            })
            .transition()
            .delay((d, i) => i * 200 + 800)
            .duration(1500)
            .style("stroke-dashoffset", 0)
            .ease(d3.ease('cubic-out'));

        // Add hover effects for nodes
        circles.on("mouseover", function(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 35)
                .style("stroke-width", "4px");
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 30)
                .style("stroke-width", "3px");
        });

        console.log("Graph with components drawn successfully");
    } catch (error) {
        console.error("Error in drawGraphWithComponents:", error);
    }
}
