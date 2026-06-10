export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function uniqueSlug(baseSlug: string, existingSlugs: Set<string>): string {
  let slug = baseSlug;
  let i = 2;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${i}`;
    i++;
  }
  return slug;
}
