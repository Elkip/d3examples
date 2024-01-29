Phenotypes measured over time
----------------------------------------------------------------------

Original [here](http://www.biostat.wisc.edu/~kbroman/D3/manycurves). Updated
from Coffee-Script to Typescript and updated D3 syntax to v7.

Thank you to Dr. Broman for the excellent D3 examples!

The top panel is an image plot of phenotype, measured over time,
for many individuals.  The rows correspond to individuals.

Hover over a row to see the detailed time course below.

Click on a row and the curve below will be retained as you move
away.  Click again (if you can get your pointer onto it) and it will
be removed.

## Prereqs

This project requires NodeJS (version 18 or later) and NPM.

```sh
$ npm -v && node -v
9.5.0
v18.15.0
```


### Installation

Requires the D3.js V7 ibrary

```sh
$ npm install
```

## Usage

### Building

```sh
$ npm run build
```

To compile files into build/

```sh
$ npm run watch
```

To continously monitor for changes and rebuild instantly, for development.

### Serving the App
```sh
$ npm start
```
