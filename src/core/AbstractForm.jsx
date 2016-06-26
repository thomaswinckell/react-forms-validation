/* @flow */

import _                                from 'lodash';
import React, { Component, PropTypes }  from 'react';

import FormField                            from './FormField';
import FormValidity, { FormFieldValidity }  from './FormValidity';


export type AbstractFormProps = {
    value                 : Object,
    onChange              : ( value : ?any, validity : FormValidity ) => void,
    triggerOnChangeOnInit : boolean
};

export default class AbstractForm extends Component {

    validity : FormValidity;

    static propTypes = {
        value                   : PropTypes.object.isRequired,
        onChange                : PropTypes.func.isRequired,
        triggerOnChangeOnInit   : PropTypes.bool
    };

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
                let newValue = _.clone( this.model );
                newValue[ prop ] = fieldValidity.value;
                let validityFields = _.merge( {}, this.validity.fields, { [ prop ] : fieldValidity } );
                this.validity = new FormValidity( validityFields );
                this.props.onChange( newValue, this.validity );
            }
        };
    }

    setChildrenWrapper( child : React.Element ) : ?React.Element {

        // if the child is a form field wrapper
        // $FlowFixMe
        if( child && child.type && child.type.prototype && ( FormField.prototype.isPrototypeOf( child.type.prototype ) || FormField.prototype === child.type.prototype ) ) {

            if( !child.props || !child.props.prop ) {
                throw 'FormField should have a prop named `prop`';
            }

            const valueLink = this.link( child.props.prop );
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
        throw 'Form component should override the render method.';
    }
}
