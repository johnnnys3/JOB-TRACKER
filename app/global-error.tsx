'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  console.error(error);

  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'sans-serif', padding: 24 }}>
          <section style={{ maxWidth: 420, textAlign: 'center' }}>
            <h1>Job Tracker could not start</h1>
            <p>Refresh the page or try again.</p>
            <button type="button" onClick={reset}>Try again</button>
          </section>
        </main>
      </body>
    </html>
  );
}
