/* @flow */

import React, { Component, PropTypes } from 'react';

export type ValueLink = {
    value : ?any,
    requestChange : ( value : ?any ) => void
};

export default class Field extends Component {

    static propTypes = {
        value                   : PropTypes.any,
        onChange                : PropTypes.func,
        valueLink               : PropTypes.object
    };

    get valueLink() : Object { return this.props.valueLink; }

    get value() : any { return this.props.value; }

    _onChange( value : ?any ) {
        if( this.props.onChange ) {
            this.props.onChange( value, event );
        }
        if( this.props.valueLink && this.props.valueLink.requestChange ) {
            this.props.valueLink.requestChange( value, event );
        }
    }

    onChange = ( event : SyntheticMouseEvent ) => {
        this._onChange( event.target.value );
    };

    /**
     * @abstract
     */
    render() : React.Element {
        throw 'Field should override the render method';
    }
}
