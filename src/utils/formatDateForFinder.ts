const formatDate = (dateToFormat: Date): string => {
  const weekday = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  }).format(dateToFormat);

  const date = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(dateToFormat);

  const time = new Intl.DateTimeFormat('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
  }).format(dateToFormat);

  return `${weekday}, ${date} at ${time}`;
};

export default formatDate;
