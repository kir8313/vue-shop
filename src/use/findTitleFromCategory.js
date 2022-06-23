export default function findTitleFromCategory (category, categories) {
  if (Object.keys(categories).length) {
    return categories.find(cat => cat.type === category).title;
  }
}
