/* @flow */

import React, { PropTypes }    from 'react';

import Field    from './Field';

export default class Input extends Field {

    onChange = ( event : SyntheticMouseEvent ) => {
        if( this.props.type === 'checkbox' ) {
            this._onChange( !this.value );
        } else {
            this._onChange( event.target.value );
        }
    };

    render() : React.Element {
        const value = !this.value && this.props.type === 'text' ? '' : this.value;
        return (
            <input {...this.props} value={ value } onChange={ this.onChange } />
        );
    }
}
