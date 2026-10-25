function populateFilters(data) {
  const controls = d3.select("#filters_screen")
    .selectAll("button.filter-button")
    .data(filterOptions, d => d.id)
    .join("button")
    .attr("class", "filter-button")
    .attr("type", "button")
    .text(d => d.label)
    .on("click", function (event, selected) {
      const nextId = selected.isActive ? "all" : selected.id;
      filterOptions.forEach(option => { option.isActive = option.id === nextId; });
      controls.classed("is-active", d => d.isActive)
        .attr("aria-pressed", d => String(d.isActive));
      const updatedData = nextId === "all"
        ? data
        : data.filter(d => d.screenTech === nextId);
      updateHistogram(updatedData);
      document.querySelector("#filter-summary").textContent =
        `${updatedData.length.toLocaleString()} models shown · ${nextId === "all" ? "all screen technologies" : nextId}`;
    });
  controls.classed("is-active", d => d.isActive)
    .attr("aria-pressed", d => String(d.isActive));
  document.querySelector("#filter-summary").textContent =
    `${data.length.toLocaleString()} models shown · all screen technologies`;
}

function createTooltip() {
  const tooltip = scatterState.innerChart.append("g")
    .attr("class", "tooltip")
    .style("opacity", 0);
  tooltip.append("rect")
    .attr("width", tooltipSize.width)
    .attr("height", tooltipSize.height)
    .attr("rx", 9)
    .attr("fill", "#e2f1e9")
    .attr("stroke", "#73a991");
  tooltip.append("text").attr("class", "tooltip-title").attr("x", 12).attr("y", 23);
  tooltip.append("text").attr("class", "tooltip-detail").attr("x", 12).attr("y", 46);
  scatterState.tooltip = tooltip;
}

function handleMouseEvents() {
  scatterState.innerChart.selectAll("circle.scatter-dot")
    .on("mouseenter", function (event, d) {
      const point = d3.select(this);
      const x = +event.currentTarget.getAttribute("cx");
      const y = +event.currentTarget.getAttribute("cy");
      const tooltipX = Math.min(x + 12, chartDimensions.innerWidth - tooltipSize.width);
      const tooltipY = Math.max(0, Math.min(y - tooltipSize.height - 8,
        chartDimensions.innerHeight - tooltipSize.height));
      point.attr("r", 6).attr("opacity", 1);
      scatterState.tooltip.select(".tooltip-title")
        .text(`${d.screenSize}-inch ${d.screenTech} TV`);
      scatterState.tooltip.select(".tooltip-detail")
        .text(`${d.brand} · ${d.star} stars · ${d.energyConsumption} kWh/yr`);
      scatterState.tooltip.raise()
        .attr("transform", `translate(${tooltipX},${tooltipY})`)
        .interrupt().transition().duration(140).style("opacity", 1);
    })
    .on("mouseleave", function () {
      d3.select(this).attr("r", 3.2).attr("opacity", null);
      scatterState.tooltip.interrupt().transition().duration(130).style("opacity", 0);
    });
}
