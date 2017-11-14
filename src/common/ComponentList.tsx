import * as React from 'react';
import { connect } from 'react-redux';
import { ComponentType, Component, Tree, SidebarToggler } from './index';
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
    sidebarTop: number;
}

class ComponentList extends React.Component<Props, State> {

    state: State = {
        showTree: true,
        sidebarTop: 0
    }

    componentDidMount(): void {
        window.addEventListener('scroll', this.onscroll);
        this.onscroll();
    }

    componentWillUnmount(): void {
        window.removeEventListener('scroll', this.onscroll);
    }

    private onscroll = () => {
        const header = document.querySelector('header');
        const dy = header.offsetHeight + parseInt(getComputedStyle(header).marginBottom, 10);
        let sidebarTop = Math.max(dy - window.scrollY, 0);
        this.setState({ sidebarTop });
    }

    toggleSidebar = () =>
        this.setState((state: State) => ({ showTree: !state.showTree }));

    private sidebarList: HTMLDivElement;
    private saveSidebarListRef = (el: HTMLDivElement) => {
        this.sidebarList = el;
        this.forceUpdate();
    }

    private getSidebarListStyle(): React.CSSProperties {
        if (!this.sidebarList) {
            return {};
        }

        return {
            position: 'fixed',
            top: this.state.sidebarTop,
            bottom: 0,
            width: this.sidebarList.parentElement.clientWidth,
            overflow: 'scroll'
        };
    }

    renderSidebar(list, index) {
        if (!this.state.showTree) {
            return null;
        }

        return (
            <Col xs={4}>
                <SidebarToggler open onToggle={this.toggleSidebar} />
                <div
                    ref={this.saveSidebarListRef}
                    style={this.getSidebarListStyle()}
                >
                    <Tree {...{ list, index }} />
                </div>
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
                    <SidebarToggler onToggle={this.toggleSidebar} />
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
