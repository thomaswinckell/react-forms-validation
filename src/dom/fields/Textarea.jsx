/* @flow */

import React from 'react';

import Field from './Field';

export default class Textarea extends Field {

    handleChange( event : Event ) : void {
        // $FlowFixMe
        this.onChange( event.target.value );
    };

    render() : React.Element {
        return (
            <textarea { ...this.props } value={ this.value || '' } onChange={ e => this.onChange( e ) } />
        )
    }
}
