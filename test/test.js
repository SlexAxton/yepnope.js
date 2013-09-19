/* jshint -W024 */
/* jshint expr:true */
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
    // Reset this each time to a low amount
    // so we can fail fast in tests. If you get a lot
    // of false positives, increase this.
    yepnope.errorTimeout = 2000;

    // Increment the unique number
    u += 1;
  });

  it('should create a yepnope global', function() {
    expect(window).to.have.property('yepnope');
  });

  describe('Internals', function () {

    describe('injectJS', function () {

      it('should callback after a script is loaded', function (done) {
        var s = js();

        yepnope.injectJs({ src: s.url, wrapped: true }, function () {
          expect(yeptest).to.have.property(s.name);
          done();
        });
      });

      it('should allow me to inject a script without a wrapper', function (done) {
        var s = js(null, true);

        yepnope.injectJs(s.url, function () {
          expect(yeptest).to.have.property(s.name);
          done();
        });
      });

      it('should be tolerant of long loading scripts', function (done) {
        var s = js(1000);

        yepnope.injectJs({ src: s.url, wrapped: true }, function () {
          expect(yeptest).to.have.property(s.name);
          done();
        });
      });

      it('should throw an error on a 404', function (done) {
        yepnope.injectJs({ src: '/s/NOTFOUND.js', wrapped: true }, function (err) {
          expect(err).to.be.an(Error);
          done();
        });
      });

      it('should timeout if it takes too long, and be cancelled', function (done) {
        var oldTimeout = yepnope.errorTimeout;
        var s = js(300);

        // Set the timeout super low
        yepnope.errorTimeout = 100;

        yepnope.injectJs({ src: s.url, wrapped: true}, function (err) {
          // Expect it to have timed out
          expect(err).to.be.an(Error);

          // Make sure it never gets set though.
          window.setTimeout(function () {
            // Here, if the script ran, it would have executed by now
            expect(yeptest).to.not.have.property(s.name);

            // Reset the global timeout
            yepnope.errorTimeout = oldTimeout;
            done();
          }, 400);
        });
      });

      it('should listen to the local timeout over the global timeout', function (done) {
        var s = js(300);

        yepnope.injectJs({ src: s.url, timeout: 100, wrapped: true }, function (err) {
          expect(err).to.be.an(Error);

          window.setTimeout(function () {
            expect(yeptest).to.not.have.property(s.name);
            done();
          }, 400);
        });
      });

      it('should allow additional attributes to the script tags', function (done) {
        var s = js();
        var id = 'script_' + s.name;

        yepnope.injectJs({
          src: s.url,
          attrs: {
            'id': id,
            'name': id
          },
          wrapped: true
        }, function () {
          var scriptElem = document.getElementById(id);

          expect(scriptElem).to.be.ok();
          expect(scriptElem.getAttribute('name')).to.equal(id);

          done();
        });
      });

      it('should call the correct callback when things load out of order.', function (done) {
        var s1 = js(500);
        var s2 = js(250);
        var s3 = js();

        var cbcount = 0;

        // s2 will load first because of the delay

        yepnope.injectJs({src: s1.url, wrapped: true}, function () {
          cbcount++;
          expect(cbcount).to.eql(3);
          expect(yeptest).to.have.property(s1.name);
          expect(yeptest).to.have.property(s2.name);
          done();
        });

        yepnope.injectJs({src: s2.url, wrapped: true}, function () {
          cbcount++;
          expect(cbcount).to.eql(2);
          expect(yeptest).to.have.property(s2.name);
          expect(yeptest).to.not.have.property(s1.name);
        });

        yepnope.injectJs({src: s3.url, wrapped: true}, function () {
          cbcount++;
          expect(cbcount).to.eql(1);
          expect(yeptest).to.have.property(s3.name);
          expect(yeptest).to.not.have.property(s2.name);
          expect(yeptest).to.not.have.property(s1.name);
        });
      });

    });

  });
});
