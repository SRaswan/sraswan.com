module.exports = {
    plugins: [
      require('tailwindcss'),
      require('autoprefixer'),
      ...(process.env.JEKYLL_ENV == 'production'
        ? [require('cssnano')({ preset: 'default' })]
        : [])
    ]
}
// module.exports = {
//     plugins: {
//       tailwindcss: {},
//       autoprefixer: {},
//     },
//   }