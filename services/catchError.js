export const catchError = (res, code, err) => {
    console.error(`Error: ${err}`);
    // logger.error(`Danggg: ${err}`)

    return res.status(code).json({
        statusCode: code,
        message: err,
    });
};
