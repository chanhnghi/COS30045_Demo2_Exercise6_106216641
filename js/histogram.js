let histogramBars;

function drawHistogram(data) {
  const { width, height, margin, innerWidth, innerHeight } = chartDimensions;
  const svg = d3.select("#histogram").append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Histogram of television energy consumption with interactive screen technology filters");
  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  const bins = binGenerator(data);
  yScaleH.domain([0, d3.max(bins, d => d.length)]).nice();

  innerChart.append("g").attr("class", "grid")
    .call(d3.axisLeft(yScaleH).ticks(6).tickSize(-innerWidth).tickFormat(""));
  histogramBars = innerChart.append("g").attr("class", "bars");
  updateHistogram(data, false);
  innerChart.append("g").attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScaleH).ticks(8));
  innerChart.append("g").attr("class", "axis").call(d3.axisLeft(yScaleH).ticks(6));
  innerChart.append("text").attr("class", "axis-label")
    .attr("x", innerWidth / 2).attr("y", innerHeight + 54)
    .attr("text-anchor", "middle").text("Annual energy consumption (kWh/year)");
  innerChart.append("text").attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2).attr("y", -58)
    .attr("text-anchor", "middle").text("Number of TV models");
}

function updateHistogram(data, animate = true) {
  const bins = binGenerator(data);
  const bars = histogramBars.selectAll("rect.histogram-bar")
    .data(bins, d => d.x0)
    .join("rect")
    .attr("class", "histogram-bar")
    .attr("x", d => xScaleH(d.x0) + 1)
    .attr("width", d => Math.max(0, xScaleH(d.x1) - xScaleH(d.x0) - 2))
    .attr("fill", histogramColor);
  const target = animate ? bars.transition().duration(450) : bars;
  target
    .attr("y", d => yScaleH(d.length))
    .attr("height", d => chartDimensions.innerHeight - yScaleH(d.length));
  bars.selectAll("title").data(d => [d]).join("title")
    .text(d => `${d.x0}–${d.x1} kWh/year: ${d.length} TVs`);
}
