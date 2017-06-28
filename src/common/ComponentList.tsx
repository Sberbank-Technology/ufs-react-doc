import * as React from 'react';
import { connect } from 'react-redux';
import { ComponentType, Component, Tree } from './index';
import { Row, Col } from 'react-bootstrap';

export interface StateProps {
    components: ComponentType[];
    currentId: string;
}

interface OwnProps {
    title?: string;
    component: ComponentType;
    list: ComponentType[];
    index: number;
    match: any;
}

export interface Props extends StateProps, OwnProps {
}

export interface State {
    showTree: boolean;
}

class ComponentList extends React.Component<Props, State> {

    state: State = {
        showTree: true
    }

    toggleSidebar = () =>
        this.setState((state: State) => ({ showTree: !state.showTree }));

    renderToggleButton() {
        return (
            <button
                onClick={this.toggleSidebar}
                className="toggle_sidebar"
            >
                {this.state.showTree ? '<<' : '>>'}
            </button>
        );
    }

    renderSidebar(list, index) {
        if (!this.state.showTree) {
            return null;
        }

        return (
            <Col xs={4}>
                {this.renderToggleButton()}
                <Tree {...{ list, index }} />
            </Col>
        );
    }

    renderContent(component) {
        const { showTree } = this.state;
        const xs = showTree ? 8 : 12;

        return (
            <Col xs={xs}>

                {showTree ?
                    null :
                    this.renderToggleButton()
                }

                <Component {...component} />
            </Col>
        );
    }

    render() {
        const list = this.props.components;
        const index = parseInt(this.props.match.params.index, 10) || 0;
        const component = list[index];

        return (
            <Row>
                {this.renderSidebar(list, index)}
                {this.renderContent(component)}
            </Row>
        );
    }
}

function mapState({ currentId, components }) {
    return { currentId, components };
}


export default connect(mapState)(ComponentList);
