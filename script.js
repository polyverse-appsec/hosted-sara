async function submitData() {
    const email = document.getElementById('email').value;
    const code = document.getElementById('sourceCode').value;
    const question = document.getElementById('question').value;
    const option = document.getElementById('options').value;
    const submitChat = document.getElementById('submitChat');

    const awsServer = ".lambda-url.us-west-2.on.aws/";
    const endpoints = {
        'user_organizations': "https://cro3oyez4g56b33hvglfwytg3q0alxrz" + awsServer,
        'customer_portal': "https://hry4lqp3ktulatehaowyzhkbja0mkjob" + awsServer,
        'customprocess': "https://fudpixnolc7qohinghnum2nlm40wmozy" + awsServer,
        'analyze_function': "https://fubldwjkv4nau5qcnbrqilv6ba0dmkcc" + awsServer,
        'explain': "https://jorsb57zbzwcxcjzl2xwvah45i0mjuxs" + awsServer,
        'chat': "https://o6pn7utohv362ubwb6h4ie3jgm0zleqb" + awsServer,
    };

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
        document.getElementById('response').value = JSON.stringify(responseData, null, 2);

    } catch (error) {

        document.getElementById('response').value = `Sara was unable to answer your request due to ${error.message}${error.stack?'\n'+error.stack:''}`;

    } finally {

        // Re-enable the submit button regardless of outcome
        submitChat.disabled = false;

    }
}
