// getting current time data
const date = new Date();
const getTimeData = () => {
    return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        dayTime: date.getHours() > 12 ? "PM" : "AM"
    }
};

export { getTimeData }