export interface ComponentType {
    srcPath: string;
    className: string;
    description?: string;
    props?: PropsType[];
    functions?: FunctionsType[];
    isPrivate?: boolean;
    category?: string;
}

export interface FunctionsType {
    name: string;
    displaySignature: string;
    description?: string;
    isStatic?: boolean;
}

export interface PropsType {
    name: string;
    type: string;
    description?: string;
    inheritedFrom?: boolean;
    required?: boolean;
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
