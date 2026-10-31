let histogramBars;
let histogramTooltip;

function drawHistogram(data) {
  const { width, height, margin, innerWidth, innerHeight } = chartDimensions;
  const svg = d3.select("#histogram").append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Stacked histogram of TV energy consumption by screen technology");
  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  // Keep the same vertical scale when filters change so the bar heights stay comparable.
  yScaleH.domain([0, d3.max(binGenerator(data), bin => bin.length)]).nice();

  innerChart.append("g").attr("class", "grid")
    .call(d3.axisLeft(yScaleH).ticks(6).tickSize(-innerWidth).tickFormat(""));
  histogramBars = innerChart.append("g").attr("class", "bars");
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

  histogramTooltip = innerChart.append("g")
    .attr("class", "tooltip tooltip-hidden");
  histogramTooltip.append("rect")
    .attr("width", 260).attr("height", 72).attr("rx", 7)
    .attr("fill", "white").attr("stroke", "#cbd5e1");
  histogramTooltip.append("text")
    .attr("class", "tooltip-title").attr("x", 12).attr("y", 27);
  histogramTooltip.append("text")
    .attr("class", "tooltip-detail").attr("x", 12).attr("y", 53);
}

function updateHistogram(data, selectedTechnology = "all") {
  const technologies = selectedTechnology === "all"
    ? technologyColors.domain() : [selectedTechnology];
  const segments = binGenerator(data).flatMap(bin => {
    let base = 0;
    return technologies.map(tech => {
      const count = bin.filter(tv => tv.screenTech === tech).length;
      const segment = { x0: bin.x0, x1: bin.x1, tech, count, bottom: base, top: base + count };
      base += count;
      return segment;
    });
  });
  const bars = histogramBars.selectAll("rect.histogram-bar")
    .data(segments, d => `${d.x0}-${d.tech}`)
    .join("rect")
    .attr("class", "histogram-bar")
    .attr("x", d => xScaleH(d.x0) + 1)
    .attr("width", d => Math.max(0, xScaleH(d.x1) - xScaleH(d.x0) - 2))
    .attr("fill", d => technologyColors(d.tech))
    .attr("y", d => yScaleH(d.top))
    .attr("height", d => yScaleH(d.bottom) - yScaleH(d.top))
    .attr("aria-label", d => `${d.tech}: ${d.count} TVs in ${d.x0}–${d.x1} kWh/year`);
  bars.on("mouseenter", (event, d) => {
    const chartWidth = chartDimensions.innerWidth;
    const chartHeight = chartDimensions.innerHeight;
    const x = Math.max(0, Math.min(xScaleH(d.x0) + 12, chartWidth - 260));
    const y = Math.max(0, Math.min(yScaleH(d.top) - 80, chartHeight - 72));
    histogramTooltip.attr("transform", `translate(${x},${y})`)
      .classed("tooltip-hidden", false).raise();
    histogramTooltip.select(".tooltip-title")
      .text(`${d.tech} · ${d.count.toLocaleString()} TV models`);
    histogramTooltip.select(".tooltip-detail")
      .text(`${d.x0}–${d.x1} kWh/year`);
  }).on("mouseleave", () => histogramTooltip.classed("tooltip-hidden", true));
}
