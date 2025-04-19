import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ShapData {
    randid: string;
    prediction: string;
    probability: number;
    features: string[];
    values: number[];
    shap_values: number[];
    feature_groups: string[];
}

const ComplexShapPlot: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/shap_complex');
            const data: ShapData = await response.json();

            const margin = { top: 60, right: 200, bottom: 40, left: 100 };
            const width = 1200 - margin.left - margin.right;
            const height = 600 - margin.top - margin.bottom;

            const svg = d3.select(svgRef.current)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Define colors for feature groups
            const color = d3.scaleOrdinal()
                .domain(["Somatic Mut.", "CNA events", "Mutation Sig.", "Age/Sex"])
                .range(["red", "green", "blue", "gray"]);

            // 1. Donut Chart
            const radius = Math.min(width / 3, height / 2) / 2;

            const pie = d3.pie<string>()
                .value(() => 1)
                .sort(null);

            const arc = d3.arc()
                .innerRadius(radius * 0.6)
                .outerRadius(radius);

            const donutData = d3.rollups(data.feature_groups, v => v.length, d => d)
                .map(d => ({ group: d[0], value: d[1] }));

            const donut = svg.append("g")
                .attr("transform", `translate(${width / 4}, ${height / 2})`);

            donut.selectAll("path")
                .data(pie(data.feature_groups))
                .enter().append("path")
                .attr("d", arc as any)
                .attr("fill", d => color(d.data)) // Typescript workaround
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 0.7);

            // 2. Scatter Plot
            const x = d3.scaleLinear()
                .domain([0, 1])
                .range([0, width / 2]);

            const y = d3.scaleLinear()
                .domain([-0.5, 1.5])
                .range([height, 0]);

            const scatter = svg.append("g")
                .attr("transform", `translate(${width / 2}, 0)`);

            scatter.selectAll("circle")
                .data(data.features)
                .enter().append("circle")
                .attr("cx", d => x(data.values[data.features.indexOf(d)]))
                .attr("cy", d => y(data.shap_values[data.features.indexOf(d)]))
                .attr("r", 5)
                .attr("fill", d => color(data.feature_groups[data.features.indexOf(d)]))
                .style("opacity", 0.7);

            scatter.selectAll("text")
                .data(data.features)
                .enter().append("text")
                .attr("x", d => x(data.values[data.features.indexOf(d)]) + 10)
                .attr("y", d => y(data.shap_values[data.features.indexOf(d)]) - 5)
                .text(d => d)
                .style("font-size", "10px");

             // Add title
            svg.append("text")
              .attr("x", (width / 2))
              .attr("y", -30)
              .attr("text-anchor", "middle")
              .style("font-size", "16px")
              .style("font-weight", "bold")
              .text(`${data.randid} - ${data.prediction} (Probability: ${data.probability.toFixed(3)})`);

            // Add legend
            const legend = svg.selectAll(".legend")
              .data(color.domain())
              .enter().append("g")
              .attr("class", "legend")
              .attr("transform", (d, i) => `translate(${width - 100},${i * 20})`);

            legend.append("rect")
              .attr("x", 0)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);

            legend.append("text")
              .attr("x", 25)
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

export default ComplexShapPlot;