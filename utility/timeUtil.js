function returnTimeInMilliseconds(hours, minutes, seconds) {
    return (seconds + (minutes * 60) + (hours * 60 * 60)) * 1000;
}

module.exports = {
    returnTimeInMilliseconds
};
