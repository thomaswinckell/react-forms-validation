/* @flow */

import React, { Component, PropTypes }  from 'react';

import type { FormFieldValidity }       from './FormValidity';


export default class FormField extends Component {

    get fieldValidity() : FormFieldValidity { return this.props.valueLink.value; }

    onChange( value : ?any ) {
        this.fieldValidity.value = value;
        this.fieldValidity.checkValidity();
        this.props.valueLink.requestChange( this.fieldValidity );
    }

    render() {
        const { prop, value } = this.fieldValidity;
        return this.props.render( prop, value, this.onChange.bind( this ), this.fieldValidity );
    }
}
