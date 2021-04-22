import { FC, useEffect, useState } from 'react';
import { formatDate } from '../../utils/';

const Clock: FC = () => {
  const [time, setTime] = useState(formatDate(new Date()));

  useEffect(() => {
    const timeout = setTimeout(() => {
      const date = formatDate(new Date());
      setTime(date);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [time]);

  return <>{time}</>;
};
export default Clock;
