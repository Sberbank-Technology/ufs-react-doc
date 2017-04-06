export interface ComponentType {
    srcPath: string;
    className: string;
    description?: string;
    props?: PropsType[];
    examples?: string[];
}

export interface PropsType {
    name: string;
    type: string;
    description?: string;
}
