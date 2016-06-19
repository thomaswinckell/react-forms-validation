/* @flow */

import _ from 'lodash';

import type { Constraint } from  './Constraints';


export const FormStatus = {
    pristine : 'pristine',
    dirty    : 'dirty'
};


export default class FormValidity {
    fields : object = {};

    constructor( fields : object = {} ) {
        this.fields = fields;
    }

    static fromModel( model : object ) : FormValidity {
        if( !model.constructor ) {
            throw 'Form value should have a constructor';
        }
        if( !model.constructor.__constraints ) {
            // simulate the use of decorators
            const constraints = model.constructor.constraints || {};
            _.keys( constraints ).forEach( prop => {
                constraints[ prop ].reverse().forEach( constraint => {
                    constraint( model, prop );
                } );
            } );
        }
        const constraints = model.constructor.__constraints || {};
        let fields = {};
        _.keys( constraints ).forEach( prop => {
            fields[ prop ] = new FormFieldValidity( prop, model[ prop ], constraints[ prop ], FormStatus.pristine );
        } );
        return new FormValidity( fields );
    }

    get status() {
        for( let key of _.keys( this.fields ) ) {
            if ( this.fields[ key ].status === FormStatus.dirty ) {
                return FormStatus.dirty;
            }
        }
        return FormStatus.pristine;
    }

    isValid() : boolean {
        for( let key of _.keys( this.fields ) ) {
            if ( this.fields[ key ].isInvalid() ) {
                return false;
            }
        }
        return true;
    }

    isInvalid() : boolean {
        return !this.isValid();
    }
}


export class FormFieldValidity {
    id                      : string;
    _value                  : ?any;
    constraints             : Array< Constraint >;
    status                  : FormStatus;
    unsatisfiedConstraints  : Array< Constraint >;

    constructor( id : string, value : ?any = null, constraints : Array< Constraint > = [], status : FormStatus = FormStatus.pristine ) {
        this.id                     = id;
        this._value                 = value;
        this.constraints            = constraints;
        this.status                 = status;
        this.checkValidity();
    }

    get value() : ?any { return this._value; }

    set value( value : ?any ) {
        this._value = value;
        this.status = FormStatus.dirty;
    }

    checkValidity() {
        this.unsatisfiedConstraints = this.constraints.filter( ( constraint : Constraint ) => !constraint.match( this.value ) );
    }

    isValid() : boolean { return !this.unsatisfiedConstraints.length; }

    isInvalid() : boolean { return !this.isValid(); }
}
