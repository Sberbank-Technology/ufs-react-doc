import React, { Component } from 'react';
import Anchor, { RedAnchor } from '../Anchor';

export default class AnchorExample extends Component {

    render() {
        return (
            <p>
                <Anchor
                    href={'http://google.com#q=anchor'}
                    target={'_blank'}>
                    {'default anchor'}
                </Anchor>
                {', '}
                <RedAnchor
                    href={'http://google.com#q=red+anchor'}
                    target={'_blank'}>
                    {'red anchor'}
                </RedAnchor>
            </p>
        );
    }
}
