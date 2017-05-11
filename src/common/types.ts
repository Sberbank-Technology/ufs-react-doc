export interface ComponentType {
    srcPath: string;
    className: string;
    description?: string;
    props?: PropsType[];
}

export interface PropsType {
    name: string;
    type: string;
    description?: string;
}

export interface SearchItemProps {
    className: string;
    description: string;
    id: string;
}

export interface SearchListProps {
    list: SearchItemProps[];
    showMatchList: boolean
}