import * as d3 from "d3";

export const def = {
	// colors
	darkBlue: "darkslateblue",
	lightGray: "#edece8",
	darkGray: "#d3d3d3",
	pink: "hotpink",
	altpink: "#E9CFEC",
	purple: "#8C4374",
	darkRed: "crimson",
	labelcolor: "black",
	titlecolor: "blue",
	maincolor: "blue",
	// rounding functions
	nodig: d3.format(".0f"),
	onedig: d3.format(".1f"),
	twodig: d3.format(".2f"),
	// panel dimensions
	pixelsPer: 3,
	pad: {
		left: 60,
		top: 15,
		right: 25,
		bottom: 40,
		inner: 0
	}
} as const;

export type D3Event<T extends Event, E extends Element> = T & { currentTarget: E};

type Phenotypes = number[];

export interface IStudy {
	curves: Phenotypes[];
	times: number[];
}
