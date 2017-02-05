import * as React from 'react';

interface Props extends React.Props<{}> {
    title?: string;
}

export default function DefaultLayout(props: Props) {
    return (
        <html lang="en">
            <head>
                <title>{props.title}</title>
                <link rel="stylesheet" type="text/css" href="/bootstrap/css/bootstrap.min.css" />
            </head>
            <body>
                {props.children}
            </body>
        </html>
    );
}