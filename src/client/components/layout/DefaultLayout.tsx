import * as React from 'react';

interface Props {
    title?: string;
}

export default class DefaultLayout extends React.Component<Props, {}> {
    render() {
        return (
            <html lang="en">
                <head>
                    <title>{this.props.title}</title>
                    <link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css" />
                </head>
                <body>
                    {this.props.children}
                </body>
            </html>
        );
    }
}