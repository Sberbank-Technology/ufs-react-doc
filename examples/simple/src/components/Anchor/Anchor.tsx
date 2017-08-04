import * as React from 'react';

export interface Props {
    /** __Link__ for an anchor */
    href: string;
}

/**
 * Simple component for *anchors
 * @category Components/Text
 */
export default class Anchor extends React.Component<Props, {}> {
    render() {
        return <a href={this.props.href}>{this.props.children}</a>;
    }
}
