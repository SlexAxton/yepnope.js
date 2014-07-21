/* jshint -W024 */
/* jshint expr:true */
describe('yepnope', function() {
  // A unique number for each load
  var u = (new Date()).getTime();
  function js (delay) {
    // Can cause skips, but ensures we're unique when
    // we do multiple urls in one test
    u += 1;
    var name = 't' + u;
    return {
      name: name,
      url: '/s/js/' +
           (delay ? 'sleep-' + delay + '/' : '' ) +
           name + '.js'
    };
  }

  function css (delay) {
    function rand (){
      return Math.floor((255*Math.random()));
    }
    // Can cause skips, but ensures we're unique when
    // we do multiple urls in one test
    u += 1;
    var vals = [rand(), rand(), rand()];
    var name = vals.join(',');
    return {
      name: name,
      val: vals,
      url: '/s/css/' +
           (delay ? 'sleep-' + delay + '/' : '' ) +
           name + '.css'
    };
  }

  var testDivZone = document.getElementById('testDivZone');

  function checkStyle (cssObj) {
    var id = 'item_' + cssObj.val.join('');

    var elem = document.createElement('div');
    elem.id = id;
    testDivZone.appendChild(elem);
    return (window.getComputedStyle(elem).color === 'rgb(' + cssObj.val.join(', ') + ')') ? true : false;
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

        yepnope.injectJs({ src: s.url }, function () {
          expect(yeptest).to.have.property(s.name);
          done();
        });
      });

      it('should be tolerant of long loading scripts', function (done) {
        var s = js(1000);

        yepnope.injectJs({ src: s.url }, function () {
          expect(yeptest).to.have.property(s.name);
          done();
        });
      });

      it('should throw an error on a 404', function (done) {
        yepnope.injectJs({ src: '/s/NOTFOUND.js' }, function (err) {
          expect(err).to.be.an(Error);
          done();
        });
      });

      it('should timeout if it takes too long, and be cancelled', function (done) {
        var oldTimeout = yepnope.errorTimeout;
        var s = js(300);

        // Set the timeout super low
        yepnope.errorTimeout = 100;

        yepnope.injectJs({src: s.url}, function (err) {
          // Expect it to have timed out
          expect(err).to.be.an(Error);

          // We can't really do anything about it if it still eventually loads.
          done();
        });
      });

      it('should listen to the local timeout over the global timeout', function (done) {
        var s = js(300);

        yepnope.injectJs({ src: s.url, timeout: 100 }, function (err) {
          expect(err).to.be.an(Error);
          done();
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
          }
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

        // files will load in reverse because of the delay

        yepnope.injectJs({src: s1.url}, function () {
          cbcount++;
          expect(cbcount).to.eql(3);
          expect(yeptest).to.have.property(s1.name);
          expect(yeptest).to.have.property(s2.name);
          done();
        });

        yepnope.injectJs({src: s2.url}, function () {
          cbcount++;
          expect(cbcount).to.eql(2);
          expect(yeptest).to.have.property(s2.name);
          expect(yeptest).to.not.have.property(s1.name);
        });

        yepnope.injectJs({src: s3.url}, function () {
          cbcount++;
          expect(cbcount).to.eql(1);
          expect(yeptest).to.have.property(s3.name);
          expect(yeptest).to.not.have.property(s2.name);
          expect(yeptest).to.not.have.property(s1.name);
        });
      });

    });

    describe('injectCss', function () {
      it('should inject a css file', function (done) {
        var s = css();
        yepnope.injectCss(s.url, function () {
          setTimeout(function(){
            expect(checkStyle(s)).to.be.ok();
            done();
          }, 50);
        });
      });
    });
  });

  describe('Public api', function() {
    describe('JS', function() {
      it('should load a single script via a string', function(done) {
        var s = js();
        yepnope(s.url);
        setTimeout(function() {
          expect(yeptest).to.have.property(s.name);
          done();
        }, 50);
      });

      it('should add in yep param, single test', function(done) {
        var s = js();
        yepnope(s.url, {
          istrue: true
        }, function() {
          expect(yeptest[s.name].tests).to.be.ok();
          expect(yeptest[s.name].tests.yep).to.be.ok();
          expect(yeptest[s.name].tests.yep).to.contain('istrue');
          done();
        });
      });

      it('should add in yep param, multiple tests', function(done) {
        var s = js();
        yepnope(s.url, {
          istrue: true,
          isalsotrue: true,
          isalsoreallytrue: true
        }, function() {
          expect(yeptest[s.name].tests).to.be.ok();
          expect(yeptest[s.name].tests.yep).to.be.ok();
          expect(yeptest[s.name].tests.yep).to.contain('istrue');
          expect(yeptest[s.name].tests.yep).to.contain('isalsotrue');
          expect(yeptest[s.name].tests.yep).to.contain('isalsoreallytrue');
          done();
        });
      });

      it('should add in nope param, single test', function(done) {
        var s = js();
        yepnope(s.url, {
          isfalse: false
        }, function() {
          expect(yeptest[s.name].tests).to.be.ok();
          expect(yeptest[s.name].tests.nope).to.be.ok();
          expect(yeptest[s.name].tests.nope).to.contain('isfalse');
          done();
        });
      });

      it('should add in nope param, multiple tests', function(done) {
        var s = js();
        yepnope(s.url, {
          isfalse: false,
          isalsofalse: false,
          isalsoreallyfalse: false
        }, function() {
          expect(yeptest[s.name].tests).to.be.ok();
          expect(yeptest[s.name].tests.nope).to.be.ok();
          expect(yeptest[s.name].tests.nope).to.contain('isfalse');
          expect(yeptest[s.name].tests.nope).to.contain('isalsofalse');
          expect(yeptest[s.name].tests.nope).to.contain('isalsoreallyfalse');
          done();
        });
      });

      it('should add in both params, multiple tests', function(done) {
        var s = js();
        yepnope(s.url, {
          isfalse: false,
          isalsofalse: false,
          isalsoreallyfalse: false,
          istrue: true,
          isalsotrue: true,
          isalsoreallytrue: true
        }, function() {
          expect(yeptest[s.name].tests).to.be.ok();
          expect(yeptest[s.name].tests.nope).to.be.ok();
          expect(yeptest[s.name].tests.nope).to.contain('isfalse');
          expect(yeptest[s.name].tests.nope).to.contain('isalsofalse');
          expect(yeptest[s.name].tests.nope).to.contain('isalsoreallyfalse');
          expect(yeptest[s.name].tests.yep).to.be.ok();
          expect(yeptest[s.name].tests.yep).to.contain('istrue');
          expect(yeptest[s.name].tests.yep).to.contain('isalsotrue');
          expect(yeptest[s.name].tests.yep).to.contain('isalsoreallytrue');
          done();
        });
      });

      it('should correctly encode url params', function(done) {
        var s = js();
        yepnope(s.url, {
          'isCray™&?': true
        }, function() {
          expect(yeptest[s.name].tests).to.be.ok();
          expect(yeptest[s.name].tests.yep).to.be.ok();
          expect(yeptest[s.name].tests.yep).to.contain('isCray™&?');
          done();
        });
      });

      it('should allow you to override the url formatter', function(done) {
        var s = js();
        var oldFormatter = yepnope.urlFormatter;
        yepnope.urlFormatter = function(url, tests) {
          var parts = url.split('.');
          var extension = parts.pop();
          var filename = parts.join('.');
          var passes = [];

          if (tests) {
            for(var testname in tests) {
              if (tests.hasOwnProperty(testname) && tests[testname]) {
                passes.push(testname);
              }
            }
          }
          if (passes.length) {
            return filename + '-' + passes.join('-') + '.' + extension;
          }
          return url;
        };
        yepnope(s.url, {
          'iscray': true,
          'isnotcray': false,
          'anotherday': true
        }, function() {
          expect(yeptest[s.name + '-iscray-anotherday']).to.be.ok();
          done();
        });
        yepnope.urlFormatter = oldFormatter;
      });
    });

    describe('CSS', function() {
      it('should load a single css file via a string', function(done) {
        var s = css();
        yepnope(s.url);
        setTimeout(function() {
          expect(checkStyle(s)).to.be.ok();
          done();
        }, 50);
      });
    });

  });
});
