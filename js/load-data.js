d3.csv("data/Ex6_TVdata_withStar.csv", d => ({
  brand: d.brand.trim(),
  model: d.model.trim(),
  screenSize: +d.screenSize,
  screenTech: d.screenTech.trim(),
  star: +d.star,
  energyConsumption: +d.energyConsumption
})).then(data => {
  const valid = data.filter(d => Number.isFinite(d.screenSize)
    && Number.isFinite(d.star) && Number.isFinite(d.energyConsumption));
  console.log("Week 6 TV data", valid);
  drawHistogram(valid);
  drawScatterplot(valid);
  createTooltip();
  handleMouseEvents();
  populateFilters(valid);
}).catch(error => {
  document.querySelector("#status").textContent =
    "The TV CSV could not be loaded. Open this page through VS Code Live Server and reload it.";
  console.error(error);
});
