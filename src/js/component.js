require('./component.scss');

module.exports = function () {
  const element = document.createElement('header');

  let html = '<img src="/images/icon.png">';
  html += '<div>gulp-webpack-seed-kit</div>';
  element.innerHTML = html;
  return element;
};
