export const getImageUrl = (id: string, isThumbnail?: boolean) => {
  if (isThumbnail) {
    return `/portfolio/thumbnail/thumbnail_${id.replace('portfolio_', '')}.jpg`
  }
  return `/portfolio/${id}.jpg`
}
