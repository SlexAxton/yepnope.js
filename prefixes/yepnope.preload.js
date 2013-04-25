 /**
 * Yepnope preload prefix
 *
 * Use the preload! modifier to cache content but not execute it
 * Usage: ['preload!asset.js']
 *
 * Official Yepnope Plugin
 *
 * WTFPL License
 *
 * by Alex Sexton | AlexSexton@gmail.com
 */
yepnope.addPrefix( 'preload', function ( resource ) {
  resource.noexec = true;
  return resource;
});