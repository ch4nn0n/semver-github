const versionRegex = new RegExp(/(\d+)\.(\d+)\.(\d+)\D?(\d+)?/);

class Semver {
    constructor(version) {
        let parsedVersion = version.match(versionRegex);
        this._major = parseInt(parsedVersion[1]);
        this._minor = parseInt(parsedVersion[2]);
        this._patch = parseInt(parsedVersion[3]);
    };

    toString() {
        let string = '';
        string += this._major;
        string += '.';
        string += this._minor;
        string += '.';
        string += this._patch;
        return string;
    };

    bumpMajorFrom(baseVersion) {
        this._major = baseVersion._major + 1;
        this._minor = 0;
        this._patch = 0;
    };

    bumpMinorFrom(baseVersion) {
        this._major = baseVersion._major;
        this._minor = baseVersion._minor + 1;
        this._patch = 0;
    };

    bumpPatchFrom(baseVersion) {
        this._major = baseVersion._major;
        this._minor = baseVersion._minor;
        this._patch = baseVersion._patch + 1;
    };

    isBumpedFrom(baseVersion) {
        let dMajor = this._major - baseVersion._major;
        let dMinor = this._minor - baseVersion._minor;
        let dPatch = this._patch - baseVersion._patch;

        if (2 > dMajor && dMajor >= 1 && dMinor === 0 && dPatch === 0) {
            return true;
        } else if (dMajor === 0 && 2 > dMinor && dMinor >= 1 && dPatch === 0) {
            return true;
        } else if (dMajor === 0 && dMinor === 0 && 2 > dPatch && dPatch >= 1) {
            return true;
        } else {
            return false;
        }
    };
}

module.exports = Semver;
