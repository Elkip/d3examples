import { D3Event, def } from "./constants";
import * as d3 from "d3";
// import { color, rgb, scaleQuantile } from "d3";

type Phenotypes = number[];
interface IStudy {
    curves: Phenotypes[];
    times: number[];
}
d3.json < IStudy > ("curves.json").then((data) => {
    if (data === undefined) {
        return;
    }
    d3.select("p#loading").remove();
    d3.select("div#legend").style("opacity", 1);
    var curInd: number;
    const clickColors = ["blue", "red", "green", "orange", "purple"];
    // Size of dataset
    const nTimes: number = data.times.length;
    const nInd: number = data.curves.length;
    // min and max phenotype plus average
    let phenoList: any[] = [];
    let minPhe: number = 999;
    let maxPhe: number = -999;
    let avePhe: number[] = [];
    for (let i in data.curves) {
        avePhe[i] = 0;
        for (let j in data.curves[i]) {
            let phe = data.curves[i][j];
            avePhe[i] += phe;
            phenoList.push({
                row: i,
                col: j,
                value: phe
            });
            if (minPhe > phe) {
                minPhe = phe;
            }
            if (maxPhe < phe) {
                maxPhe = phe;
            }
        }
        avePhe[i] /= nTimes;
    }
    // order individuals by average phenotype
    const orderedInd: number[] = d3.range(nInd)
        .sort(function(a, b) {
            if (avePhe[a] > avePhe[b]) {
                return -1;
            }
            if (avePhe[b] < avePhe[a]) {
                return +1;
            }
            return 0;
        });
    // Not sure what this does?
    // create index
    let indexInd = orderedInd.slice(0);
    for (let i of orderedInd) {
        indexInd[orderedInd[i]] = i;
    }
    // height/width
    const width = nTimes * def.pixelsPer;
    const height = [nInd * def.pixelsPer, 200];
    const totalw = width +
        def.pad.left + def.pad.right + 40;
    const totalh = height[0] + height[1] +
        def.pad.top + def.pad.bottom + 100;
    // SVG To contain upper and lower panels
    const svg = d3.select("div#curvesfig")
        .append("svg")
        .attr("height", totalh)
        .attr("width", totalw);
    // Add groups and translate to (0,0) origin
    // Lasagna Group
    const image = svg.append("g")
        .attr("id", "imagepanel")
        .attr("transform", `translate(${def.pad.left},${def.pad.top})`);
    // Speghetti Group
    const curve = svg.append("g")
        .attr("id", "curvepanel")
        .attr("transform", `translate(${def.pad.left},${def.pad.top * 2 +
def.pad.bottom + height[0]})`)
    // background rectangle for upper panel
    image.append("rect")
        .attr("height", height[0])
        .attr("width", width)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    // background rectangle for lower panel
    curve.append("rect")
        .attr("height", height[1])
        .attr("width", width)
        .attr("fill", def.lightGray)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    // SCALES are a function that returns a location for a given data point
    // X/Y Scales for upper Lasagna plot
    const xScaleImg = d3.scaleBand < number > ()
        .domain(d3.range(nTimes))
        .range([0, def.pixelsPer * (nTimes - 1) + 1]);
    const yScaleImg = d3.scaleBand < number > ()
        .domain(d3.range(nInd).reverse())
        .range([0, def.pixelsPer * (nInd - 1) + 1]);
    // X/Y Scales for lower Speghetti Plot
    const xScaleCurve = d3.scaleLinear()
        .domain([0, d3.max(data.times) ? ? 0])
        .range([def.pixelsPer / 2, width - def.pixelsPer / 2]);
    const yScaleCurve = d3.scaleLinear()
        .domain([minPhe, maxPhe])
        .range([height[1] - def.pad.inner, def.pad.inner]);
    // COLORS for Lasagna Plot
    let dif: number = maxPhe + 45; // center color at -45
    const difdown = -45 - minPhe;
    if (dif < difdown) {
        dif = difdown;
    }
    const n_colors = 128;
    const colorseq = (function() {
        var results = [];
        for (let k = 0; 0 <= n_colors ? k <= n_colors : k >= n_colors; 0 <= n_colors ? k++ : k--) {
            results.push(k);
        }
        return results;
    }).apply(this);
    for (let i in colorseq) {
        colorseq[i] /= n_colors;
    }
    let redblue = [];
    // White to blue
    for (let k = 0, len = colorseq.length; k < len; k++) {
        redblue.push(d3.interpolateRgb("#2166ac", "#f7f7f7")(colorseq[k]));
    }
    let ref = colorseq.slice(1);
    // Red to white
    for (let l = 0, len1 = ref.length; l < len1; l++) {
        redblue.push(d3.interpolateRgb("#f7f7f7", "#b2182b")(ref[l]));
    }
    // on the graph for a given input
    const zScaleImg = d3.scaleQuantize < string > ()
        .domain([-45 - dif, -45 + dif])
        .range(redblue); // controls opacity
    // AXES - LASAGNA PLOT
    // x1: The x pos of the first end of the line from the left of screen.
    // y1: The y pos of the first end of the line from the top of screen.
    // x2: The x pos of the second end of the line from the left of screen.
    // y2: The y pos of the second end of the line from the top of screen.
    const topAxes = image.append("g")
        .attr("id", "topAxes")
        .attr("pointer-events", "none");
    // X AXIS - LASAGNA PLOT
    const xTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // X Axis Line
    topAxes.selectAll("empty")
        .data(xTicks)
        .enter()
        .append("line")
        .attr("x1", (d) => {
            return xScaleImg(d * 30 - 1) ? ? 0 +
                def.pixelsPer / 2;
        })
        .attr("x2", (d) => {
            return xScaleImg(d * 30 - 1) ? ? 0 + def.pixelsPer / 2;
        })
        .attr("y1", height[0])
        .attr("y2", height[0] + def.pad.bottom * 0.1)
        .attr("stroke", def.labelcolor);
    // X axis tick marks / label
    topAxes.selectAll("empty")
        .data(xTicks)
        .enter()
        .append("text")
        .text((d) => {
            return d;
        })
        .attr("x", (d) => {
            return xScaleImg(d * 30 - 1) ? ? 0 +
                def.pixelsPer / 2;
        })
        .attr("y", height[0] + def.pad.bottom * 0.2)
        .attr("fill", def.labelcolor)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "hanging");
    // X axis label
    topAxes.append("text")
        .attr("x", width / 2)
        .attr("y", height[0] + def.pad.bottom * 0.75)
        .text("Time (hours)")
        .attr("fill", def.titlecolor)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "hanging");
    // Y AXIS - LASAGNA PLOT
    const topyTicks = [49, 99, 149];
    // Y Axis Line
    topAxes.selectAll("empty").data(topyTicks)
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("x2", -def.pad.left * 0.1)
        .attr("y1", d => {
            return yScaleImg(d) ? ? 0;
        })
        .attr("y2", (d) => {
            return yScaleImg(d) ? ? 0;
        })
        .attr("stroke", def.labelcolor);
    // Y axis ticks / labels
    topAxes.selectAll("empty")
        .data(topyTicks)
        .enter()
        .append("text")
        .text((d) => {
            return d + 1;
        })
        .attr("x", -def.pad.left * 0.2)
        .attr("y", (d) => {
            return yScaleImg(d) ? ? 0;
        })
        .attr("fill", def.labelcolor)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle");
    // Y Axis Label
    let xloc: number = -def.pad.left * 0.75;
    let yloc: number = height[0] / 2;
    topAxes.append("text")
        .attr("x", xloc)
        .attr("y", yloc)
        .text("Lines (sorted)")
        .attr("fill", def.titlecolor)
        .attr("text-anchor", "middle")
        .attr("transform", `rotate(270,${xloc},${yloc})`);
    // X AXIS - SPEGHETTI PLOT
    const botAxes = curve.append("g")
        .attr("id", "botAxes")
        .attr("pointer-events", "none");
    // X Axis line
    botAxes.selectAll("empty")
        .data(xTicks)
        .enter()
        .append("line")
        .attr("x1", (d) => {
            return xScaleCurve(d * 60);
        })
        .attr("x2", function(d) {
            return xScaleCurve(d * 60);
        })
        .attr("y1", height[1])
        .attr("y2", 0)
        .attr("stroke", "black");
    // X axis ticks / labels
    botAxes.selectAll("empty")
        .data(xTicks)
        .enter()
        .append("text")
        .text((d) => {
            return d;
        })
        .attr("x", (d) => {
            return xScaleCurve(d * 60);
        })
        .attr("y", height[1] + def.pad.bottom * 0.1)
        .attr("fill", def.labelcolor)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "hanging");
    // X Axis Label
    botAxes.append("text")
        .attr("x", width / 2)
        .attr("y", height[1] + def.pad.bottom * 0.65)
        .text("Time (hours)")
        .attr("fill", def.titlecolor)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "hanging");
    const botyTicks = yScaleCurve.ticks(5);
    // Y Axis Line
    botAxes.selectAll("empty")
        .data(botyTicks)
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", function(d) {
            return yScaleCurve(d);
        })
        .attr("y2", function(d) {
            return yScaleCurve(d);
        })
        .attr("stroke", "black");
    // Y Axis Ticks / label
    botAxes.selectAll("empty")
        .data(botyTicks)
        .enter()
        .append("text")
        .text(function(d) {
            return d;
        })
        .attr("x", -def.pad.left * 0.1)
        .attr("y", (d) => {
            return yScaleCurve(d);
        })
        .attr("fill", def.labelcolor)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle");
    // Y Axis Label
    xloc = -def.pad.left * 0.65;
    yloc = height[1] / 2;
    botAxes.append("text")
        .attr("x", xloc)
        .attr("y", yloc)
        .text("Phenotype")
        .attr("fill", def.titlecolor)
        .attr("text-anchor", "middle")
        .attr("transform", `rotate(270,${xloc},${yloc})`);
    // keep track of "clicked" status
    var clicked: boolean[] = [];
    for (let i in orderedInd) {
        clicked[i] = false;
    }
    // the hover pixels in the upper panel
    const imgPixels = image.append("g")
        .attr("id", "imgPixels")
        .selectAll("rect")
        .data(phenoList)
        .enter()
        .append("rect")
        .attr("class", "imgPixels")
        .attr("x", (d) => {
            const x = xScaleImg(+d.col) ? ? 0;
            return x;
        })
        .attr("y", (d) => {
            const y = yScaleImg(indexInd[+d.row]);
            return y ? ? 0;
        })
        .attr("height", def.pixelsPer)
        .attr("width", def.pixelsPer)
        .attr("fill", function(d) {
            return zScaleImg(d.value);
        })
        .attr("stroke", function(d) {
            return zScaleImg(d.value);
        })
        .attr("stroke-width", 0.5)
        .on("mouseover", (event: D3Event < MouseEvent, SVGGElement > , d) =>
            drawCurve(d.row)
        )
        .on("click", (event: D3Event < MouseEvent, SVGGElement > , d) =>
            clickCurve(d.row)
        );
    // background curves for all individuals on lower chart
    const bgdcurves = curve.append("g")
        .attr("id", "bgdphecurve");
    for (let i in data.curves) {
        bgdcurves.append("path")
            .datum(data.times)
            .attr("d", phecurve(+i))
            .attr("stroke", "rgb(170, 170, 170)")
            .attr("fill", "none")
            .attr("stroke-width", 0.5);
    }
    // Add color scale legend on spegheti plot
    const yVals = (() => {
        let results = [];
        for (var m = 0, ref1 = height[1]; 0 <= ref1 ? m < ref1 : m > ref1; 0 <=
            ref1 ? m++ : m--) {
            results.push(m);
        }
        return results;
    }).apply(this);
    for (let i in yVals) {
        yVals[+i] = minPhe + (maxPhe - minPhe) * +i / height[1];
    }
    const xPos = width + 10;
    return curve.append("g")
        .attr("id", "colorscale")
        .selectAll("empty")
        .data(yVals)
        .enter()
        .append("rect")
        .attr("x", xPos)
        .attr("width", def.pad.right - 10)
        .attr("y", (d) =>
            yScaleCurve(d)
        )
        .attr("height", 1)
        .attr("fill", (d) =>
            zScaleImg(d)
        )
        .attr("stroke", (d) =>
            zScaleImg(d)
        )
        .attr("stroke-width", 0.5);
    // phenotype curve for an individual
    function phecurve(ind: number): d3.Line < number > {
        if (data === undefined) {
            return d3.line(); // empty line
        }
        return d3.line < number > ()
            .x((d) => {
                return xScaleCurve(d) ? ? 0;
            })
            .y((d, di) => {
                return yScaleCurve(data.curves[ind][di]);
            });
    };

    function drawCurve(ind: number) {
        if (data === undefined) {
            return;
        }
        let thecurve;
        if (ind === curInd) {
            return 0;
        }
        curInd = ind;
        d3.select("g#phecurve").remove();
        // Draw the Curve on the Speghetti Plot
        thecurve = curve.append("g").attr("id", "phecurve");
        thecurve.append("path")
            .attr("id", "phecurve")
            .datum(data.times)
            .attr("d", phecurve(ind))
            .attr("stroke", def.darkBlue)
            .attr("fill", "none")
            .attr("stroke-width", "2");
        // text to indicate individual
        return thecurve.append("text")
            .datum(ind)
            .text(`line ${ind * 1 + 1}`)
            .attr("x", xScaleCurve(7 * 60 + 10))
            .attr("y", (yScaleCurve(0) + yScaleCurve(-20)) / 2)
            .attr("text-anchor", "start")
            .attr("fill", def.darkBlue)
            .attr("dominant-baseline", "middle");
    }
    // function to draw curve for an individual
    function clickCurve(ind: number) {
        if (data === undefined) {
            return;
        }
        var curcolor, thecurve;
        if (clicked[ind]) {
            clicked[ind] = false;
            d3.select(`g#phecurve_${ind}`).remove();
            d3.select(`rect#pherect_${ind}`).remove();
            return drawCurve(ind); // put the darkBlue curve there
        } else {
            d3.select("path#phecurve").remove(); // delete the darkBlue curve
            (but leave text)
            curcolor = clickColors.shift() ? ? "white";
            clickColors.push(curcolor);
            clicked[ind] = true;
            // actually draw the curve
            thecurve = curve.append("g")
                .attr("id", `phecurve_${ind}`);
            thecurve.append("path")
                .datum(data.times)
                .attr("d", phecurve(ind))
                .attr("stroke", curcolor)
                .attr("fill", "none")
                .attr("stroke-width", 2);
            return image.append("rect")
                .attr("id", `pherect_${ind}`)
                .attr("x", 0)
                .attr("width", width)
                .attr("y", yScaleImg(indexInd[ind]) ? ? 0)
                .attr("height", def.pixelsPer)
                .attr("fill", "none")
                .attr("stroke", curcolor)
                .attr("stroke-width", 1)
                .attr("pointer-events", "none");
        }
    };
});