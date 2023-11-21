function generateSuccessResponse(message) {
    return {
        'success': true,
        'message': message
    };
}

function generateErrorResponse(error) {
    return {
        'success': false,
        'error': error
    };
}

function generateDataResponse(data, message) {
    return {
        'success': true,
        'data': data,
        'message': message
    };
}

module.exports = {
    generateSuccessResponse,
    generateErrorResponse,
    generateDataResponse,
};
