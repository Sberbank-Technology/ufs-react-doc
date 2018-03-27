export interface TreeItem {
    className: string;
    category: string;
}

export interface ComponentType extends TreeItem {
    srcPath: string;
    description?: string;
    props?: PropsType[];
    interfaces?: InterfacesType[];
    methods?: MethodsType[];
    functions?: FunctionsType[];
    isFunction: boolean;
    isPrivate?: boolean;
}

export interface ErrorType extends TreeItem {
    description?: string;
    list: UFSError[];
}

export interface UFSError {
    module: string;
    submodule: string;
    code: string;
    message: string;
}

export interface FunctionsType {
    name: string;
    displaySignature: string;
    description?: string;
}

export interface MethodsType {
    name: string;
    displaySignature: string;
    description?: string;
    isStatic?: boolean;
}

export interface InterfacesType {
    name: string;
    description?: string;
    declaration: string;
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
