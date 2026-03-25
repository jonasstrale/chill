import Link from 'next/link';
import { cookies } from 'next/headers';

import { readSessionCookieValue, SESSION_COOKIE_NAME } from '@/lib/auth';

export default async function HomePage() {
  const cookieStore = await cookies();
  const session = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Economy Platform</h1>
      <p>Responsive multi-ledger finance app starter.</p>
      {session ? (
        <>
          <p>Signed in as {session.name ?? session.email ?? session.sub}.</p>
          <p>
            <Link href="/api/auth/logout">Sign out</Link>
          </p>
        </>
      ) : (
        <p>
          <Link href="/login">Sign in</Link>
        </p>
      )}
    </main>
  );
}
