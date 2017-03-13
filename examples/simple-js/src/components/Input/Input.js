// @flow

import React, { Component } from 'react';


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

export default class Input extends React.Component<void, Props, void> {

    render() {
        const { value, onChange } = this.props;

        return (
            <input
                type='text'
                value={value}
                onChange={onChange}
            />
        );
    }
}

export const Textarea = (props: { value: string, onChange: (value: string) => void}) => {
    return (
        <textarea onChange={props.onChange}>
            {props.value}
        </textarea>
    );
};
