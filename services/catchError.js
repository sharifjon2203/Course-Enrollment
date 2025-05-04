import logger from "./logger/logger.js";


export const catchError = (res, code, err) => {
    console.error(`Error: ${err}`);
    logger.error(`CatchError: ${err}`)

    return res.status(code).json({
        statusCode: code,
        message: err,
    });
};
