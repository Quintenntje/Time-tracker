const generateBracesObjects = (amount: number) => {
    const braces = [];
    let currentDate = new Date();

    for (let i = 0; i < amount; i++) {
        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + 10);

        braces.push({
            amount: i + 1,
            startDate: currentDate.toISOString(),
            endDate: endDate.toISOString(),
            started: false,
            completed: false,
        });

        currentDate = new Date(endDate);
    }

    return braces;
};

export default generateBracesObjects;