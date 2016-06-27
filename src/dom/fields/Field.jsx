/* @flow */

import React, { Component, PropTypes } from 'react';

export type ValueLink< T > = {
    value         : ?T,
    requestChange : ( value : ?T ) => void
};

export default class Field extends Component {

    static propTypes = {
        value                   : PropTypes.any,
        onChange                : PropTypes.func,
        valueLink               : PropTypes.object
    };

    get valueLink() : ValueLink< any > { return this.props.valueLink; }

    get value() : any { return this.props.value; }

    onChange( value : ?any ) : void {
        if( this.props.onChange ) {
            this.props.onChange( value, event );
        }
        if( this.props.valueLink && this.props.valueLink.requestChange ) {
            this.props.valueLink.requestChange( value, event );
        }
    }

    /**
     * @abstract
     */
    render() : React.Element {
        throw 'Field should override the render method';
    }
}
