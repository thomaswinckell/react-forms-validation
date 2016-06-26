/* @flow */

import React from 'react';

import Field from './Field';

export default class Textarea extends Field {

    render() : React.Element {
        return (
            <textarea { ...this.props } value={ this.value || '' } onChange={ this.onChange } />
        )
    }
}
