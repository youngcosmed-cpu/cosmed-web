'use client';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
          <h2 style={{ marginBottom: '12px', fontSize: '24px', fontWeight: 700 }}>
            Something went wrong
          </h2>
          <p style={{ marginBottom: '24px', fontSize: '16px', color: '#666' }}>
            {error.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={reset}
            style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 600, color: '#fff', backgroundColor: '#1a1a2e', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
