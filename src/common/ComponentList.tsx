import * as React from 'react';
import { connect } from 'react-redux';
import { TreeItem, ComponentType, ErrorType, Component, Tree, SidebarToggler, UFSError } from './index';
import { Row, Col } from 'react-bootstrap';

export interface StateProps {
    components: TreeItem[];
    errors: TreeItem[];
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


    renderComponent(component) {
        if (component === undefined) {
            return null;
        } else if (component.list !== undefined) {
            return <UFSError errors={component} />;
        } else {
            return <Component {...component} />
        }
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
                {this.renderComponent(component)}
            </Col>
        );
    }

    render() {
        const components = this.props.components;
        const errors = this.props.errors;
        const list = (components ).concat(errors);
        const index = parseInt(this.props.match.params.index, 10) || 0;
        let component = list[index];
        return (
            <Row>
                {this.renderSidebar(list, index)}
                {this.renderContent(component)}
            </Row>
        );
    }
}

function mapState({ currentId, components, errors }) {
    return { currentId, components, errors };
}


export default connect(mapState)(ComponentList);
