async function submitData() {
    const email = document.getElementById('email').value;
    const code = document.getElementById('sourceCode').value;
    const question = document.getElementById('question').value;
    const option = document.getElementById('options').value;

    const awsServer = ".lambda-url.us-west-2.on.aws/";
    const endpoints = {
        'user_organizations': "https://cro3oyez4g56b33hvglfwytg3q0alxrz" + awsServer,
        'customer_portal': "https://hry4lqp3ktulatehaowyzhkbja0mkjob" + awsServer,
        'customprocess': "https://fudpixnolc7qohinghnum2nlm40wmozy" + awsServer,
        'analyze_function': "https://fubldwjkv4nau5qcnbrqilv6ba0dmkcc" + awsServer,
        'explain': "https://jorsb57zbzwcxcjzl2xwvah45i0mjuxs" + awsServer,
    };

    const data = {
        'code': code,
        'question': question,
        'session': `testemail: ${email}`,
        'organization': 'polytest.ai',
    };

    try {
        const response = await fetch(endpoints[option], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            },
            body: JSON.stringify(data)
        });

        document.getElementById('response').value = JSON.stringify(response, null, 2);
    } catch (error) {
        document.getElementById('response').value = `${error.message}\n${error.stack}`;
    }
}
