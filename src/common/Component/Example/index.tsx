import * as React from 'react';
import { Panel, Button } from 'react-bootstrap';

import HighlightText from '../HighlightText/';

export interface Props {
    component: any;
    source: string;
}

export interface State {
    opened?: boolean;
}

export default class Example extends React.Component<Props, State> {

    state: State = {
        opened: false
    }

    private toggleCode = () =>
        this.setState((state: State) => ({ opened: !state.opened }))

    private renderExpander() {
        const label = this.state.opened ?
            'Hide code' :
            'Show code';

        return (
            <Button
                onClick={this.toggleCode}
                bsStyle="link">
                {label}
            </Button>
        );
    }

    private renderCode() {
        if (!this.state.opened) {
            return null;
        }

        return (
            <HighlightText text={this.props.source} />
        );
    }

    render() {
        const { component, source } = this.props;
        const Example = component.default || component;
        return (
            <Panel>
                <Panel>
                    <Example />
                </Panel>

                {this.renderExpander()}
                {this.renderCode()}
            </Panel>

        )
    }
}
