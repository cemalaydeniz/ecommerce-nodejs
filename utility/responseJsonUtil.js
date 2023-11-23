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

function data(isSuccessful, data, message) {
    let result = {
        'success': isSuccessful,
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
