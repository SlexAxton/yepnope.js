/**
 * YepNope Path Filter
 *
 * Usage:
 *   yepnope.paths = {
 *     'google': '//ajax.googleapis.com/ajax',
 *     'my-cdn': '//cdn.myawesomesite.com'
 *   };
 *   yepnope({
 *     load: ['google/jquery/1.7.2/jquery.min.js', 'google/jqueryui/1.8.18/jquery-ui.min.js', 'my-cdn/style.css', '/non/path/directory/file.js']
 *   });
 *
 * Official Yepnope Plugin
 *
 * WTFPL License
 *
 * by Kenneth Powers | mail@kenpowers.net
 */
(function () {
  var addPathFilter = function (yn) {
      // add each prefix
      yn.addFilter(function (resource) {
        // check each url for path
        for (path in yn.paths) {
          var pathRegExp = new RegExp('^'  + path);
          if (resource.url.match(pathRegExp)) {
            resource.url = resource.url.replace(pathRegExp, yn.paths[path]);
            return resource;
          }
        }
        // carry on my wayward, son
        return resource;
      });
    };
  if (yepnope) addPathFilter(yepnope);
  else if (modernizr.load) addPathFilter(modernizr.load);
})();
