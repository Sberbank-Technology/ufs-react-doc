import { ComponentType } from './components/types';

const versions = [
    "1",
    "2",
    "3"
];

const components: ComponentType[] = [
    {
        srcPath: '/home/anton/components/Component1/index',
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
        srcPath: '/home/anton/components/Component3/SubComponent1/SubSubComponent1/index',
        className: 'SubSubComponent1',
        description: 'very cool sub sub component1'
    },
    {
        srcPath: '/home/anton/components/Component3/SubComponent1/index',
        className: 'SubComponent1',
        description: 'very cool sub component1'
    },
    {
        srcPath: '/home/anton/components/Component2/index',
        className: 'Component2',
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
        srcPath: '/home/anton/components/Component1/SubComponent1/index',
        className: 'SubComponent1',
        description: 'very cool sub component1'
    },
    {
        srcPath: '/home/anton/components/Component3/index',
        className: 'Component3',
        description: 'very cool component3',
        props: [
            {
                name: 'Component3Prop1',
                type: null,
                description: 'some prop'
            },
            {
                name: 'Component3Prop2',
                type: null,
                description: 'some prop'
            }
        ]
    },
];

export {
    versions,
    components
}