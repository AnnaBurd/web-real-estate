let currentOrigin: string | null = null;

export const useOrigin = () => {
  if (!currentOrigin) currentOrigin = window.location.origin;

  return currentOrigin;
};
