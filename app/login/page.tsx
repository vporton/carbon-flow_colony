'use client'

import { signIn, useSession } from 'next-auth/react';

const LoginPage = () => {
  const handleLogin = () => {
    signIn('google'); // Replace 'google' with your chosen provider
  };

  // let session = useSession();

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};

export default LoginPage;
