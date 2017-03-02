import * as React from 'react';

export interface Props extends HTMLAnchorElement {
    /* Link for an anchor */
    href: string;
}

/** Simple component for anchors */
export const Anchor = (props) => <a {...this.props}>{this.props.children}</a>;

export default Anchor;