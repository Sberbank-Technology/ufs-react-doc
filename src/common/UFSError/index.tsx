import * as React from 'react';
import { markdownToHtml } from '../../common/utils';
import { ErrorType } from '../types';
import { PanelGroup, Panel, Table } from 'react-bootstrap';

export interface Props {
    errors: ErrorType;
}

export interface State {
    structuredObject: any;
}

export default class UFSError extends React.Component<Props, State> {
    state = {
        activeKey: 0,
        structuredObject: {}
    }

    makeObjectFromArray(array) {
        let object = {} as any;
        array.forEach(element => {
            if (object[element.module] === undefined) {
                object[element.module] = {} as any;
            }
            if (object[element.module][element.submodule] === undefined) {
                object[element.module][element.submodule] = {} as any;
            }
            object[element.module][element.submodule][element.code] = element.message;
        });
        return object;
    }

    componentDidMount() {
        this.setState({ structuredObject: this.makeObjectFromArray(this.props.errors.list) });
    }

    renderErrors(errors) {
        return (
            <Table striped bordered condensed hover>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(errors).map((error, key) => (
                        <tr key={key}>
                            <td><code>{error}</code></td>
                            <td>{errors[error]}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    renderSubmodules(submodules) {
        return (
            <div>
                {Object.keys(submodules).map((submodule, key) => (
                    <div key={key}>
                        <h4>
                            {"submodule: "}
                            <code>{submodule}</code>
                        </h4>
                        {this.renderErrors(submodules[submodule])}
                    </div>
                ))}
            </div>
        )
    }

    renderPanelHeader(moduleName) {
        return (
            <h4>
                {"module: "}
                <code>{moduleName}</code>
            </h4>
        )
    }

    renderModules() {
        return (
            <div>
                <h3>Список ошибок</h3>
                <Panel>
                    <div dangerouslySetInnerHTML={{
                        __html: markdownToHtml(this.props.errors.description)
                    }} />
                </Panel>
                <PanelGroup>
                    {Object.keys(this.state.structuredObject).map((moduleKey, key) => (
                        <Panel
                            expanded
                            eventKey={key}
                            header={this.renderPanelHeader(moduleKey)}
                        >
                            {this.renderSubmodules(this.state.structuredObject[moduleKey])}
                        </Panel>
                    ))}
                </PanelGroup>
            </div>
        )
    }

    render() {
        return this.renderModules();
    };
}
