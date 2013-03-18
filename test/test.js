describe('yepnope', function() {
  // A unique number for each load
  var u = (new Date()).getTime();
  function js (delay, nowrap) {
    // Can cause skips, but ensures we're unique when
    // we do multiple urls in one test
    u += 1;
    var name = 't' + u;
    return {
      name: name,
      url: '/s/js/' +
           (delay ? 'sleep-' + delay + '/' : '' ) +
           (nowrap ? 'no-wrap/' : '') +
           name + '.js'
    };
  }

  beforeEach(function () {
    u += 1;
  });

  it('should create a yepnope global', function() {
    expect(window).to.have.property('yepnope');
  });

  describe('Internals', function () {

    describe('injectJS', function () {

      it('should callback after a script is loaded', function (done) {
        var s = js();

        yepnope.injectJs(s.url, function () {
          expect(yeptest).to.have.property(s.name);
          done();
        });
      });

      it('should be tolerant of long loading scripts', function (done) {
        var s = js(2);

        yepnope.injectJs(s.url, function () {
          expect(yeptest).to.have.property(s.name);
          done();
        });
      });

      it('should throw an error on a 404', function (done) {
        yepnope.injectJs('/s/NOTFOUND.js', function (err) {
          expect(err).to.be.instanceOf(Error);
          done();
        });
      });

    });

  });
});
