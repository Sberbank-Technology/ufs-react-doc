import * as React from 'react';
import { markdownToHtml } from '../../common/utils';
import { PanelGroup, Panel, Table } from 'react-bootstrap';

export default function UFSError(props: any) {
    const { list } = props;

    function makeObjectFromArray(array) {
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

    function renderErrors(errors) {
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
                            <td>{error}</td>
                            <td>{errors[error]}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    function renderSubmodules(submodules) {
        return (
            <div>
                {Object.keys(submodules).map((submodule, key) => (
                    <div>
                        <h5>{submodule}</h5>
                        {renderErrors(submodules[submodule])}
                    </div>
                ))}
            </div>
        )
    }

    function renderModules() {
        let structuredObject = makeObjectFromArray(list);
        return (
            <PanelGroup accordion>
                {Object.keys(structuredObject).map((moduleKey, key) => (
                    <Panel header={moduleKey} defaultExpanded >
                        {renderSubmodules(structuredObject[moduleKey])}
                    </Panel>
                ))}
            </PanelGroup>
        )
    }

    return (
        <div>
            <h3>Ошибки</h3>
            {renderModules()}
        </div>
    );
}
