const secrets = require('../../secrets.json');

console.log('SemVer running!');

// Add button
const $ = require('jquery');
let e = $.parseHTML('<button id="version-button" class="btn" type="button" disabled="true" style="margin-left: 10px">No versioning present</button>');
$('.merge-message').append(e);

// getRepoFromURL
const pathRegex = new RegExp(/(\S*\/\S*)$/);
let repoPath = document.title.match(pathRegex)[0];

// login
const oauthToken = secrets.oauthToken;
const tokenParam = '?access_token=';

// get all files in repo called version
const searchUrl = 'https://api.github.com/search/code';
const searchQuery = '&q=version+in:path+repo:' + repoPath;
let url = searchUrl + tokenParam + oauthToken + searchQuery;
$.get(url, function(data) {
    versionMatch(data);
})
.fail(function(err) {
    console.log(err)
});

// find if one of the files matches the ruby version file
let versionMatch = function(data) {
    data.items.forEach(function(file) {
        if (file.name === 'version.rb') {
            getContentDetails(file.url);
        }
    });
};

// get the ruby version file
let getContentDetails = function(url) {
    const versionRegex = new RegExp(/[0-9]+.[0-9]+.[0-9]+/);
    url = url + '&access_token=' + oauthToken;

    $.get(url, function(data) {
        let content = Buffer.from(data.content, 'base64').toString('UTF-8');
        let version = content.match(versionRegex)[0];
        addVersionToButton(version);
    }).fail(function() {
        console.log('fail')
    });
};

//add ruby version to button
let addVersionToButton = function(version) {
    $('#version-button').html('Version: ' + version).removeAttr('disabled');
};
