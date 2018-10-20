const $ = require('jquery');

const rubyVersionFile = 'version.rb';

class GithubApi {

    constructor(repo, pr, token) {
        this._repo = repo;
        this._pr = pr;
        this._token = token;
    };

    getBaseVersion() {
        return new Promise((resolve) => {
            this.getBranches()
                .then(() => this.getVersionPath())
                .then((path) => this.getVersionFromFile(path))
                .then((version) => resolve(version))
        })
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

    getVersionFromFile(path) {
        const versionRegex = new RegExp(/[0-9]+.[0-9]+.[0-9]+/);
        let url = 'https://api.github.com/repos/';
            url += `${this._repo}/contents/${path}`;
            url += `?ref=${this._base}`;
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
