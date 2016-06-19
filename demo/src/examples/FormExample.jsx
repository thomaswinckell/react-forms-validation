/* @flow */

import React, { Component, PropTypes }  from 'react';

import Form, { Constraint, Number, Min, Max, Email,
    MaxLength, OneOf, FormFieldWrapper,
    FormStatus }         from 'react-forms-validation';

import type { FormValidity, FormFieldValidity } from 'react-forms-validation';

import Messages    from './Messages';


class ModelExample {

    @MaxLength( 10 )
    id : string;

    @Number @Min( 10 ) @Max( 20 )
    number : number;

    @Email
    email : string;

    @Constraint( 'termsAccepted', value => !!value )
    termsAccepted : boolean;

    /*static constraints = {
        number : [ Number(), Min( 10 ), Max( 20 ) ]
    };*/
}


type FormExampleState = {
    myModel : ModelExample,
    validity: ?FormValidity
};

export default class FormExample extends Component {

    state : FormExampleState;

    constructor( props : Object ) {
        super( props );
        this.state = {
            myModel  : new ModelExample(),
            validity : null
        };
    }

    handleFormChange( value : any, validity : FormValidity ) : void {
        this.setState( { myModel : value, validity } );
    }

    handleFormSubmit( event : SyntheticMouseEvent ) : void {
        event.preventDefault();
        console.log( this.state.myModel );
    }

    renderInput( id : string, value : ?string, onChange : ( value : ?string ) => void , validity : FormFieldValidity ) : React.Element {
        return (
            <div className="form-group">
                <label for={ id }>{ Messages.form[ id ].label }</label>
                <input type="text" value={ value || '' } onChange={ event => onChange( event.target.value ) }
                       className="form-control" id={ id } placeholder={ Messages.form[ id ].placeholder } />
                <div>Errors : { JSON.stringify( validity.unsatisfiedConstraints ) }</div>
            </div>
        );
    }

    renderCheckbox( id : string, value : ?boolean, onChange : ( value : ?boolean ) => void, validity : FormFieldValidity ) : React.Element {
        return (
            <div class="checkbox">
                <label>
                    <input type="checkbox" checked={ value } onClick={ event => onChange( !value ) }/> { Messages.form[ id ].label }
                </label>
                <div>Errors : { JSON.stringify( validity.unsatisfiedConstraints ) }</div>
            </div>
        );
    }

    render() : React.Element {
        return (
            <Form value={ this.state.myModel } onChange={ this.handleFormChange } onSubmit={ this.handleFormSubmit }>

                <FormFieldWrapper propertyName="id" renderFormField={ this.renderInput } />

                <FormFieldWrapper propertyName="number" renderFormField={ this.renderInput } />

                <FormFieldWrapper propertyName="email" renderFormField={ this.renderInput } />

                <FormFieldWrapper propertyName="termsAccepted" renderFormField={ this.renderCheckbox } />

                <div>Model : { JSON.stringify( this.state.myModel ) }</div>

                <div>Validity : { JSON.stringify( this.state.validity ) }</div>

                <button type="submit" className="btn btn-default">Submit</button>
            </Form>
        );
    }
}
