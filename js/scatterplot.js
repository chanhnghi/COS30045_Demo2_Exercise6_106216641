function drawScatterplot(data) {
  const { width, height, margin, innerWidth, innerHeight } = chartDimensions;
  const svg = d3.select("#scatterplot").append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Scatterplot of TV star rating against annual energy use, coloured by screen technology");
  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  scatterState.innerChart = innerChart;
  scatterState.xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.star)]).nice()
    .range([0, innerWidth]);
  scatterState.yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.energyConsumption)]).nice()
    .range([innerHeight, 0]);

  innerChart.append("g").attr("class", "grid")
    .call(d3.axisLeft(scatterState.yScale).ticks(6).tickSize(-innerWidth).tickFormat(""));
  scatterState.dots = innerChart.selectAll("circle.scatter-dot")
    .data(data)
    .join("circle")
    .attr("class", "scatter-dot")
    .attr("cx", d => scatterState.xScale(d.star))
    .attr("cy", d => scatterState.yScale(d.energyConsumption))
    .attr("r", 3.2)
    .attr("fill", d => technologyColors(d.screenTech));
  innerChart.append("g").attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(scatterState.xScale).ticks(8));
  innerChart.append("g").attr("class", "axis")
    .call(d3.axisLeft(scatterState.yScale).ticks(6));
  innerChart.append("text").attr("class", "axis-label")
    .attr("x", innerWidth / 2).attr("y", innerHeight + 54)
    .attr("text-anchor", "middle").text("Energy star rating");
  innerChart.append("text").attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2).attr("y", -58)
    .attr("text-anchor", "middle").text("Annual energy use (kWh/year)");

  const legend = innerChart.append("g").attr("class", "legend")
    .attr("transform", `translate(${innerWidth - 82},12)`);
  const legendRows = legend.selectAll("g")
    .data(technologyColors.domain())
    .join("g")
    .attr("transform", (d, i) => `translate(0,${i * 23})`);
  legendRows.append("rect").attr("width", 12).attr("height", 12)
    .attr("fill", d => technologyColors(d));
  legendRows.append("text").attr("x", 18).attr("y", 11).text(d => d);
}

function updateScatterplot(data) {
  const visible = new Set(data);
  scatterState.dots.classed("is-hidden", d => !visible.has(d));
  if (scatterState.tooltip) scatterState.tooltip.classed("tooltip-faded", true);
}
