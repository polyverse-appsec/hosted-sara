import { endpoints } from './constants.js';

async function submitData() {
    const email = document.getElementById('email').value;
    const code = document.getElementById('sourceCode').value;
    const question = document.getElementById('question').value;
    const option = document.getElementById('options').value;
    const submitChat = document.getElementById('submitChat');
    const accountStatus = document.getElementById('account');

    const data = {
        'code': code,
        'query': question,
        'session': `testemail: ${email}`,
        'organization': 'polytest.ai',
    };

    submitChat.disabled = true;

    try {
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
        
        document.getElementById('response').value = processResponse(option, responseData);

    } catch (error) {

        document.getElementById('response').value = `Sara was unable to answer your request due to ${error.message}${error.stack?'\n'+error.stack:''}`;

    } finally {

        // Re-enable the submit button regardless of outcome
        submitChat.disabled = false;

    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('submitChat').addEventListener('click', submitData);
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