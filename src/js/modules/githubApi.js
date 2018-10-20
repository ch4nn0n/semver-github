const $ = require('jquery');

class GithubApi {

    constructor(repo, pr, token) {
        this._repo = repo;
        this._pr = pr;
        this._token = token;
    };

    searchFiles(fileName, callback) {
        let url = 'https://api.github.com/search/code?';
            url += `q=${fileName}+in:path+repo:${this._repo}`;
            url += `&access_token=${this._token}`;

        $.get(url, (data) => {
            this._parseSearchForVersionFile(data, callback);
        }).fail((err) => {
            console.log(err)
        })
    }

    _parseSearchForVersionFile(data, callback) {
        let _this = this;
        data.items.forEach(function(file) {
            if (file.name === 'version.rb') {
                _this._getVersionFileContents(file.url, callback);
            }
        });
    }

    _getVersionFileContents(url, callback) {
        const versionRegex = new RegExp(/[0-9]+.[0-9]+.[0-9]+/);
        url = url + '&access_token=' + this._token;

        $.get(url, function(data) {
            let content = Buffer.from(data.content, 'base64').toString('UTF-8');
            let version = content.match(versionRegex)[0];
            callback(version);
        }).fail(function() {
            console.log('fail')
        });
    }

    getBranches() {
        let url = 'https://api.github.com/repos/';
            url += `${this._repo}/pulls/${this._pr}`;
            url += `?access_token=${this._token}`;

        $.get(url, (data) => {
            console.log(data.head.ref);
            console.log(data.base.ref);
        }).fail((err) => {
            console.log(err)
        })
    }

    getFilesInPr() {
        let url = 'https://api.github.com/repos/';
        url += `${this._repo}/pulls/${this._pr}/files`;
        url += `?access_token=${this._token}`;

        $.get(url, (data) => {
            console.log(data)
        }).fail((err) => {
            console.log(err)
        })
    }
}

module.exports = GithubApi;
