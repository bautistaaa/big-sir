const formatDateForSpotify = (dateToFormat: Date): string => {
  const date = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(dateToFormat);

  return `${date}`;
};

export default formatDateForSpotify;

