import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="dev-mpq54151hv76tg8q.us.auth0.com"
    clientId="B2gWoRRYMFG77Xpx53Fc1YemUn4J8gDF"
    authorizationParams={{
      redirect_uri: window.location.origin + "/to-do-app/"
    }}
  >
  <StrictMode>
    <App />
  </StrictMode>
  </Auth0Provider>,
)
