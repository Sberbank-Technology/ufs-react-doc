export interface Component {
    srcPath: string;
    className: string;
    description?: string;
    props?: Props[];
}

export interface Props {
    name: string;
    type: string;
    description?: string;
}