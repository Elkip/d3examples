import * as d3 from "d3";

console.log("Enter")
export type D3Event<T extends Event, E extends Element> = T & { currentTarget: E};
const w =  960
const h =  500
const h_button = 50
const w_button = 120
const gap = 25
const r = 10

const svg = d3.select("div#figure")
    .append("svg")
    .attr("height", h+gap+h_button)
    .attr("width", w)

const rect = svg.append("rect")
          .attr("x", 1)
          .attr("y", 1)
          .attr("height", h-2)
          .attr("width", w-2)
          .attr("class", "background")

// birth/death buttons at the bottom
const buttons = svg.selectAll("empty")
   .data([0,1])
   .enter()
   .append("rect")
   .attr("x", (d) => gap + (w_button+gap)*d)
   .attr("y", () => h+gap)
   .attr("height", h_button)
   .attr("width", w_button)
   .attr("class", "button")

// text for the buttons
svg.selectAll("empty")
   .data([0,1])
   .enter()
   .append("text")
   .attr("class", "button")
   .attr("x", (d) => gap + (w_button+gap)*d + w_button/2)
   .attr("y", () => h+gap + h_button/2)
   .text((d) => ["birth", "death"][d]);

// to contain note at top left
const note = svg.append("text")
          .attr("x", 20)
          .attr("y", 20);

// simulate data
const n = 4;
export interface iData {
    x: number;
    y: number;
    id: number;
}
function generate_point(i: number) {
    return {
        x : Math.random()*(w-2*r)+r,
        y: Math.random()*(h-2*r)+r,
        id: i
    }
}
const points: iData[] = d3.range(n).map((i) => generate_point(i));
let points_last: number = n-1;

console.log("points:" + points)
// function to update circles
function update(data: iData[], time= 1000) {
    // @ts-ignore
    const circles =
        svg.selectAll("circle.points")
            .data(data)
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", r)
            .attr("class", "points");

    circles.enter()
        .append("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 0)
        .attr("class", "points")
        .transition()
        .duration(time)
        .attr("r", r);
    circles.exit()
        .attr("class", "dead")
        .transition()
        .duration(time / 2)
        .delay(time / 2)
        .attr("r", 0)
        .remove();
}
// create the initial points
update(points);

// button actions
buttons.on("click", (event: D3Event < MouseEvent, SVGElement > , d) => {
    if (d==1 && points.length > 0) {
        const to_die = Math.floor(Math.random()*points.length);
        note.text(`death to number ${points[to_die].id+1}`);
        points.splice(to_die, 1);
    } else if (d==0) {
        points_last += 1;
        points.push(generate_point(points_last));
        note.text(`birth to number ${points_last + 1}`);
    }
    update(points);
});

