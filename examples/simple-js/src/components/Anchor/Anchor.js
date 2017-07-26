import React from 'react';
import PropTypes from 'prop-types';

/**
* Basic __anchor__ component
* @example examples/AnchorExample
*/
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
    href: PropTypes.string,

    /**
     * The target attribute specifies where to open the linked document.
     */
    target: PropTypes.string
};

export default Anchor;

/**
 * Same as original anchor but red
 * @private
 * @example examples/AnchorExample
 * @foobar examples/AnchorExample
 * @standalone
 */
export class RedAnchor extends React.Component {
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

