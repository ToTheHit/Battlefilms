const ghpages = require('gh-pages');

ghpages.publish('build', {
  message: 'Updated GitHub Pages version to 0.2',
}, (err) => {
  if (err) {
    console.log(err);
  }
});
