import React from 'react';

/** Basic __anchor__ component */
class Anchor extends React.Component {

    render() {
        const { href, target, children } = this.props;
        return (
            <a
                href={href}
                target={target}
            >
                {children}
            </a>
        );
    }
}

Anchor.defaultProps = {
    target: '_self'
}

Anchor.propTypes = {
    /**
     * Specifies the address of the [destination](http://example.com) anchor with a **URI**
     */
    href: React.PropTypes.string,

    /**
     * The target attribute specifies where to open the linked document.
     */
    target: React.PropTypes.string
};

export default Anchor;

/**
 * Same as original anchor but red
 */
class RedAnchor extends React.Component {
    render() {
        const { href, target, children } = this.props;
        return (
            <a
                style={{color: 'red'}}
                href={href}
                target={target}
            >
                {children}
            </a>
        );
    }
}

RedAnchor.defaultProps = Anchor.defaultProps;
RedAnchor.propTypes = Anchor.propTypes;
