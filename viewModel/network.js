function on_click_algo(algo_name) {
    var startTime = new Date().getTime();

    var filename = "../jsons/" + algo_name + ".json";

    d3.json(filename).then(function(response) {

        var data = response[0];

        // console.log(data);

        var color = d3.scaleLinear()
            .domain([0, 5])
            .range(["#2969B0", "#54ACD2"])
            .interpolate(d3.interpolateHcl);

        format = d3.format(",d");
        var width = 800;
        var height = width;
        pack = data => d3.pack()
            .size([width, height])
            .padding(3)
            (d3.hierarchy(data)
                .sum(d => d.followers)
                .sort((a, b) => b.followers - a.followers))



        const root = pack(data);
        console.log(root);

        let focus = root;
        let view;

        const svg = d3.select('#svg_graph')
            .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
            .style("display", "block")
            .style("margin", "0 -14px")
            .style("background", color(0))
            .style("cursor", "pointer")
            .style("font-weight", "bold")
            .style("color", "white")
            .on("click", () => zoom(root));

        var tooltip_div = d3.select("#graph").append("div")
            .attr("class", "tooltip-tweet")
            .style("opacity", 0);

        const node = svg.append("g")
            .attr("class", "circles_g")
            .selectAll("circle")
            .data(root.descendants().slice(1))
            .join("circle")
            .attr("fill", d => d.children ? color(d.depth) : "white")
            // .attr("pointer-events", d => !d.children ? "none" : null)
            .on("mouseover", function(d) {
                // console.log(d.data.name);
                d3.select(this).attr("stroke", "#000");
                tooltip_div.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                var disp_data;
                if (d.data.children) {
                    disp_data = "Name: " + d.data.name;

                } else {
                    disp_data = "Name: " + d.data.uName + "<br/>" +
                        "Followers: " + d.data.followers + "<br/>" +
                        "Total Times Retweeted: " + d.data.totalTimesRetweeted + "<br/>" +
                        "Total Tweets: " + d.data.totalTweets + "<br/>"
                }
                tooltip_div.html(JSON.stringify(disp_data))
                    .style("left", (d3.event.layerX + 10) + "px")
                    .style("top", (d3.event.layerY + 10) + "px");
                console.log(tooltip_div);
            })
            .on("mouseout", function() {
                d3.select(this).attr("stroke", null);
                return tooltip_div.style("opacity", 0);
            })
            .on("click", d => focus !== d && (zoom(d), d3.event.stopPropagation()));

        const label = svg.append("g")
            .style("font", "10px sans-serif")
            .style("font-weight", "bold")
            .style("color", "white")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(root.descendants())
            .join("text")
            .style("fill-opacity", d => d.parent === root ? 1 : 0)
            .style("display", d => d.parent === root ? "inline" : "none")
            .text(function(d) {
                // console.log(d);

                // return d.data.uName;
            });

        zoomTo([root.x, root.y, root.r * 2]);

        function zoomTo(v) {
            const k = width / v[2];

            view = v;

            label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            node.attr("r", d => d.r * k);
        }

        function zoom(d) {
            const focus0 = focus;

            focus = d;

            const transition = svg.transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .tween("zoom", d => {
                    const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                    return t => zoomTo(i(t));
                });

            label
                .filter(function(d) {
                    return d.parent === focus || this.style.display === "inline";
                })
                .transition(transition)
                .style("fill-opacity", d => d.parent === focus ? 1 : 0)
                .on("start", function(d) {
                    if (d.parent === focus) this.style.display = "inline";
                })
                .on("end", function(d) {
                    if (d.parent !== focus) this.style.display = "none";
                });
        }
    });

}

function on_click_bar() {

    var startTime = new Date().getTime();

    function get_filename(algo_name) {
        return "../jsons/" + algo_name + ".json";

    }

    var filenames = [get_filename("stanford"), get_filename("network"), get_filename("usc")]

    d3.json(filenames[0]).then(function(stanford) {

        d3.json(filenames[1]).then(function(network) {
            d3.json(filenames[2]).then(function(usc) {

                var data = []
                data.push(stanford[0]);
                data.push(network[0]);
                data.push(usc[0]);

                console.log(data);

                var bar_data = []

                data.forEach(d => {

                    var algo_details = {}
                    algo_details.name = d.name;

                    // console.log("d:" + d);
                    d.children.forEach(child_l1 => {
                        var count = 0;
                        child_l1.children.forEach(child_l2 => {

                            child_l2.children.forEach(child_l3 => {
                                count += child_l3.children.length;
                                // console.log(count);
                            });
                            algo_details[child_l1.name] = count;
                        });
                    });

                    bar_data.push(algo_details);
                });

                console.log(bar_data);

                var margin_right = 20;
                var margin_top = 20;
                var margin_left = 50;
                var margin_bottom = 50;
                var svg_width = 800 - margin_left - margin_right;
                var svg_height = 800 - margin_bottom - margin_top;
                var svg_bar_width = 20;

                console.log(Object.keys(bar_data[0]));

                var legend_names = ["Similar Values", "Different Values without any NA", "Different values with NA"];

                var legend_color_map = {
                    'Similar Values': '#005000',
                    "Different Values without any NA": '#000050',
                    'Different values with NA': '#500000'
                };

                var svg_bar_chart = d3.select("#graph")
                    .select("#svg_bar")
                    .attr('width', svg_width + margin_left + margin_right)
                    .attr('height', svg_height + margin_top + margin_bottom)
                    .append('g')
                    .attr('transform', `translate(${margin_left}, ${margin_top})`);

                const svg_bar_x_scale = d3.scaleBand()
                    .range([0, svg_width])
                    .domain(bar_data.map((function(d) {
                        return d.name;
                    })))
                    .padding(0.2);

                const svg_bar_x_scale_1 = d3.scaleBand()
                    .domain(['Similar Values', "Different Values without any NA", 'Different values with NA'])
                    .range([0, svg_bar_x_scale.bandwidth()])
                    .padding(0.1);

                const svg_bar_y_scale = d3.scaleLinear()
                    .range([svg_height, 0])
                    .domain([0, 15000]);

                svg_bar_chart.append('g')
                    .attr('transform', "translate(0," + svg_height + ")")
                    .call(d3.axisBottom(svg_bar_x_scale).ticks(1));

                svg_bar_chart.append('g')
                    .call(d3.axisLeft(svg_bar_y_scale).ticks(10));

                svg_bar_chart.append("text")
                    .attr("transform",
                        "translate(" + (svg_width / 2) + " ," +
                        (svg_height + margin_bottom - 10) + ")")
                    .attr('class', 'axis label')
                    .text("Algorithm");

                svg_bar_chart.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin_left)
                    .attr("x", 0 - (svg_height / 2))
                    .attr("dy", "1em")
                    .attr('class', 'axis label')
                    .text("Performance");

                var svg_bar_chart_legend = svg_bar_chart.selectAll(".legend")
                    .data(legend_names)
                    .enter()
                    .append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) {
                        var h = 50;
                        var x = svg_width / 2;
                        var y = (i * h) - svg_height / 2;
                        return "translate(" +
                            x + "," + y + ")";
                    });

                svg_bar_chart_legend.append("text")
                    .attr('x', svg_width / 1.6)
                    .attr('y', svg_height / 2)
                    .text(function(d) {
                        return d;
                    })
                    .attr("class", "bartext1")
                    .attr("transform", "translate(50,50)");

                svg_bar_chart_legend
                    .append("rect")
                    .attr('x', svg_width / 2 - margin_left)
                    .attr('y', svg_height / 2 + margin_top)
                    .attr("fill", function(d, i) {
                        return legend_color_map[d];
                    })
                    .attr("width", 50)
                    .attr("height", 50);


                const svg_bars = svg_bar_chart.selectAll('.algo_name')
                    .data(bar_data)
                    .enter()
                    .append('g')
                    .attr('class', 'algo_name')
                    .attr("transform", function(d) {
                        return "translate(" + svg_bar_x_scale(d.name) + ",0)";
                    });


                svg_bars.selectAll(".bar.svgbar1")
                    .data(bar_data => [bar_data])
                    .enter()
                    .append('rect')
                    .attr('class', 'bar svgbar1')
                    .attr('x', (d) => svg_bar_x_scale_1('Similar Values'))
                    .attr('y', (d) => svg_bar_y_scale(d['Similar Values']))
                    .attr('height', (d) => svg_height - svg_bar_y_scale(d['Similar Values']))
                    .attr('width', svg_bar_x_scale_1.bandwidth());

                svg_bars.selectAll(".bar.svgbar2")
                    .data(bar_data => [bar_data])
                    .enter()
                    .append('rect')
                    .attr('class', 'bar svgbar2')
                    .attr('x', (d) => svg_bar_x_scale_1("Different Values without any NA"))
                    .attr('y', (d) => svg_bar_y_scale(d["Different Values without any NA"]))
                    .attr('height', (d) => svg_height - svg_bar_y_scale(d["Different Values without any NA"]))
                    .attr('width', svg_bar_x_scale_1.bandwidth());

                svg_bars.selectAll(".bar.svgbar3")
                    .data(bar_data => [bar_data])
                    .enter()
                    .append('rect')
                    .attr('class', 'bar svgbar3')
                    .attr('x', (d) => svg_bar_x_scale_1('Different values with NA'))
                    .attr('y', (d) => svg_bar_y_scale(d['Different values with NA']))
                    .attr('height', (d) => svg_height - svg_bar_y_scale(d['Different values with NA']))
                    .attr('width', svg_bar_x_scale_1.bandwidth());


                svg_bars.selectAll('.bar.bartext1')
                    .data(bar_data => [bar_data])
                    .enter()
                    .append('text')
                    .attr('x', (d) => svg_bar_x_scale_1('Similar Values') + svg_bar_x_scale_1.bandwidth() / 4)
                    .attr('y', (d) => svg_bar_y_scale(d['Similar Values']))
                    .attr('height', (d) => svg_height - svg_bar_y_scale(d['Similar Values']))
                    .attr('width', svg_bar_x_scale_1.bandwidth())
                    .attr('class', 'bartext1')
                    .text(function(d) {
                        return d['Similar Values'];
                    });

                svg_bars.selectAll('.bar.bartext2')
                    .data(bar_data => [bar_data])
                    .enter()
                    .append('text')
                    .attr('x', (d) => svg_bar_x_scale_1("Different Values without any NA") + svg_bar_x_scale_1.bandwidth() / 4)
                    .attr('y', (d) => svg_bar_y_scale(d["Different Values without any NA"]))
                    .attr('height', (d) => svg_height - svg_bar_y_scale(d["Different Values without any NA"]))
                    .attr('width', svg_bar_x_scale_1.bandwidth())
                    .attr('class', 'bartext2')
                    .text(function(d) {
                        return d["Different Values without any NA"];
                    });

                svg_bars.selectAll('.bar.bartext3')
                    .data(bar_data => [bar_data])
                    .enter()
                    .append('text')
                    .attr('x', (d) => svg_bar_x_scale_1('Different values with NA') + svg_bar_x_scale_1.bandwidth() / 4)
                    .attr('y', (d) => svg_bar_y_scale(d['Different values with NA']))
                    .attr('height', (d) => svg_height - svg_bar_y_scale(d['Different values with NA']))
                    .attr('width', svg_bar_x_scale_1.bandwidth())
                    .attr('class', 'bartext2')
                    .text(function(d) {
                        return d['Different values with NA'];
                    });
            });

        });
    });

}