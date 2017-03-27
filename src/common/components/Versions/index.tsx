import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { RemoteDoc } from '../../../server/config';

interface Props {
    versions: RemoteDoc[];
}


export default function Versions({ versions }: Props) {
    return (
        <div>
            {versions.map((version, key) => (
                <p key={key}>
                    <a href={`/version/${version.packageName}/${version.version}`}>
                        {version.packageName} {version.version}
                    </a>
                </p>
            ))}
        </div>
    );
}
