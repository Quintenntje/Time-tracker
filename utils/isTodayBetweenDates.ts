const isTodayBetweenDates = (startDate: string, endDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);

    return today >= start && today <= end;
  };


  export default isTodayBetweenDates;