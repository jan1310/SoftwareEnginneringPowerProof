async function httpRequest(url, verb, body, headers, raw) {
    const response = await fetch(
        `http://${location.hostname}:${location.port}/api/` + url,
        {
            method: verb,
            body,
            headers: Object.assign(
                {
                    'Content-Type': 'application/json',
                },
                headers || {},
            ),
        },
    );

    if (raw) {
        return response;
    }

    return response.json();
}

async function GET(url, raw = false) {
    return httpRequest(url, 'get', null, null, raw);
}

async function POST(url, body, raw = false) {
    return httpRequest(url, 'post', JSON.stringify(body || {}), null, raw);
}

async function PUT(url, body, raw = false) {
    return httpRequest(url, 'put', JSON.stringify(body || {}), null, raw);
}

async function DELETE(url, raw = false) {
    return httpRequest(url, 'delete', null, null, raw);
}
