/* @flow */

import React, { Component, PropTypes }  from 'react';

import type { FormFieldValidity }       from './FormValidity';


export default class FormFieldWrapper extends Component {

    get fieldValidity() : FormFieldValidity { return this.props.valueLink.value; }

    onChange( value : ?any ) {
        this.fieldValidity.value = value;
        this.fieldValidity.checkValidity();
        this.props.valueLink.requestChange( this.fieldValidity );
    }

    render() {
        console.log('renderFormFieldWrapper');
        const { id, value } = this.fieldValidity;
        return this.props.renderFormField( id, value, this.onChange.bind( this ), this.fieldValidity );
    }
}
