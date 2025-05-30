export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-NP', { timeZone: 'Asia/Kathmandu' });
};