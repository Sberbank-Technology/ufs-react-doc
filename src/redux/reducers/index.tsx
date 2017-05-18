import { combineReducers } from 'redux';
import components, { State as ComponentsState } from './components';

export interface State extends ComponentsState {
}

export default components;
