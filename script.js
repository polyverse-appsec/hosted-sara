import { endpoints } from './constants.js';

async function submitData() {
    const email = document.getElementById('email').value;
    const code = document.getElementById('sourceCode').value;
    const question = document.getElementById('question').value;
    const option = document.getElementById('options').value;
    const submitChat = document.getElementById('submitChat');
    const accountStatus = document.getElementById('account');
        
    const response = document.getElementById('response');

    const data = {
        'code': code,
        'query': question,
        'session': `testemail: ${email}`,
        'organization': 'polytest.ai',
    };

    submitChat.disabled = true;

    try {
        response.value = "";

        // grab cached answer if available
        if (option === 'explain' || option === 'customprocess' || option === 'analyze_function') {
            const cachedDataFetchUri = generateRequestUri(document.getElementById('github-uri').value, option);        

            const boostResponse = await fetch(cachedDataFetchUri, {
                method: 'GET',
            });
            if (boostResponse.ok) {
                const responseData = await boostResponse.json();

                response.value = responseData.body;
                return;
            }        
        }

        const boostResponse = await fetch(endpoints[option], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!boostResponse.ok) {
            if (boostResponse.status === 401) {
                throw new Error(`Boost Cloud Service Permission issue.: ${boostResponse.status}`);
            }
            throw new Error(`Boost Cloud Service Error: ${boostResponse.status}`);
        }

        const responseData = await boostResponse.json();  // Parse JSON data from the response

        updateAccountStatus(
            option == "customer_portal"?{account:responseData}:responseData,
            accountStatus);
        
        response.value = processResponse(option, responseData);

        // cache the answer if available
        if (option === 'explain' || option === 'customprocess' || option === 'analyze_function') {
            const cachedDataFetchUri = generateRequestUri(document.getElementById('github-uri').value, option);        

            const boostResponse = await fetch(cachedDataFetchUri, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: response.value
            });
            if (!boostResponse.ok) {
                console.log(`Unable to cache result in Boost Cloud Store: ${boostResponse.status}`);
            }
        }
    } catch (error) {

        response.value = `Sara was unable to answer your request due to ${error.message}${error.stack?'\n'+error.stack:''}`;

    } finally {

        // Re-enable the submit button regardless of outcome
        submitChat.disabled = false;

    }
}

async function loadFromGitHub() {
    const email = document.getElementById('email').value;
    const githubresource = document.getElementById('github-uri').value;
    const codeBox = document.getElementById('sourceCode');
    const loadFromGitHub = document.getElementById('loadFromGitHub');
    const githubresourceBox = document.getElementById('github-uri');

    loadFromGitHub.disabled = true;

    try {
        const escapedUri = encodeURIComponent(githubresource);

        const get_file_from_uri = `${endpoints["get_file_from_uri"]}api/get_file_from_uri?uri=${escapedUri}&email=${email}`;
        const boostResponse = await fetch(get_file_from_uri, {
            method: 'GET',
        });
        if (!boostResponse.ok) {
            if (boostResponse.status === 401) {
                throw new Error(`Boost Cloud Service Permission issue: ${boostResponse.status}`);
            }
            throw new Error(`Boost Cloud Service Error: ${boostResponse.status}`);
        }

        // change the style of the github to 'assistant' style
        githubresourceBox.classList.add('assistant');
        githubresourceBox.classList.remove('error');

        // Assuming the response text is JSON, parse it
        const responseData = JSON.parse(await boostResponse.text());

        codeBox.value = responseData.body;

    } catch (error) {
        // change the style of the github to 'error' style
        githubresourceBox.classList.add('error');
        githubresourceBox.classList.remove('assistant');
    
        document.getElementById('response').value = `Sara was unable to load source from ${githubresource}\n${error.stack}`;

    } finally {

        // Re-enable the submit button regardless of outcome
        loadFromGitHub.disabled = false;

    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('submitChat').addEventListener('click', submitData);
    document.getElementById('loadFromGitHub').addEventListener('click', loadFromGitHub);
});

function processResponse(option, responseData) {
    switch (option) {
        case 'chat':
            return responseData.analysis;
        case 'explain':
            return responseData.explanation;
        case 'analyze':
            return responseData.analysis;
        case 'customer_portal':
            return `* Status: ${responseData.status}\n` +
                   `* Trial Remaining: ${responseData.trial_remaining}\n` +
                   `* Usage This Month: ${responseData.usage_this_month}\n` +
                   `* Balance Due: ${responseData.balance_due}`;
        default:
            return `Sara does not support your request.`;
    }
}

function updateAccountStatus(responseData, accountStatus) {
    if (!responseData.account) {
        return;
    }

    if (responseData.account.enabled) {
        // change the style of the account element to 'assistant' style
        accountStatus.classList.add('assistant');
        accountStatus.classList.remove('error');
    } else {
        // change the style of the account element to 'error' style
        accountStatus.classList.add('error');
        accountStatus.classList.remove('assistant');
    }
}

function generateRequestUri(githubUrl, analysisType) {
    // Regular expression to extract owner, project, and path from the GitHub URL
    const regex = /github\.com\/([^\/]+)\/([^\/]+)\/blob\/(.+)/;
    const match = githubUrl.match(regex);

    if (!match) {
        throw new Error("Invalid GitHub URL");
    }

    const owner = match[1];
    const project = match[2];
    const path = match[3];

    // Encode the path in Base64
    const pathBase64 = btoa(path);

    // Construct the request URI
    const requestUri = `${endpoints["storage"]}api/files/github/${owner}/${project}/${pathBase64}/${analysisType}`;
    return requestUri;
}