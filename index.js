let overlay;

const colors = [
  "#5e81ac",
  "#bf616a",
  "#d08770",
  "#ebcb8b",
  "#a3be8c",
  "#b48ead",
];

document.addEventListener("DOMContentLoaded", () => {
  // const socket = new WebSocket("ws://192.168.0.5:8765");
  const socket = new WebSocket("ws://192.168.0.9:8015");
  overlay = d3.select("#overlay");

  // Connection opened
  socket.addEventListener("open", (event) => {
    console.log("opened");
    const message = {
      event: "VGraphRequest",
    };
    socket.send(JSON.stringify(message));
  });

  // Listen for messages
  socket.addEventListener("message", (event) => {
    console.log(event);
    const data = JSON.parse(event.data);
    console.log(data);
    const vGraph = JSON.parse(data.VGraph);
    class Node {
      constructor(name, edgeLabel, children) {
        this.name = name.label.toString();
        this.nodeLabel = name;
        this.edgeLabel = edgeLabel;
        this.children = children;
      }
    }
    const nodeDict = vGraph.nodes;
    const edgeDict = vGraph.nodeEdges;
    const nodes = Object.keys(vGraph.nodes);

    function buildTree(node, parentNode) {
      var childrenNodesNewFormat = [];
      var nodeLabel = nodeDict[node];
      var edgeLabel = null;
      if (parentNode != null) {
        edgeLabel = edgeDict[parentNode][node];
      }

      if (node in edgeDict) {
        var childrenNodes = Object.keys(edgeDict[node]);

        for (var i = 0; i < childrenNodes.length; i++) {
          childrenNodesNewFormat.push(buildTree(childrenNodes[i], node));
        }
      }
      var node = new Node(nodeLabel, edgeLabel, childrenNodesNewFormat);
      return node;
    }

    var tree = buildTree(nodes[nodes.length - 1], null);

    const component = new hyt.Hypertree(
      { parent: document.getElementById("graph") },
      {
        dataloader: (ok) => ok(tree),
        langInitBFS: (ht, n) => (n.precalc.label = n.data.name),
        interaction: {
          onNodeClick: (n, m, l) => {
            overlay.html(`<span>${n.data.edgeLabel.label}</span>`);
          },
          λbounds: [0.5, 1],
        },
        geometry: {
          // addLayer: ["link-arcs"],
          layerOptions: {
            "link-arcs": {
              stroke: (n) => {
                return colors[n.data.edgeLabel.color];
              },
            },
            nodes: {
              fill: (n) => {
                return colors[n.data.nodeLabel.color];
              },
            },
          },
        },
      }
    );
  });
});
