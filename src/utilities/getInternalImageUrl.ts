export const getInternalImageUrl = (imagePath: string) => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  return `${apiBaseUrl}/static/uploads/${imagePath}`;
};
