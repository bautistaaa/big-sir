import { FC, useEffect, useState } from 'react';
import { formatDate } from '../../utils/';

const Clock: FC = () => {
  const [time, setTime] = useState(formatDate(new Date()));

  useEffect(() => {
    const timeout = setInterval(() => {
      const date = formatDate(new Date());
      setTime(date);
    }, 1000);

    return () => {
      clearInterval(timeout);
    };
  }, [time]);

  return <>{time}</>;
};
export default Clock;
