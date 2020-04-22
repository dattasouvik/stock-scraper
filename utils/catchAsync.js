module.exports = fn => {
    return (args) => {
        return fn(args).catch(args => console.log("Error Tracked by CatchAsync Handler at:",args));
    };
};