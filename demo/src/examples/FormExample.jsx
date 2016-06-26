/* @flow */

import classNames                               from 'classnames';
import React, { Component, PropTypes }          from 'react';

import Form, {
    FormField, Input,
    FormFieldValidity
}                            from 'react-forms-validation';
import type { FormValidity } from 'react-forms-validation';

import ModelExample from './ModelExample';
import Messages     from './Messages';


const validityCondition = ( validity : FormFieldValidity ) => validity.invalid; // && validity.dirty;

type ErrorMessageProps = {
    validity : FormFieldValidity
};

class ErrorMessage extends Component {

    static propTypes = {
        validity : PropTypes.instanceOf( FormFieldValidity ).isRequired
    };

    constructor( props : ErrorMessageProps ) {
        super( props );
        const errorMessage = this.getErrorMessage( props.validity );
        this.state = { errorMessage };
    }

    componentWillReceiveProps( nextProps : ErrorMessageProps ) {
        const errorMessage = this.getErrorMessage( nextProps.validity );
        this.setState( { errorMessage } );
    }

    getErrorMessage( validity : FormFieldValidity ) : ?string {
        if( validityCondition( validity ) ) {
            const constraint = validity.unsatisfiedConstraints[ 0 ];
            let message = Messages.form[ validity.prop ].errors[ constraint.id ];
            const messageValues = _.keys( constraint );
            messageValues.forEach( ( key ) => {
                message = message.replace( new RegExp( `\{${key}\}`, 'g' ), constraint[ key ] );
            } );
            return message;
        }
        return null;
    }

    render() {
        const { errorMessage } = this.state;
        if( !errorMessage ) {
            return null;
        }
        return (
            <div>
                <label className="control-label">
                    { errorMessage }
                </label>
            </div>
        );
    }
}


type FormExampleProps = {};

type FormExampleState = {
    myModel : ModelExample,
    validity: ?FormValidity
};

export default class FormExample extends Component {

    state : FormExampleState;

    constructor( props : FormExampleProps ) {
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

    renderInput( prop : string, value : ?string, onChange : ( value : ?string ) => void , validity : FormFieldValidity ) : React.Element {
        const { label, placeholder } = Messages.form[ prop ];
        return (
            <div className={ classNames( 'form-group', { 'has-error' : validityCondition( validity ) } ) }>
                <label for={ prop } className="control-label">{ label }</label>
                <Input type="text" value={ value } onChange={ onChange }
                       className="form-control" id={ prop } placeholder={ placeholder } />
                <ErrorMessage validity={ validity } />
            </div>
        );
    }

    renderCheckbox( prop : string, value : ?boolean, onChange : ( value : ?boolean ) => void, validity : FormFieldValidity ) : React.Element {
        const { label } = Messages.form[ prop ];
        return (
            <div className={ classNames( 'checkbox', { 'has-error' : validityCondition( validity ) } ) }>
                <label>
                    <Input type="checkbox" checked={ value } onClick={ event => onChange( !value ) }/> { label }
                </label>
                <ErrorMessage validity={ validity } />
            </div>
        );
    }

    render() : React.Element {
        return (
            <Form value={ this.state.myModel } onChange={ this.handleFormChange.bind( this ) } onSubmit={ this.handleFormSubmit.bind( this ) }>

                <FormField prop="id"             render={ this.renderInput } />

                <FormField prop="civility"       render={ this.renderInput } />

                <FormField prop="textNumber"     render={ this.renderInput } />

                <FormField prop="email"          render={ this.renderInput } />

                <FormField prop="termsAccepted"  render={ this.renderCheckbox } />

                <div>Model : { JSON.stringify( this.state.myModel ) }</div>

                <div>Validity : { JSON.stringify( this.state.validity ) }</div>

                <button type="submit" className="btn btn-default">Submit</button>
            </Form>
        );
    }
}
