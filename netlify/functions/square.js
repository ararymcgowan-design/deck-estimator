exports.handler = async function(event) {
  const SQUARE_TOKEN = process.env.Square_Token;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    let { endpoint, method, body } = JSON.parse(event.body);

    const response = await fetch('https://connect.squareup.com/v2/' + endpoint, {
      method: method || 'POST',
      headers: {
        'Authorization': 'Bearer ' + SQUARE_TOKEN,
        'Content-Type': 'application/json',
        'Square-Version': '2024-01-18'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();
    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
