// Chart dimensions and colours are shared across the Week 6 visualisations.
const chartDimensions = {
  width: 920,
  height: 500,
  margin: { top: 38, right: 40, bottom: 70, left: 88 }
};
chartDimensions.innerWidth = chartDimensions.width - chartDimensions.margin.left - chartDimensions.margin.right;
chartDimensions.innerHeight = chartDimensions.height - chartDimensions.margin.top - chartDimensions.margin.bottom;

const bodyBackgroundColor = "#ffffff";
const histogramColor = "#388a72";
const technologyColors = d3.scaleOrdinal()
  .domain(["LCD", "LED", "OLED"])
  .range(["#e49c58", "#318e83", "#7658a6"]);

// The supplied data reach 2,652 kWh/year. Fourteen 200-unit bins cover it.
const binGenerator = d3.bin()
  .value(d => d.energyConsumption)
  .domain([0, 2800])
  .thresholds(d3.range(0, 2801, 200));
const xScaleH = d3.scaleLinear().domain([0, 2800]).range([0, chartDimensions.innerWidth]);
const yScaleH = d3.scaleLinear().range([chartDimensions.innerHeight, 0]);

const filterOptions = [
  { id: "all", label: "All TVs", isActive: true },
  { id: "LCD", label: "LCD", isActive: false },
  { id: "LED", label: "LED", isActive: false },
  { id: "OLED", label: "OLED", isActive: false }
];

// The scatterplot and tooltip code both need these references.
const scatterState = { innerChart: null, xScale: null, yScale: null, tooltip: null };
const tooltipSize = { width: 218, height: 70 };
