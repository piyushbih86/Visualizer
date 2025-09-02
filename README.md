# Data Structure Visualizer

An interactive web-based visualization tool for understanding various data structures including Binary Search Trees, Binary Trees, and Graphs.

## 🌟 Features

### 🌳 Binary Search Tree (BST)
- Interactive BST construction with ordered insertion
- Visual representation of search operations
- Support for null nodes visualization
- Real-time tree updates

### 🌲 Binary Tree
- Level-order (breadth-first) tree construction
- Support for incomplete trees with null nodes
- Visual distinction between different tree types

### 🕸️ Graph Visualization
- **Multiple Components**: Visualize disconnected graph components
- **Weighted & Unweighted Graphs**: Support for both graph types
- **Edge Weight Display**: Visual representation of edge weights
- **Component Separation**: Clear visual separation between components
- **Interactive Layout**: Dynamic positioning and animations

## 🚀 Live Demo

[View Live Demo](https://piyushbih86.github.io/Visualizer/)

## 📁 Project Structure

```
├── index.html              # Main landing page with navigation
├── bst/                     # Binary Search Tree visualizer
│   └── index.html
├── binary-tree/             # Binary Tree visualizer
│   └── index.html
├── graph/                   # Graph visualizer
│   └── index.html
├── js/                      # Shared JavaScript files
├── media/                   # Images and assets
└── style.css               # Shared styles
```

## 🎯 How to Use

### Binary Search Tree
1. Navigate to the BST section
2. Enter numbers separated by spaces (e.g., `10 5 15 3 7 12 20`)
3. The first number becomes the root
4. Use "null" for empty nodes

### Binary Tree
1. Navigate to the Binary Tree section
2. Enter values in level-order (e.g., `10 5 15 null 7 null 20`)
3. Use "null" to represent missing nodes

### Graph Visualization
1. Navigate to the Graph section
2. Choose between weighted or unweighted
3. **Unweighted**: Enter edges as `A,B A,C B,D`
4. **Weighted**: Enter edges as `A,B,5 A,C,3 B,D,2`
5. Add standalone nodes by just typing them: `E F G`

## 🛠️ Technologies Used

- **HTML5 & CSS3**: Structure and styling
- **JavaScript (ES6+)**: Core functionality
- **D3.js**: Data-driven visualizations
- **SVG**: Scalable vector graphics for diagrams

## 🎨 Features Showcase

- **Real-time Updates**: Diagrams update as you type
- **Smooth Animations**: Elegant transitions and effects
- **Responsive Design**: Works on different screen sizes
- **Component-based Coloring**: Different colors for graph components
- **Interactive Elements**: Hover effects and smooth interactions

## 📝 Examples

### BST Example
```
10 5 15 3 7 12 20
```

### Binary Tree Example
```
10 5 15 null 7 null 20
```

### Graph Examples
```
Unweighted: A,B A,C B,D C,E F,G
Weighted: A,B,5 A,C,3 B,D,2 C,E,4
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- D3.js community for the amazing visualization library
- Open source contributors who inspire continuous learning