import { signIn } from '@/lib/auth';

export default function LoginPage() {
  async function login() {
    'use server';
    await signIn('keycloak');
  }

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Sign in</h1>
      <form action={login}>
        <button type="submit">Continue with Keycloak</button>
      </form>
    </main>
  );
}
