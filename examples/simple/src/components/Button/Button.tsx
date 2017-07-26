declare var require: any;

import * as React from 'react';
import './Button.css';

export enum ButtonType {
    Small, Standard, Big
}

export interface Props extends React.HTMLProps<HTMLButtonElement> {
    /** __onClick__ handler */
    onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;

    /** Button __type__ */
    buttonType?: ButtonType;
}

/**
 * Simple button
 * @example examples/ButtonBig
 * @example examples/ButtonSmall
 * @example examples/ButtonStandard
 */
export default class Button extends React.Component<Props, {}> {
    onClick = (event) => this.props.onClick(event);

    render() {
        let className;
        const { buttonType } = this.props;

        switch(buttonType) {
            case ButtonType.Small:
                className = 'small';
                break;
            case ButtonType.Big:
                className = 'big';
                break;
            case ButtonType.Standard:
            default:
                className = 'standard';
        }

        return <button className={className}>{this.props.children}</button>;
    }
}

/**
 * @private
 */
export class HiddenButton extends React.Component<{}, {}> {
    render() {
        return (
            <button>This one should not be seen in the docs</button>
        );
    }
}
