export function collectJsonPaths(obj: Record<string, unknown>, path = ''): Set<string> {
  const paths = new Set<string>();
  
  if (obj && typeof obj === 'object') {
    paths.add(path);
    Object.keys(obj).forEach(key => {
      const newPath = path ? `${path}.${key}` : key;
      const childPaths = collectJsonPaths(obj[key] as Record<string, unknown>, newPath);
      childPaths.forEach(p => paths.add(p));
    });
  }
  
  return paths;
}