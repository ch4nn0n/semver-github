const $ = require('jquery');
const Semver = require('./semver.js');

const versionRegex = new RegExp(/[0-9]+.[0-9]+.[0-9]+/);
const rubyVersionFile = 'version.rb';

class GithubApi {

    constructor(repo, pr, token) {
        this._repo = repo;
        this._pr = pr;
        this._token = token;
    };

    getVersions() {
        return new Promise((resolve) => {
            let branchesPromise = this.getBranches();
            let basePromise = branchesPromise.then(() => this.getVersion(true));
            let headPromise = branchesPromise.then(() => this.getVersion(false));

            Promise.all([basePromise, headPromise]).then((versions) => {
                this._baseVersion = new Semver(versions[0]);
                this._headVersion = new Semver(versions[1]);

                resolve();
            })
        });
    }

    getBaseVersion() {
        return this._baseVersion;
    }

    getHeadVersion() {
        return this._headVersion;
    }

    getBranches() {
        let url = 'https://api.github.com/repos/';
        url += `${this._repo}/pulls/${this._pr}`;
        url += `?access_token=${this._token}`;

        return new Promise((resolve, reject) => {
            $.get(url, (data) => {
                this._head = data.head.ref;
                this._base = data.base.ref;
                resolve();
            }).fail((err) => {
                reject(err);
            })
        });
    };

    getVersion(base) {
        return new Promise((resolve) => {
            this.getVersionPath()
                .then((path) => this.getVersionFromFile(path, base))
                .then((version) => resolve(version))
        })
    }

    getVersionPath() {
        let url = 'https://api.github.com/search/code?';
            url += `q=${rubyVersionFile}+in:path+repo:${this._repo}`;
            url += `&access_token=${this._token}`;

        return new Promise((resolve, reject) => {
            $.get(url, (files) => {
                files.items.forEach((file) => {
                    if (file.name === rubyVersionFile) {
                        return resolve(file.path);
                    }
                });
            }).fail((err) => {
                reject(err)
            })
        });
    };

    getVersionFromFile(path, base) {
        let url = 'https://api.github.com/repos/';
            url += `${this._repo}/contents/${path}`;
            url += `?ref=${base ? this._base : this._head}`;
            url += `&access_token=${this._token}`;

        return new Promise((resolve, reject) => {
            $.get(url, (data) => {
                let content = Buffer.from(data.content, 'base64').toString('UTF-8');
                let version = content.match(versionRegex)[0];

                resolve(version);
            }).fail((err) => {
                reject(err)
            });
        });
    };
}

module.exports = GithubApi;
