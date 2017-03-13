declare var require: any;

import * as React from 'react';
const styles = require('./Button.css') as any;

export enum ButtonType {
    Small, Standard, Big
}

export interface Props {
    /** onClick handler */
    onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;

    /** Button type */
    type?: ButtonType;
}

/**
 * Simple button
 */
export default class Button extends React.Component<Props, {}> {
    onClick = (event) => this.props.onClick(event);

    render() {
        let className;
        const { type } = this.props;

        switch(type) {
            case ButtonType.Small:
                className = styles.small;
                break;
            case ButtonType.Big:
                className = styles.big;
                break;
            case ButtonType.Standard:
            default:
                className = styles.standard;
        }

        return <button className={className}>{this.props.children}</button>;
    }
}
