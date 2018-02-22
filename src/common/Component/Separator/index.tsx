import * as React from 'react';

export interface Props {
    shouldRender: boolean;
}

export default class Separator extends React.Component<Props, {}> {

    render() {
        if (!this.props.shouldRender) {
            return null;
        }
        return (
            <div>
                <br />
                <hr />
            </div>
        )
    }
}