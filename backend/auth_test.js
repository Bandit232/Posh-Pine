const base = 'http://localhost:5000';
(async () => {
  try {
    const loginRes = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'AdminPassword1!' }),
    });
    console.log('login status', loginRes.status);
    const loginBody = await loginRes.text();
    console.log('login body', loginBody);
    const cookie = loginRes.headers.get('set-cookie');
    console.log('cookie', cookie);
    const usersRes = await fetch(base + '/api/users', {
      method: 'GET',
      headers: { cookie },
    });
    console.log('users status', usersRes.status);
    console.log('users body', await usersRes.text());
  } catch (err) {
    console.error('error', err);
    process.exit(1);
  }
})();
