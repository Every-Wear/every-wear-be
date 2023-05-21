import jwt from 'jsonwebtoken';

export const authCheck = (req, res, next) => {

    const token = req.headers['authorization'] || req.body.token || req.cookies['jwt_token'];

    // token does not exist
    if (!token || token === null || token === "") {
        return res.status(403).json({
            success: false,
            message: 'not logged in, access token check is needed!'
        });
    }

    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('jwt-secret'), (err, user) => {
                if (err) reject(err);
                resolve(user);
            });
        }
    );

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
        res.status(403).json({
            success: false,
            message: `Fail to verify : ${error.message}`
        });
    }

    // process the promise
    p.then((user) => {
        req.user = user;
        next();
    }).catch(onError);
};
