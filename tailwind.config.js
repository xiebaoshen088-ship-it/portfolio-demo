// Supplied font aliases for any future Tailwind build. The current demo is buildless CSS.
module.exports = {
 content: ['./dist/index.html', './dist/*.js'],
 theme: {
  extend: {
   fontFamily: {
    kudryashev: ['"Kudryashev Display"', 'serif'],
    grotesk: ['"Space Grotesk"', 'sans-serif'],
    helvetica: ['"Helvetica Neue Light"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
   },
  },
 },
};
