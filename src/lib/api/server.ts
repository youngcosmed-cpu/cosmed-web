const API_SERVER_URL =
  process.env.API_SERVER_URL || 'http://localhost:3000';

interface ServerFetchOptions {
  revalidate?: number;
}

export async function serverFetch<T>(
  path: string,
  options?: ServerFetchOptions,
): Promise<T> {
  const res = await fetch(`${API_SERVER_URL}${path}`, {
    next: { revalidate: options?.revalidate ?? 60 },
  });

  if (!res.ok) {
    throw new Error(`Server fetch failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
