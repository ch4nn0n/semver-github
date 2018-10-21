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
                .then(() => this.getVersionFromFile(base))
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
                        this._path = file.path;
                        return resolve();
                    }
                });
            }).fail((err) => {
                reject(err)
            })
        });
    };

    getVersionFromFile(base) {
        let url = 'https://api.github.com/repos/';
            url += `${this._repo}/contents/${this._path}`;
            url += `?ref=${base ? this._base : this._head}`;
            url += `&access_token=${this._token}`;

        return new Promise((resolve, reject) => {
            $.get(url, (data) => {
                let content = Buffer.from(data.content, 'base64').toString('UTF-8');
                let version = content.match(versionRegex)[0];

                base ? this._baseSha = data.sha : this._headSha = data.sha;

                resolve(version);
            }).fail((err) => {
                reject(err)
            });
        });
    };

    bumpVersion() {
        let version = this.getBaseVersion();
            version.bumpMajor();
            version = version.toString();
        let template =
`# frozen_string_literal: true

module GamingEngine
    VERSION = '${version}'
end

`;
        let content = Buffer.from(template).toString('base64');

        let url = 'https://api.github.com/repos/';
            url += `${this._repo}/contents/${this._path}`;
            url += `?access_token=${this._token}`;

        let body = {
            message: `Bump version to: ${version}`,
            content: content,
            sha: this._headSha,
            branch: this._head
        };

        return new Promise((resolve) => {
            $.ajax({
                url: url,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(body),
                success: function(result) {
                    console.log(result);
                    resolve();
                }
            })
        })
    };
}

module.exports = GithubApi;
