'use client';

import { signIn, useSession } from 'next-auth/react';

const LoginPage = () => {
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </div>
  );
};

export default LoginPage;
