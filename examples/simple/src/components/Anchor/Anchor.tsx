import * as React from 'react';

export interface Props {
    /** Link for an anchor */
    href: string;
}

/** Simple component for anchors */
export default class Anchor extends React.Component<Props, {}> {
    render() {
        return <a href={this.props.href}>{this.props.children}</a>;
    }
}
