const height = 400;

const svg = d3.select('#d3-container')
    .append('svg')
    .style('position', 'relative')
    .style('height', height);

let width = document.querySelector('svg').clientWidth;
console.log(width);

let tooltip = d3.select('#d3-container')
    .append('div')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('opacity', 0);


fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(res => res.json())
    .then(data => {
        const barWidth = width / data.data.length;

        const years = data.data.map(i => {
            return new Date(i[0])
        });
        const gdp = data.data.map(i => {
            return i[1];
        });
        const maxGdp = d3.max(gdp);
        let maxX = new Date(d3.max(years))
            maxX.setMonth(maxX.getMonth() + 3);

        const linearScale = d3.scaleLinear()
            .domain([0, maxGdp])
            .range([0, height]);
        const xScale = d3.scaleTime()
            .domain([d3.min(years), maxX])
            .range([0, width]);
        const yScale = d3.scaleLinear()
            .domain([0, maxGdp])
            .range([height, 0]);

        const scaledGdp = gdp.map(i => {
            return linearScale(i);
        });

        const xAxis = d3.axisBottom()
            .scale(xScale);
            
        svg.append('g')
            .attr('id', 'x-axis')
            .call(xAxis)
            .attr('transform', 'translate(60, 400)');
            
        const yAxis = d3.axisLeft(yScale);

        svg.append('g')
            .attr('id', 'y-axis')
            .call(yAxis)
            .attr('transform', 'translate(60, 0)')

        d3.select('svg')
            .selectAll('rect')
            .data(scaledGdp)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d, i) => xScale(years[i]))
            .attr('y', d => height - d)
            .attr('width', width / scaledGdp.length)
            .attr('height', d => d)
            .attr('data-index', (d, i) => i)
            .attr('transform', 'translate(60, 0)')
            .attr('data-date', (d, i) => data.data[i][0])
            .attr('data-gdp', (d, i) => data.data[i][1])
            .on('mouseover', (e, d) => {
                let i = scaledGdp.indexOf(d);

                tooltip.transition().duration(200).style('opacity', 0.9);
                tooltip.html(
                    `${years[i].getFullYear()}<br>$${gdp[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} Billion`
                )
                .attr('data-date', data.data[i][0])
                .style('left', i * barWidth + 30 + 'px')
                .style('top', height - 100 + 'px')
                .style('transform', 'translate(60px)');
            })
            .on('mouseout', () => {
                tooltip.transition().duration(200).style('opacity', 0);
            });
    })
    .catch(err => console.error(err));