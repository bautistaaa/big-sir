const truncateStringByLimit = (value: string, limit: number): string => {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit)}...`;
};

export default truncateStringByLimit;
