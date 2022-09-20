// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');


const mode = 'development';

const rules = [
    {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
    },
    {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
    },
];

const extensions = ['.tsx', '.ts', '.jsx', '.js'];


/**
 * @type {import('webpack').Configuration[]}
 */
const config = [
    {
        target: 'web',
        entry: './src/browser.ts',
        mode,
        output: {
            path: path.resolve(__dirname, 'dist', 'client'),
        },
        plugins: [
            new HotModuleReplacementPlugin(),
            new MiniCssExtractPlugin(),

            new StatsWriterPlugin({
                stats: {
                    all: false,
                    assets: true,
                },
            })
        ],
        module: {
            rules: [
                ...rules,
                {
                    test: /\.css$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                esModule: false,
                                modules: {
                                    namedExport: false
                                }
                            }
                        }
                    ]
                },
            ],
        },
        resolve: {
            extensions,
        },
        experiments: {
            /**
             * NOTE:
             * Enabling lazy compilation will lead to flashing css styles
             * as required files are loaded dynamically on client side
             */
            lazyCompilation: {
                entries: true,
                imports: true,
                backend: {
                    listen: 4001
                }
            },
        }
    },
    {
        target: 'node',
        entry: './src/server.tsx',
        mode,
        output: {
            path: path.resolve(__dirname, 'dist', 'server'),
        },
        plugins: [],
        module: {
            rules: [
                ...rules,
                {
                    test: /\.css$/i,
                    loader: "css-loader",
                    options: {
                        modules: {
                            exportOnlyLocals: true,
                        },
                    },
                },
            ],
        },
        resolve: {
            extensions,
        },
    }
];

module.exports = config;