import * as React from 'react';

export interface Props {
    open?: boolean;
    onToggle: () => void;
}

export default class SidebarToggler extends React.Component<Props, {}> {
    render() {
        const { open, onToggle } = this.props;

        return (
            <button
                onClick={onToggle}
                className="toggle_sidebar"
            >
                {open ? '<<' : '>>'}
            </button>
        )
    }
}
