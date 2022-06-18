export default function transform (obj) {
  return Object.keys(obj).map(key => ({...obj[key], id: key}))
}
