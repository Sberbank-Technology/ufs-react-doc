export interface State {
    currentId: number;
    components: any[];
}

export const initialState = {
    currentId: null,
    components: []
};

export default function components(state = initialState, action) {
    return state;
}
