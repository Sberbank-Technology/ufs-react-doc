import * as React from 'react';
import { markdownToHtml } from '../../common/utils';
import { Panel, Table } from 'react-bootstrap';

export default function UFSError(props: any) {
    const { list } = props;

    function renderTable() {
        return (
            <Table striped bordered condensed hover>
                <thead>
                    <tr>
                        <th>Module</th>
                        <th>Submodule</th>
                        <th>Code</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((error, key) => (
                        <tr key={key}>
                            <td>{error.module}</td>
                            <td>{error.submodule}</td>
                            <td>{error.code}</td>
                            <td>{error.message}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    return (
        <div>
            <h3>Ошибки</h3>
            {renderTable()}
        </div>
    );
}
