export interface ComponentType {
    srcPath: string;
    className: string;
    description?: string;
    props?: PropsType[];
    interfaces?: InterfacesType[];
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

export interface InterfacesType {
    name: string;
    description?: string;
    props: PropsType[];
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
