/* @flow */

import React, { PropTypes }    from 'react';

import Field    from './Field';

export default class Input extends Field {

    handleChange( event : Event ) {
        if( this.props.type === 'checkbox' ) {
            this.onChange( !this.value );
        } else {
            // $FlowFixMe
            this.onChange( event.target.value );
        }
    };

    render() : React.Element {
        const value = !this.value && this.props.type === 'text' ? '' : this.value;
        return (
            <input {...this.props} value={ value } onChange={ e => this.handleChange( e ) } />
        );
    }
}
