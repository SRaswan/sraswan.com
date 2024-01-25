module.exports = {
    content: [
      './_drafts/**/*.html',
      './_includes/**/*.html',
      './_layouts/**/*.html',
      './_pages/**/*.html',
      './_posts/*.md',
      './*.md',
      './*.html',
    ],
    theme: {
      theme: {
        extend: {},
      },
    },
    plugins: [ ],
    purge: [
        './**/*.html'
      ],
}