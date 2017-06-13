import * as express from 'express';

import middleware from './middleware/';
import router from './router/';

export default function() {
    const app = express();

    middleware(app);
    router(app);

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error('Not Found');

        err['status'] = 404;
        next(err);
    });

    // error handler
    app.use((err, req, res, next) => {
        // set locals, only providing error in development
        console.log(err.message);
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
    });

    return app;
}

