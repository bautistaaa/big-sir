const getGreetingByHour = (hour: number) => {
  if (hour > 19) {
    return 'Good Night';
  } else if (hour >= 17) {
    return 'Good Evening';
  } else if (hour >= 12) {
    return 'Good Afternoon';
  } else {
    return 'Good Morning';
  }
};

export default getGreetingByHour;
