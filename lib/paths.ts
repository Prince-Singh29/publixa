export function assetPath(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (path.startsWith('/')) {
    return `${base}${path}`;
  }
  return base ? `${base}/${path}` : `/${path}`;
}
