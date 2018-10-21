let assert = require('assert');

let SemVer = require('./semver.js');

describe('SemVer', function() {
    describe('SemVer()', () => {
        it('should create an object correctly', function() {
            let semver = new SemVer('0.0.0');
            assert.equal([1,2,3].indexOf(4), -1); // TODO: some better test here
        });
    });
    describe('#toString()', () => {
        it('should put a string', () => {
            let semver = new SemVer('0.0.0');
            assert.equal(semver.toString(),'0.0.0');
        });
    });
    describe('#bumpMajorFrom()', () => {
        it('should put bump the major version', () => {
            let semver = new SemVer('0.0.0');
            let baseSemver = new SemVer('0.0.1');

            semver.bumpMajorFrom(baseSemver);
            assert.equal(semver.toString(),'1.0.0');
        });
    });
    describe('#bumpMinorFrom()', () => {
        it('should put bump the minor version', () => {
            let semver = new SemVer('0.0.0');
            let baseSemver = new SemVer('0.0.1');


            semver.bumpMinorFrom(baseSemver);
            assert.equal(semver.toString(),'0.1.0',);
        });
    });
    describe('#bumpPatchFrom()', () => {
        it('should put bump the patch version', () => {
            let semver = new SemVer('0.0.1');
            let baseSemver = new SemVer('0.0.1');

            semver.bumpPatchFrom(baseSemver);
            assert.equal(semver.toString(),'0.0.2');
        });
    });
    describe('#isBumped()', () => {
        it('should return false for none bumped version', () => {
            let semver = new SemVer('0.0.1');
            let baseSemver = new SemVer('0.0.1');

            assert.equal(semver.isBumpedFrom(baseSemver), false);
        });
        it('should return true for bumped version', () => {
            let semver = new SemVer('0.0.2');
            let baseSemver = new SemVer('0.0.1');

            assert.equal(semver.isBumpedFrom(baseSemver), true);
        });
        it('should only allow one thing to be bumped', () => {
            let semver = new SemVer('1.0.2');
            let baseSemver = new SemVer('0.0.1');

            assert.equal(semver.isBumpedFrom(baseSemver), false);
        });
    });
});
