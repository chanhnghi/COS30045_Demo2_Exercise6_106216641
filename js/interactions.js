let activeTechnology = "all";
let minimumStars = 0;

function populateFilters(data) {
  const controls = d3.select("#filters_screen")
    .selectAll("button.filter-button")
    .data(filterOptions, d => d.id)
    .join("button")
    .attr("class", "filter-button")
    .attr("type", "button")
    .text(d => d.label)
    .on("click", function (event, selected) {
      activeTechnology = selected.id;
      filterOptions.forEach(option => { option.isActive = option.id === activeTechnology; });
      controls.classed("is-active", d => d.isActive)
        .attr("aria-pressed", d => String(d.isActive));
      applyFilters(data);
    });
  controls.classed("is-active", d => d.isActive)
    .attr("aria-pressed", d => String(d.isActive));

  const slider = document.querySelector("#star-filter");
  slider.addEventListener("input", () => {
    minimumStars = Number(slider.value);
    applyFilters(data);
  });
  document.querySelector("#reset-filters").addEventListener("click", () => {
    activeTechnology = "all";
    minimumStars = 0;
    slider.value = "0";
    filterOptions.forEach(option => { option.isActive = option.id === "all"; });
    controls.classed("is-active", d => d.isActive)
      .attr("aria-pressed", d => String(d.isActive));
    applyFilters(data);
  });
  applyFilters(data);
}

function applyFilters(data) {
  const filtered = data.filter(tv =>
    (activeTechnology === "all" || tv.screenTech === activeTechnology)
    && tv.star >= minimumStars);
  updateHistogram(filtered, activeTechnology);
  updateScatterplot(filtered);
  document.querySelector("#star-value").textContent =
    minimumStars === 0 ? "All ratings" : `${minimumStars} stars or more`;
  document.querySelector("#filter-summary").textContent =
    `${filtered.length.toLocaleString()} of ${data.length.toLocaleString()} models shown · ${activeTechnology === "all" ? "all technologies" : activeTechnology} · ${minimumStars === 0 ? "all star ratings" : `${minimumStars}+ stars`}`;
}

function createTooltip() {
  const tooltip = scatterState.innerChart.append("g")
    .attr("class", "tooltip tooltip-faded");
  tooltip.append("rect")
    .attr("width", tooltipSize.width)
    .attr("height", tooltipSize.height)
    .attr("rx", 7)
    .attr("fill", "#ffffff")
    .attr("stroke", "#cbd5e1");
  tooltip.append("text").attr("class", "tooltip-title").attr("x", 12).attr("y", 23);
  tooltip.append("text").attr("class", "tooltip-detail").attr("x", 12).attr("y", 46);
  scatterState.tooltip = tooltip;
}

function handleMouseEvents() {
  scatterState.dots
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
        .classed("tooltip-faded", false);
    })
    .on("mouseleave", function () {
      d3.select(this).attr("r", 3.2).attr("opacity", null);
      scatterState.tooltip.classed("tooltip-faded", true);
    });
}
