/* @flow */

import _ from 'lodash';

import type { Constraint } from  './Constraints';


export const FormStatuses = {
    pristine : 'pristine',
    dirty    : 'dirty'
};

export type FormStatus = $Keys<typeof FormStatuses>;


export default class FormValidity {

    fields : Object;

    constructor( fields : Object = {} ) {
        this.fields = fields;
    }

    static fromModel( model : Object ) : FormValidity {
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
            fields[ prop ] = new FormFieldValidity( prop, model[ prop ], constraints[ prop ], FormStatuses.pristine );
        } );
        return new FormValidity( fields );
    }

    get status() : FormStatus {
        for( let key of _.keys( this.fields ) ) {
            if ( this.fields[ key ].status === FormStatuses.dirty ) {
                return FormStatuses.dirty;
            }
        }
        return FormStatuses.pristine;
    }

    get pristine() : boolean { return this.status === FormStatuses.pristine; }

    get dirty() : boolean { return this.status === FormStatuses.dirty; }

    get valid() : boolean {
        for( let key of _.keys( this.fields ) ) {
            if ( this.fields[ key ].invalid ) {
                return false;
            }
        }
        return true;
    }

    get invalid() : boolean {
        return !this.valid;
    }
}


export class FormFieldValidity {
    prop                    : string;
    _value                  : ?any;
    constraints             : Array< Constraint >;
    status                  : FormStatus;
    unsatisfiedConstraints  : Array< Constraint >;

    constructor( prop : string, value : ?any = null, constraints : Array< Constraint > = [], status : FormStatus = FormStatuses.pristine ) {
        this.prop                   = prop;
        this._value                 = value;
        this.constraints            = constraints;
        this.status                 = status;
        this.checkValidity();
    }

    get value() : ?any { return this._value; }

    set value( value : ?any ) {
        this._value = value;
        this.status = FormStatuses.dirty;
    }

    checkValidity() {
        this.unsatisfiedConstraints = this.constraints.filter( ( constraint : Constraint ) => !constraint.match( this.value ) );
    }

    get valid() : boolean { return !this.unsatisfiedConstraints.length; }

    get invalid() : boolean { return !this.valid; }

    get pristine() : boolean { return this.status === FormStatuses.pristine; }

    get dirty() : boolean { return this.status === FormStatuses.dirty; }
}
