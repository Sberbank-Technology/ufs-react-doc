import { ComponentType } from './components/types';

const versions = [
    "1",
    "2",
    "3"
];

const components: ComponentType[] = [
    {
        srcPath: 'components/Component1/index',
        className: 'Component1',
        description: 'very cool component1',
        props: [
            {
                name: 'Component1Prop1',
                type: null,
                description: 'some prop'
            },
            {
                name: 'Component1Prop2',
                type: null,
                description: 'some prop'
            },
            {
                name: 'Component1Prop3',
                type: null,
                description: 'some prop'
            }
        ]
    },
    {
        srcPath: 'components/Component2/index',
        className: 'Component1',
        description: 'very cool component2',
        props: [
            {
                name: 'Component2Prop1',
                type: null,
                description: 'some prop'
            },
            {
                name: 'Component2Prop2',
                type: null,
                description: 'some prop'
            },
            {
                name: 'Component2Prop3',
                type: null,
                description: 'some prop'
            }
        ]
    },
    {
        srcPath: 'components/Component1/SubComponent1/index',
        className: 'SubComponent1',
        description: 'very cool sub sub component1'
    }
];

export {
    versions,
    components
}