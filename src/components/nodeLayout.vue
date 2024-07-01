<template>
  <div>
    <div>
      <h1 class="heading">Node Layout</h1>
    </div>
    <div>
      <div v-if="showPopUp">
        <div class="popup-box">
          <button @click="closePopUp" class="closeButton">x</button>
          <h1 id="name">{{ popUpData.name }}</h1>
          <p id="description">{{ popUpData.description }}</p>
        </div>
      </div>
      <div ref="chart" id="nodeStructure"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import * as d3 from "d3";

const chart = ref(null);
const responseData = ref([]);
const showPopUp = ref(false);
const popUpData = ref({});
const selectedNode = ref(null);

// Function to handle node selection
function onSelectNode(event, d) {
  showPopUp.value = true;
  popUpData.value = d.data.data;

  // Unselect the previously selected node
  if (selectedNode.value) {
    selectedNode.value.select("rect").classed("selected", false);
  }

  // Select the new node
  selectedNode.value = d3.select(event.currentTarget);
  selectedNode.value.select("rect").classed("selected", true);
}

// Function to close the popup
function closePopUp() {
  showPopUp.value = false;
  popUpData.value = {};
  if (selectedNode.value) {
    selectedNode.value.select("rect").classed("selected", false);
  }
}

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:3000/node-data");
    responseData.value = response.data;
    await createNodeStructure(responseData.value);
  } catch (error) {
    return error;
  }
});

function createNodeStructure(nodeData) {
  const width = 1100;
  const height = 400;

  const treeData = d3
    .stratify()
    .id((d) => d.name)
    .parentId((d) => d.parent)(nodeData.data);

  // Create SVG container
  const svg = d3
    .select(chart.value)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 3.2},${height / 1.6})`);

  // Define a tree layout with a left-to-right orientation
  const treeLayout = d3
    .tree()
    .size([height - 100, width - 200])
    .nodeSize([50, 150]);

  // Create hierarchy from data
  const rootNode = d3.hierarchy(treeData);

  // Assigns the x and y positions for the nodes
  treeLayout(rootNode);

  // Draw nodes
  const nodes = svg
    .selectAll(".node")
    .data(rootNode.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.y},${d.x})`)
    .on("click", onSelectNode);

  nodes.append("rect");

  nodes
    .append("text")
    .text((d) => d.data.data.name)
    .attr("x", 50)
    .attr("y", 15);

  // Draw links
  const links = svg
    .selectAll(".link")
    .data(rootNode.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr(
      "d",
      (d) =>
        `M${d.source.y + 101},${d.source.x + 15} L${d.target.y},${
          d.target.x + 15
        }`
    );
}
</script>

<style>
.popup-box {
  width: 300px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  padding: 30px;
  position: absolute;
  display: inline-block;
  padding-top: 0px;
  padding-right: 0px;
  margin-top: 20px;
}

.popup-box h1 {
  color: #333;
  line-height: 1;
}
.popup-box p {
  color: #333;
  margin: 12px 0 20px;
}
.popup-box .closeButton {
  background: #0069d9;
  border: none;
  outline: none;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  font-size: 16px;
  color: white;
  float: right;
  margin-right: -10px;
  margin-top: -10px;
}
rect {
  width: 100px;
  height: 30px;
  fill: white;
  stroke: black;
  cursor: pointer;
  stroke-width: 2px;
}
rect.selected {
  stroke: orange;
  stroke-width: 2px;
}
text {
  text-anchor: middle;
  dominant-baseline: middle;
  cursor: pointer;
  fill: #0069d9;
  font-weight: bold;
}
path {
  fill: none;
  stroke: #0069d9;
  stroke-width: 2px;
}

#name {
  color: #0069d9;
}

.errorImgallign {
  width: 50%;
}
.heading{
  text-align: center;
}
.imgAllign{
  text-align: center;
}
.spinnerAllign{
  width: 35%;
  margin-top: 100%;
}
</style>
