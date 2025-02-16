export const getImageUrl = (id: string, isThumbnail?: boolean) => {
  return `/api/image/${id}${isThumbnail ? "?thumbnail=true" : ""}`;
};
