import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Prediction {
  cancer_type: string;
  probability: number;
}

interface Feature {
  name: string;
  contribution: number;
  comparison: string;
}

interface FeatureValue {
  sample: number;
  cancer_avg: number;
  other_avg: number;
  scale_label?: string;
  max_value?: number;
}

interface OncoPredictorData {
  sample_id: string;
  predictions: Prediction[];
  features_top1: Feature[];
  features_top2: Feature[];
  feature_values: FeatureValue[];
}

const OncoPredictorPlot: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/oncopredictor');
      const data: OncoPredictorData = await response.json();

      const margin = {
        top: 50,
        right: 150,
        bottom: 50,
        left: 120,
      };

      const width = 1500 - margin.left - margin.right;
      const height = 700 - margin.top - margin.bottom;

      const svg = d3
        .select(svgRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // 1. Cancer Type Probability Ranking (Left Panel)
      const cancerTypes = data.predictions.map((p) => p.cancer_type);
      const probabilities = data.predictions.map((p) => p.probability);

      const y = d3
        .scaleBand()
        .domain(cancerTypes)
        .range([0, height])
        .padding(0.1);

      const xLeft = d3.scaleLinear().domain([0, 1]).range([0, width / 3]);

      const leftPanel = svg.append('g').attr('transform', `translate(0,0)`);

      leftPanel
        .selectAll('.bar')
        .data(data.predictions)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('y', (d) => y(d.cancer_type) || 0)
        .attr('height', y.bandwidth())
        .attr('x', 0)
        .attr('width', (d) => xLeft(d.probability))
        .attr('fill',
          (d, i) => i === 0 ? 'red' : i === 1 ? 'blue' : i === 2 ? 'green' : 'gray'
        );

      leftPanel
        .append('g')
        .call(d3.axisLeft(y))
        .selectAll('.tick text')
        .style('font-size', '12px');

      leftPanel
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xLeft));

      // 2. Feature Contribution Analysis (Middle Panel)
      const drawFeatureSection = (features, xOffset, yOffset, bgColor) => {
        const featureHeight = 20;
        const sectionHeight = features.length * featureHeight;

        const xMiddle = d3.scaleLinear().domain([0, 0.3]).range([0, width / 3]);

        const middlePanel = svg
          .append('g')
          .attr(
            'transform',
            `translate(${xOffset},${yOffset})`
          );

        middlePanel
          .append('rect')
          .attr('width', width / 3)
          .attr('height', sectionHeight)
          .attr('fill', bgColor)
          .attr('opacity', 0.2);

        middlePanel
          .selectAll('.featureBar')
          .data(features)
          .enter()
          .append('rect')
          .attr('class', 'featureBar')
          .attr('y', (d, i) => i * featureHeight)
          .attr('height', featureHeight - 2)
          .attr('x', 0)
          .attr('width', (d) => xMiddle(d.contribution))
          .attr('fill', (d) =>
            d.name.includes('fusion')
              ? 'orange'
              : d.name.includes('rmd')
              ? 'purple'
              : 'teal'
          );

        middlePanel
          .selectAll('.featureLabel')
          .data(features)
          .enter()
          .append('text')
          .attr('class', 'featureLabel')
          .attr('x', 5)
          .attr('y', (d, i) => i * featureHeight + featureHeight / 2)
          .attr('dy', '0.35em')
          .text((d) => `${d.name} ${d.comparison}`)
          .style('font-size', '10px');
      };

      drawFeatureSection(
        data.features_top1,
        width / 3,
        50,
        'pink'
      );
      drawFeatureSection(
        data.features_top2,
        width / 3,
        300,
        'lightblue'
      );

      // 3. Feature Value Comparison (Right Panel)
      const drawValueComparison = (featureValues, xOffset, yOffset) => {
        const valueHeight = 20;
        const valueWidth = 100; // Adjust the width of the scales

        const rightPanel = svg
          .append('g')
          .attr(
            'transform',
            `translate(${xOffset + (width / 3)},${yOffset})`
          );

        rightPanel
          .selectAll('.valueScale')
          .data(featureValues)
          .enter()
          .append('line')
          .attr('class', 'valueScale')
          .attr('x1', 0)
          .attr('x2', valueWidth)
          .attr('y1', (d, i) => i * valueHeight + valueHeight / 2)
          .attr('y2', (d, i) => i * valueHeight + valueHeight / 2)
          .style('stroke', 'black')
          .style('stroke-width', 1);

        rightPanel
          .selectAll('.sampleValue')
          .data(featureValues)
          .enter()
          .append('circle')
          .attr('class', 'sampleValue')
          .attr('cx', (d) => d.sample * valueWidth)
          .attr('cy', (d, i) => i * valueHeight + valueHeight / 2)
          .attr('r', 5)
          .attr('fill', 'red');

        rightPanel
          .selectAll('.cancerAvg')
          .data(featureValues)
          .enter()
          .append('circle')
          .attr('class', 'cancerAvg')
          .attr('cx', (d) => d.cancer_avg * valueWidth)
          .attr('cy', (d, i) => i * valueHeight + valueHeight / 2)
          .attr('r', 3)
          .attr('fill', 'pink');

        rightPanel
          .selectAll('.otherAvg')
          .data(featureValues)
          .enter()
          .append('circle')
          .attr('class', 'otherAvg')
          .attr('cx', (d) => d.other_avg * valueWidth)
          .attr('cy', (d, i) => i * valueHeight + valueHeight / 2)
          .attr('r', 3)
          .attr('fill', 'blue');
      };

      // Combine features from top1 and top2 for value comparison
      const allFeatureValues = [...data.feature_values];
      drawValueComparison(
        allFeatureValues,
        width / 3,
        50
      );

      // Add title
      svg.append("text")
        .attr("x", (width / 2))
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(`${data.sample_id}`);
    }

    fetchData();
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default OncoPredictorPlot;