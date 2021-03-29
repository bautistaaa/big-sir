import { FC, useEffect, useState } from 'react';

const formatDate = (): string => {
  const weekday = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).format(new Date());

  const date = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const time = new Intl.DateTimeFormat('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date());
  return `${weekday} ${date}  ${time}`;
};

const Clock: FC = () => {
  const [time, setTime] = useState(formatDate());

  useEffect(() => {
    const interval = setInterval(() => {
      const date = formatDate();
      setTime(date);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <>{time}</>;
};
export default Clock;
