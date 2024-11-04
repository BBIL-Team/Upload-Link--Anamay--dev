import React from 'react';
import { AmplifyProvider, Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const App: React.FC = () => {
  return (
    <AmplifyProvider>
      <Authenticator components={{ SignUp: { hideSignUp: true } }}>
        {({ signOut, user }) => (
          <div>
            <h1>Welcome, {user?.username}</h1>
            <button onClick={signOut}>Sign out</button>
          </div>
        )}
      </Authenticator>
    </AmplifyProvider>
  );
};

export default App;
