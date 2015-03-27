var expect     = require('chai').expect;
var proxyquire = require('proxyquire');
var Q          = require('q');

var nodeVersions = ['0.0.1','0.0.2','0.0.3','0.0.4','0.0.5','0.0.6','0.1.0','0.1.1','0.1.2','0.1.3','0.1.4','0.1.5','0.1.6','0.1.7','0.1.8','0.1.9','0.1.10','0.1.11','0.1.12','0.1.13','0.1.14','0.1.15','0.1.16','0.1.17','0.1.18','0.1.19','0.1.20','0.1.21','0.1.22','0.1.23','0.1.24','0.1.25','0.1.26','0.1.27','0.1.28','0.1.29','0.1.30','0.1.31','0.1.32','0.1.33','0.1.90','0.1.91','0.1.92','0.1.93','0.1.94','0.1.95','0.1.96','0.1.97','0.1.98','0.1.99','0.1.100','0.1.101','0.1.102','0.1.103','0.1.104','0.2.0','0.2.1','0.2.2','0.2.3','0.2.4','0.2.5','0.2.6','0.3.0','0.3.1','0.3.2','0.3.3','0.3.4','0.3.5','0.3.6','0.3.7','0.3.8','0.4.0','0.4.1','0.4.2','0.4.3','0.4.4','0.4.5','0.4.6','0.4.7','0.4.8','0.4.9','0.4.10','0.4.11','0.4.12','0.5.0','0.5.1','0.5.2','0.5.3','0.5.4','0.5.5','0.5.6','0.5.7','0.5.8','0.5.9','0.5.10','0.6.0','0.6.1','0.6.2','0.6.3','0.6.4','0.6.5','0.6.6','0.6.7','0.6.8','0.6.9','0.6.10','0.6.11','0.6.12','0.6.13','0.6.14','0.6.15','0.6.16','0.6.17','0.6.18','0.6.19','0.6.20','0.6.21','0.7.0','0.7.1','0.7.2','0.7.3','0.7.4','0.7.5','0.7.6','0.7.7','0.7.8','0.7.9','0.7.10','0.7.11','0.7.12','0.8.0','0.8.1','0.8.2','0.8.3','0.8.4','0.8.5','0.8.6','0.8.7','0.8.8','0.8.9','0.8.10','0.8.11','0.8.12','0.8.13','0.8.14','0.8.15','0.8.16','0.8.17','0.8.18','0.8.19','0.8.20','0.8.21','0.8.22','0.8.23','0.8.24','0.8.25','0.8.26','0.8.27','0.8.28','0.9.0','0.9.1','0.9.2','0.9.3','0.9.4','0.9.5','0.9.6','0.9.7','0.9.8','0.9.9','0.9.10','0.9.11','0.9.12','0.10.0','0.10.1','0.10.2','0.10.3','0.10.4','0.10.5','0.10.6','0.10.7','0.10.8','0.10.9','0.10.10','0.10.11','0.10.12','0.10.13','0.10.14','0.10.15','0.10.16','0.10.17','0.10.18','0.10.19','0.10.20','0.10.21','0.10.22','0.10.23','0.10.24','0.10.25','0.10.26','0.10.27','0.10.28','0.10.29','0.10.30','0.10.31','0.10.32','0.10.33','0.10.34','0.10.35','0.10.36','0.10.37','0.10.38','0.11.0','0.11.1','0.11.2','0.11.3','0.11.4','0.11.5','0.11.6','0.11.7','0.11.8','0.11.9','0.11.10','0.11.11','0.11.12','0.11.13','0.11.14','0.11.15','0.11.16','0.12.0','0.12.1'];

var ioVersions = ['1.0.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.1.0', '1.2.0', '1.3.0', '1.4.1', '1.4.2', '1.4.3', '1.5.0', '1.5.1', '1.6.0', '1.6.1', '1.6.2'];

var versionServiceMock = {
  getIojsVersions: function () {
    var q = Q.defer();
    q.resolve({
      all: ioVersions,
      latest: '1.6.2'
    });
    return q.promise;
  },
  getNodeVersions: function () {
    var q = Q.defer();
    q.resolve({
      all: nodeVersions,
      latest: '0.12.1'
    });
    return q.promise;
  }
};

var engine = proxyquire('../../../lib/engines/node', {
  '../versions': versionServiceMock
});

describe('engines/node', function () {

  describe('#resolveVersion', function () {
    describe('when no version is specified', function () {
      it('returns the latest stable node version', function (done) {
        engine.resolveVersion({ engines: {}})
          .then(function(version) {
            expect(version).to.equal('0.12.1');
            done();
          });
      });
    });

    describe('when a valid node version is specified', function () {
      it('returns the specified version', function (done) {
        var opts = { engines: { 'node': '0.0.1' }};
        engine.resolveVersion(opts)
          .then(function(version) {
            expect(version).to.equal('0.0.1');
            done();
          });
      });
    });

    describe('when an asterisk is provided', function () {
      it('returns the latest stable node version', function (done) {
        var opts = { engines: { 'node': '*' }};
        engine.resolveVersion(opts)
          .then(function(version) {
            expect(version).to.equal('0.12.1');
            done();
          });
      });
    });

    describe('when a tilde range is provided', function () {
      it('resolves the appropriate semantic version', function (done) {
        var opts = { engines: { 'node': '~0.10' }};
        engine.resolveVersion(opts)
          .then(function(version) {
            expect(version).to.equal('0.10.38');
            done();
          });
      });
    });

    describe('when an caret range is provided', function () {
      it('resolves the appropriate semantic version', function (done) {
        var opts = { engines: { 'node': '^0.10' }};
        engine.resolveVersion(opts)
          .then(function(version) {
            expect(version).to.equal('0.10.38');
            done();
          });
      });
    });

    describe('when an x-version is provided', function () {
      it('resolves the appropriate semantic version', function (done) {
        var opts = { engines: { 'node': '0.8.x' }};
        engine.resolveVersion(opts)
          .then(function(version) {
            expect(version).to.equal('0.8.28');
            done();
          });
      });
    });

  });

});