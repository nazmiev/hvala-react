export const getNews = async (): Promise<any> => {
  const tips = await fetch(
    "https://6438e0e91b9a7dd5c959dd29.mockapi.io/tips"
  ).then((res) => res.json());
  return tips;
};