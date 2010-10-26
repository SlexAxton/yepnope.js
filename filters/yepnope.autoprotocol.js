/**
 * Yepnope AutoProtocol Filter
 * Version 1.0
 * WTFPL
 * Usage: ['//mysite.com/script.js']
 */
yepnope.addFilter(function(resource){
  // protocol adding
  if (/^\/\//.test(resource.url)) {
    resource.url = window.location.protocol + resource.url;
  }
  return resource;
});
