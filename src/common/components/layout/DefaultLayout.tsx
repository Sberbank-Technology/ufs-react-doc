import * as React from 'react';
import { Link } from 'react-router-dom';


interface Props extends React.Props<{}> {
    title?: string;
}

export default function DefaultLayout(props: Props) {
    return (
        <html lang="en">
            <head>
                <title>UFS React Doc</title>
                <link rel="stylesheet" type="text/css" href="/bootstrap/css/bootstrap.min.css" />
            </head>
            <body>
                <div className="container">
                    <h1>
                        <img src="/public/UFS_logo.png" style={{width: 45, marginTop: -7}} />
                        UFS React Doc
                    </h1>
                    <hr />
                    {props.children}
                </div>
            </body>
        </html>
    );
}
