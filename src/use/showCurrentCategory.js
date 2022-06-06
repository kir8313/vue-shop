const showCurrentCategory = (category, categories) => {
  if (Object.keys(categories).length) {
    return categories.find(cat => cat.type === category).title
  }
}
export default showCurrentCategory;
