# Frontend Integration Examples

Use these snippet to connect your static HTML/JS frontend to the new backend API.

## 1. Register a User
```javascript
async function registerUser(name, email, country) {
  const API_URL = 'https://your-api-url.onrender.com';
  
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        country,
        join_date: new Date().toISOString()
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registration failed');
    
    console.log('User registered:', data.user);
    return data.user;
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## 2. Track an Event
```javascript
async function trackEvent(userId, actionType, metaData = {}) {
  const API_URL = 'https://your-api-url.onrender.com';
  
  try {
    const response = await fetch(`${API_URL}/events/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        action_type: actionType,
        meta_data: metaData,
        timestamp: new Date().toISOString()
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Tracking failed');
    
    console.log('Event tracked:', data.event);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## 3. Usage Example
```javascript
// Example: Tracking a "buy_crypto" event
trackEvent('user-uuid-here', 'buy_crypto', {
  coin: 'BTC',
  amount: 0.05,
  price: 45000
});
```
