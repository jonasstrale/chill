import Link from 'next/link';

export default function LoginPage() {
  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Sign in</h1>
      <p>Use the self-hosted Keycloak realm to start the OIDC login flow.</p>
      <p>
        <Link href="/api/auth/login">Continue with Keycloak</Link>
      </p>
    </main>
  );
}
