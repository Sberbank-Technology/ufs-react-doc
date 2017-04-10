// @flow

import React, { Component } from 'react';
import * as styles from './Input.css';


declare type Props = {
    /**
     * Input value
     */
    value: string;

    /**
     * Called every time user
     * changes input value
     */
    onChange: (value: string) => void;
}

/**
 * @example InputExample
 */
export default class Input extends React.Component<void, Props, void> {

    render() {
        const { value, onChange } = this.props;

        return (
            <input
                className={styles.input}
                type='text'
                value={value}
                onChange={onChange} />
        );
    }
}

export const Textarea = (props: { value: string, onChange: (value: string) => void}) => {
    return (
        <textarea
            className={styles.textarea}
            value={props.value}
            onChange={props.onChange} />
    );
};
