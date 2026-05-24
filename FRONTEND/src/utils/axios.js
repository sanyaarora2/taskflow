/*
================ FULL STACK FLOW ================

Frontend (React)
│
├── 1. User interacts with UI
│      (button click, typing, form submit)
│
├── 2. Data gets stored in state
│      const [email, setEmail] = useState('')
│
├── 3. Axios sends request to backend
│      axiosInstance.post('/auth/login', { email, password })
│
├── 4. axiosInstance automatically adds base URL
│      baseURL: 'http://localhost:5000/api'
│
└── 5. Interceptor automatically attaches token
       Authorization: Bearer <token>
                    │
                    ▼

Backend (Express)
│
├── 6. Backend receives request
│      POST /api/auth/login
│
├── 7. Middleware verifies JWT token
│      jwt.verify(token, JWT_SECRET)
│
├── 8. Route handler performs actual logic
│      Login / Create task / Delete task etc.
│
└── 9. MongoDB stores or fetches data
       Task.find({ userId: req.user.id })
                    │
                    ▼

Response goes back to React
│
├── 10. Data comes inside res.data
│       res.data.tasks / res.data.token
│
└── 11. React state updates
        setTasks(res.data.tasks)

        React detects state change
        → UI automatically re-renders ✅
*/

import axios from 'axios'

// Common axios instance for all API requests
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
})

/*
Interceptor flow:
1. Check token from localStorage
2. Add token inside request headers
3. Send modified request to backend

Without interceptor:
- Token manually send karna padta har request me

With interceptor:
- Automatically token attach ho jata hai
*/
axiosInstance.interceptors.request.use((config) => {

  // Get token stored after login
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default axiosInstance

/*
Why axiosInstance?

Instead of writing full URL everywhere:
http://localhost:5000/api/tasks

We create a common axios instance:
axiosInstance.get('/tasks')

This makes code cleaner and reusable.
*/

/*
Token Journey:

1. Backend creates token
   → jwt.sign()

2. Frontend stores token
   → localStorage.setItem()

3. Interceptor sends token
   → request headers

4. Middleware verifies token
   → jwt.verify()

5. If valid → route handler executes
*/

/*
INTERCEPTOR (Frontend)
- Runs before request is sent
- Automatically adds token to headers

MIDDLEWARE (Backend)
- Runs after request reaches backend
- Verifies whether token is valid
- If valid → allow access
- Else → reject request
*/