const pkg = require( '../package.json' );
const path = require( 'path' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

const DEV = process.env.NODE_ENV === 'dev';

const jsLoader = [
    'babel-loader?presets[]=es2015,presets[]=stage-0,presets[]=react,plugins[]=babel-plugin-transform-decorators-legacy'
];

const htmlLoader = [
    'file-loader?name=[path][name].[ext]',
    'template-html-loader?' + [
        'raw=true',
        'engine=lodash',
        'version=' + pkg.version,
        'title=' + pkg.title || pkg.name,
        'name=' + pkg.title,
        'env=' + process.env.NODE_ENV
    ].join( '&' )
].join( '!' );

var cssLoader;
const sassParams = [
    'outputStyle=expanded'
];

if( DEV ) {
    sassParams.push( 'sourceMap', 'sourceMapContents=true' );
    cssLoader = [
        'style-loader',
        'css-loader?localIdentName=[path][name]---[local]---[hash:base64:5]',
        'postcss-loader'
    ].join( '!' );
} else {
    cssLoader = ExtractTextPlugin.extract( 'style-loader', [
        'css-loader?localIdentName=[hash:base64]',
        'postcss-loader'
    ].join( '!' ) );
}


module.exports = [
    {
        test:    /\.jsx?$/,
        exclude: /node_modules(?!(\\|\/)react-forms-validation)/,
        loaders: jsLoader
    },
    {
        test:   /\.html$/,
        loader: htmlLoader
    },
    {
        test:    /\.css$/,
        loader:  cssLoader
    },
    {
        test: /\.(jpe?g|gif|png)$/,
        loader: 'file-loader?name=images/[name].[ext]?[hash]'
    },
    {
        test:   /\.woff(2)?(\?.*)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
    },
    {
        test:   /\.(eot|svg|ttf|otf)(\?.*)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
    }
];
