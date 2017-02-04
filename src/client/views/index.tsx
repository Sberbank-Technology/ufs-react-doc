import * as React from 'react';
import { DefaultLayout } from '../components';

interface Props {
    title?: string;
    name?: string;
}

export default class HelloMessage extends React.Component<Props, {}> {
    render() {
        return (
            <DefaultLayout title={this.props.title}>
                <div>Hello, {this.props.name}!</div>
            </DefaultLayout>
        );
    }
}