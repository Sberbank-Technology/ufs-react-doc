import React, { Component } from 'react';
import Input, { Textarea } from './Input';

export default class InputExample extends Component {

    state = {
        inputValue: '',
        textareaValue: ''
    }

    onInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    }

    onTextareaChange = (e) => {
        this.setState({ textareaValue: e.target.value });
    }

    render() {
        return (
            <div>
                <p>You can type something into Input:</p>
                <Input
                    value={this.state.inputValue}
                    onChange={this.onInputChange} />

                <p>You can type something into Textarea:</p>
                <Textarea
                    value={this.state.textareaValue}
                    onChange={this.onTextareaChange} />

            </div>
        )
    }

}
