import * as React from 'react';

/** Basic button component */
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
    onClick: PropTypes.func
}

export default Button;

