import * as React from 'react';
import {
    Grid,
    Row,
    Col
} from 'react-bootstrap';

interface Props {
    versions: string[];
}

export default function Versions(props :Props) {
    const { versions } = props;

    return (
        <div>
            {versions.map((version, key) => (
                <p key={key}>
                    <a href={`/version/${version}`}>Version {version}</a>
                </p>
            ))}
        </div>
    );
}
