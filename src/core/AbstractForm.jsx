/* @flow */

import _                                from 'lodash';
import React, { Component, PropTypes }  from 'react';

import FormFieldWrapper                     from './FormFieldWrapper';
import FormValidity, { FormFieldValidity }  from './FormValidity';


export type AbstractFormProps = {
    triggerOnChangeOnInit : boolean,
    value                 : Object,
    onChange              : ( value : ?any, validity : FormValidity ) => void
};

export default class AbstractForm extends Component {

    validity : FormValidity;

    static defaultProps : AbstractFormProps = {
        triggerOnChangeOnInit : true
    };

    constructor( props : AbstractFormProps ) {
        super( props );
        this.validity = FormValidity.fromModel( this.model );
    }

    componentDidMount() {
        if( this.props.triggerOnChangeOnInit ) {
            this.props.onChange( this.model, this.validity );
        }
    }

    get model() : Object { return this.props.value; }

    get constraints() : Object { return this.model.constructor.__constraints || {}; }

    link( prop : string ) {
        return {
            value           : this.validity.fields[ prop ],
            requestChange   : ( fieldValidity : FormFieldValidity ) => {
                // TODO : is merge really usefull ?
                const newValue = _.merge( new this.model.constructor(), this.model, { [ prop ] : fieldValidity.value } );
                let validityFields = _.merge( {}, this.validity.fields, { [ prop ] : fieldValidity } );
                this.validity = new FormValidity( validityFields );
                this.props.onChange( newValue, this.validity );
            }
        };
    }

    setChildrenWrapper( child : React.Element ) : ?React.Element {

        // if the child is a form field wrapper
        // $FlowFixMe
        if( child && child.type && child.type.prototype && ( FormFieldWrapper.prototype.isPrototypeOf( child.type.prototype ) || FormFieldWrapper.prototype === child.type.prototype ) ) {

            if( !child.props || !child.props.propertyName ) {
                throw 'FormFieldWrapper should have propertyName prop';
            }

            const valueLink = this.link( child.props.propertyName );

            return React.cloneElement( child, { valueLink } );
        }

        return child;
    }

    renderChildren() : React.Element {
        return React.Children.map( this.props.children, this.setChildrenWrapper.bind( this ) );
    }

    /**
     * @abstract
     */
    render() : ?React.Element {
        throw new Error( 'Form component should override the render method.' )
    }
}
