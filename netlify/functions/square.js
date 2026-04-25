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

    function cleanPhone(phone) {
      if (!phone) return undefined;
      const digits = phone.replace(/\D/g, '');
      if (digits.length === 10) return '+1' + digits;
      if (digits.length === 11 && digits[0] === '1') return '+' + digits;
      return undefined;
    }

    if (endpoint === 'customers' && body) {
      if (body.phone_number) {
        body.phone_number = cleanPhone(body.phone_number);
      }
      Object.keys(body).forEach(k => body[k] === undefined && delete body[k]);
      if (body.address) {
        Object.keys(body.address).forEach(k => body.address[k] === undefined && delete body.address[k]);
      }
    }

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
