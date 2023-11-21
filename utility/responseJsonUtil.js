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
    return {
        'success': true,
        'data': data,
        'message': message
    };
}

module.exports = {
    success,
    error,
    data,
};
