'use client';
import { usePrivy } from '@privy-io/react-auth';

export default function Login() {
  const { login, logout, ready, authenticated, user } = usePrivy();

  if (!ready) return <p>Loading...</p>;

  if (!authenticated) {
    return <button onClick={login}>Login with Privy</button>;
  }

  return (
    <div>
      <p>Welcome, {user?.wallet?.address}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
