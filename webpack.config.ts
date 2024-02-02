const path = require('path');

module.exports = {
    mode: 'none',
    entry: {
        manycurves: './src/manycurves/pasta.ts',
        birth_death: './src/birth_death/script.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
       extensions: ['.tsx','.ts','.js'],
    },
    output: {
        filename: '[name].js',
        chunkFilename: "[name].chunk.js",
        path: path.resolve(__dirname, 'build/'),
    },
};
