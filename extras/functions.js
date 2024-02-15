const postedTime = function formatTimeElapsed(createdAt) {
    const now = Date.now();
    const diff = now - createdAt;

    // Convert milliseconds to seconds
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
        // Show seconds if less than a minute
        return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
    } else {
        // Convert seconds to minutes
        const minutes = Math.floor(seconds / 60);

        if (minutes < 60) {
            // Show minutes if less than an hour
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        } else {
            // Show hours if more than an hour
            const hours = Math.floor(minutes / 60);
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        }
    }
};

module.exports = postedTime;