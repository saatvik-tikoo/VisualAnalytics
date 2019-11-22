function on_click_algo(algo_name) {
    $.ajax({
        url: 'http://localhost:3000/gamergate',
        async: true,
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
            console.log(response);

            // var res = response.data;
            d3.json("../dummy.json").then(function(data) {

                console.log(data);

                var color = d3.scaleLinear()
                    .domain([0, 5])
                    .range(["hsl(298, 62%, 24%)", "hsl(17, 100%, 74%)"])
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

                var tooltip_div = d3.select("body").append("div")
                    .attr("class", "tooltip-tweet")
                    .style("opacity", 0);

                const node = svg.append("g")
                    .selectAll("circle")
                    .data(root.descendants().slice(1))
                    .join("circle")
                    .attr("fill", d => d.children ? color(d.depth) : "white")
                    .attr("pointer-events", d => !d.children ? "none" : null)
                    .on("mouseover", function(d) {
                        d3.select(this).duration(50).attr("stroke", "#000");
                        tooltip_div.transition()
                            .duration(50)
                            .style("opacity", 1);
                        var disp_data = {
                            "Name": d.uName,
                            "Followers": d.followers,
                            "Total Times Retweeted": d.totalTimesRetweeted,
                            "Total Tweets": d.totalTweets

                        }
                        tooltip_div.html(disp_data)
                            .style("left", (d3.event.pageX + 10) + "px")
                            .style("top", (d3.event.pageY - 15) + "px");
                    })
                    .on("mouseout", function() {
                        d3.select(this).duration(50).attr("stroke", null);
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
                        return d.uName;
                    });

                zoomTo([root.x, root.y, root.r * 2]);

                function zoomTo(v) {
                    const k = width / v[2];

                    view = v;

                    label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
                    node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
                    node.attr("r", d => d.r * k);
                }

                }
                tooltip_div.html(disp_data)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 15) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).duration(50).attr("stroke", null);
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
            .text(function (d) {
                return d.uName;
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
                .filter(function (d) {
                    return d.parent === focus || this.style.display === "inline";
                })
                .transition(transition)
                .style("fill-opacity", d => d.parent === focus ? 1 : 0)
                .on("start", function (d) {
                    if (d.parent === focus) this.style.display = "inline";
                })
                .on("end", function (d) {
                    if (d.parent !== focus) this.style.display = "none";
                });
        }
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
            .filter(function (d) {
                return d.parent === focus || this.style.display === "inline";
            })
            .transition(transition)
            .style("fill-opacity", d => d.parent === focus ? 1 : 0)
            .on("start", function (d) {
                if (d.parent === focus) this.style.display = "inline";
            })
            .on("end", function (d) {
                if (d.parent !== focus) this.style.display = "none";
            });
    }

}