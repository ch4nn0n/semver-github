const GithubApi = require('./modules/githubApi');

const secrets = require('../../secrets.json');

console.log('SemVer running!');

// getRepoFromURL
const urlRegex = new RegExp(/(\w+\/\w+)\/pull\/(\d+)$/);
let documentUrl = document.URL.match(urlRegex);
let repoPath = documentUrl[1];
let pr = documentUrl[2];

// Add button
const $ = require('jquery');
let buttonHtml =
    `<button id="version-button" class="btn" type="button" disabled="true" style="margin-left: 10px">
        No versioning present
    </button>`;
let e = $.parseHTML(buttonHtml);
$('.merge-message').append(e);

//add ruby version to button
let addVersionToButton = function(version) {
    $('#version-button')
        .html(`Master version: ${version}`)
        .removeAttr('disabled')
        .click(() => {
            githubApi.bumpVersion();
            console.log('click');
        });
};

let addVersionAfterButton = function(version) {
    $('#version-button')
        .after(`Current version: ${version}`)
};

let githubApi = new GithubApi(repoPath, pr, secrets.oauthToken);
githubApi.getVersions().then(() => {
    addVersionToButton(githubApi.getHeadVersion());
    addVersionAfterButton(githubApi.getBaseVersion());
});
