function success(message) {
    return {
        'success': true,
        'message': message
    };
}

function error(error) {
    return {
        'success': false,
        'error': error
    };
}

function data(data, message) {
    let result = {
        'success': true,
        'data': data
    };
    if (message) result.message = message;

    return result;
}

module.exports = {
    success,
    error,
    data,
};
