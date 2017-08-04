import * as React from 'react';
import PropTypes from 'prop-types';

/**
 * Basic button component
 * @category Components/Buttons
 */
class Button extends React.Component {

    onClick = e => this.props.onClick(e);

    render() {
        const { onClick, children } = this.props;
        return (
            <button
                type="button"
                onClick={this.onClick}
            >
                {children}
            </button>
        );
    }
}

Button.defaultProps = {
    onClick: () => {}
}

Button.propTypes = {
    /**
     * onClick handler.
     * Accepts event object as first argument.
     */
    onClick: PropTypes.func,

    /**
     * @private
     * Never pass this prop!
     */
    neverPassThisProp: PropTypes.string
}

export default Button;

