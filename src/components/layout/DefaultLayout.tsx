import * as React from 'react';

interface Props extends React.Props<{}> {
    title?: string;
}

export default function DefaultLayout(props: Props) {
    return (
        <html lang="en">
            <head>
                <title>{props.title || "UFS React Doc"}</title>
                <link rel="stylesheet" type="text/css" href="/bootstrap/css/bootstrap.min.css" />
            </head>
            <body>
                <div className="container">
                    <h1><img src="/public/UFS_logo.png" /> {props.title || "UFS React Doc"}</h1>
                    {props.children}
                </div>
            </body>
        </html>
    );
}