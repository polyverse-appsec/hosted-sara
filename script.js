import * as endpoints from './constants.js';

async function submitData() {
    const email = document.getElementById('email').value;
    const code = document.getElementById('sourceCode').value;
    const question = document.getElementById('question').value;
    const option = document.getElementById('options').value;
    const submitChat = document.getElementById('submitChat');
    const account = document.getElementById('account');

    const data = {
        'code': code,
        'query': question,
        'session': `testemail: ${email}`,
        'organization': 'polytest.ai',
    };

    submitChat.disabled = true;

    try {
        const response = await fetch(endpoints[option], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error(`Boost Cloud Service Permission issue.: ${response.status}`);
            }
            throw new Error(`Boost Cloud Service Error: ${response.status}`);
        }

        const responseData = await response.json();  // Parse JSON data from the response

        updateAccountStatus(responseData, account);
        
        document.getElementById('response').value = processResponse(option, responseData);

    } catch (error) {

        document.getElementById('response').value = `Sara was unable to answer your request due to ${error.message}${error.stack?'\n'+error.stack:''}`;

    } finally {

        // Re-enable the submit button regardless of outcome
        submitChat.disabled = false;

    }
}

function processResponse(option, responseData) {
    switch (option) {
        case 'chat':
            return responseData.analysis;
        case 'explain':
            return responseData.explanation;
        case 'analyze':
            return responseData.analysis;
        case 'customer_portal':
            return "";
        default:
            return `Sara does not support your request.`;
    }
}

function updateAccountStatus(responseData, account) {
    const account = document.getElementById('account');
    if (!responseData.account) {
        return;
    }

    if (responseData.account.enabled) {
        // change the style of the account element to 'assistant' style
        account.classList.add('assistant');
        account.classList.remove('error');
    } else {
        // change the style of the account element to 'error' style
        account.classList.add('error');
        account.classList.remove('assistant');
    }
}