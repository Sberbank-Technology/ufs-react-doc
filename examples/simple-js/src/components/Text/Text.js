import React from 'react';

/**
 * Italic text component
 * @category Components/Text
 */
export function ItalicText(props) {
    return (
        <p style={{fontStyle: 'italic'}}>
            {props.children}
        </p>
    );
}

/**
 * Multiline
 *  description
 *   of
 *    bold
 *      text
 *       component
 * @category Components/Text
 */
export const BoldText = props => (
    <p style={{fontWeight: 'bold'}}>
        {props.children}
    </p>
);

/**
 * Simple text
 * @category Components/Text
 */
export default function(props) {
    return (
        <p>{props.children}</p>
    )
}

/**
 * Underlined text component
 * @category Components/Text
 */
export function UnderlinedText(props) {
    return (
        <p style={{fontStyle: 'underline'}}>
            {props.children}
        </p>
    );
}
