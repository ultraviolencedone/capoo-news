export async function urlToFile(imageUrl, fileName) {
  const response = await fetch(imageUrl)
  const blob = await response.blob()
  return new File([blob], fileName, { type: blob.type })
}
