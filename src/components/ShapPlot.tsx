import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ShapData {
  sample_id: string;
  prediction: string;
  probability: number;
  features: string[];
  values: number[];
  shap_values: number[];
  feature_groups: string[];
}

const ShapPlot: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/shap');
      const data: ShapData = await response.json();
      
      const margin = { top: 60, right: 120, bottom: 40, left: 100 };
      const width = 960 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const svg = d3.select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const y = d3.scaleBand()
        .rangeRound([0, height])
        .padding(0.1)
        .domain(data.features);

      const x = d3.scaleLinear()
        .rangeRound([0, width])
        .domain([d3.min(data.shap_values)!, d3.max(data.shap_values)!]);

      const color = d3.scaleOrdinal()
        .domain(["Somatic Mut.", "CNA events", "Mutation Sig.", "Age/Sex"])
        .range(["red", "green", "blue", "gray"]);

      svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll(".tick text")
        .style("font-size", "12px");

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svg.selectAll(".bar")
        .data(data.features)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d)!)
        .attr("height", y.bandwidth())
        .attr("x", () => x(Math.min(0, ...data.shap_values)))
        .attr("width", d => Math.abs(x(0) - x(data.shap_values[data.features.indexOf(d)])))
        .attr("fill", d => color(data.feature_groups[data.features.indexOf(d)]));
      
       // Add title
      svg.append("text")
        .attr("x", (width / 2))
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(`${data.sample_id} - ${data.prediction} (Probability: ${data.probability.toFixed(3)})`);

       // Add legend
      const legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

      legend.append("rect")
        .attr("x", width + 10)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

      legend.append("text")
        .attr("x", width + 35)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .style("font-size", "12px")
        .text(d => d);
    }

    fetchData();
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default ShapPlot;