export async function onRequest(context) {
    const url = new URL(context.request.url);
    const type = url.searchParams.get('type');

    // Hardcoded Google Sheets URLs (Secure on server side)
    const SHEET_URLS = {
        'REG_JAGO_BOSS': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTvG55usnrQz-74001i4OnpeKK8keuJYLbt1ROt2ruBnokIoR2dO-3SWHs_0qBRljRzzk7ijHmgGtnH/pub?gid=1536468156&single=true&output=csv',
        'BIGPACK': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQOTgbMEy3bP2zxj9oM5-ArKE2sD_7P2eUF1LxdeCTRRNMeV0qldgk78KSlLTS9ZWx17ZvcQ05AKFyx/pub?gid=1219555554&single=true&output=csv',
        'INTERPACK': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQTRWr2c7hUBDsm-F7E1VMD_i9k-2xQi12F6QG7ryoA5vp9nile2WpdUkmTxAEUZsGniVO6nNB-8nWq/pub?gid=1234099481&single=true&output=csv'
    };

    if (!type || !SHEET_URLS[type]) {
        return new Response('Invalid rate type requested', { status: 400 });
    }

    try {
        const targetUrl = SHEET_URLS[type];
        const response = await fetch(targetUrl);
        const data = await response.text();

        return new Response(data, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Access-Control-Allow-Origin': '*', // Allow CORS for everyone (or restrict to your domain)
                'Cache-Control': 'max-age=3600' // Cache for 1 hour to be super fast
            }
        });
    } catch (err) {
        return new Response('Error fetching data: ' + err.message, { status: 500 });
    }
}
