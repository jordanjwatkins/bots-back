module.exports = {
  plugins: [
    require('postcss-easy-import')(),
    require('precss')(),
    //require('autoprefixer')(),
    require('cssnano')({
      comments: { removeAll: true },
    }),
  ],
}
