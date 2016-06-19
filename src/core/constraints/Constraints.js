/* @flow */

import _ from 'lodash';


export class Constraint {

    id         : string;
    _matchFunc : ?( value : any ) => boolean;

    constructor( id : string, matchFunc : ?( value : any ) => boolean  ) {
        this.id = id;
        if( matchFunc ) {
            this._matchFunc = matchFunc;
        }
    }

    match( value : any ) : boolean {
        if( !this._matchFunc ) {
            throw 'Constraint should override the match method.';
        }
        return this._matchFunc( value );
    }
}


export const Required = new Constraint( 'required', value => !!value );


export class NonEmpty extends Constraint {

    constructor() {
        super( 'nonEmpty' );
    }

    match( value : any ) : boolean {
        if( _.isArray( value ) || _.isString( value ) ) {
            return !!value.length;
        }
        if( _.isObject( value ) ) {
            return !!_.keys( value ).length;
        }
        return _.isNumber( value );
    }
}


export class MinLength extends Constraint {

    minLength : number;

    constructor( minLength : number = 0 ) {
        super( 'minLength' );
        this.minLength = minLength;
    }

    match( value : any ) : boolean {
        if ( _.isArray( value ) || _.isString( value ) ) {
            return value.length >= this.minLength;
        }
        if ( _.isObject( value ) ) {
            return !!_.keys( value ).length >= this.minLength;
        }
        return false;
    }
}


export class MaxLength extends Constraint {

    maxLength : number;

    constructor( maxLength : number = 0 ) {
        super( 'maxLength' );
        this.maxLength = maxLength;
    }

    match( value : any ) : boolean {
        if ( _.isArray( value ) || _.isString( value ) ) {
            return value.length <= this.maxLength;
        }
        if ( _.isObject( value ) ) {
            return !!_.keys( value ).length <= this.maxLength;
        }
        return false;
    }
}


export class Number extends Constraint {

    constructor( id : string = 'number' ) {
        super( id );
    }

    match( value : any ) : boolean {
        return parseInt( value ).toString() === value;
    }
}


export class Min extends Number {

    min : number;

    constructor( min : number = 0 ) {
        super( 'min' );
        this.min = min;
    }

    match( value : any ) : boolean {
        return super.match( value ) && value >= this.min;
    }
}


export class Max extends Number {

    max : number;

    constructor( max : number = 0 ) {
        super( 'max' );
        this.max = max;
    }

    match( value : any ) : boolean {
        return super.match( value ) && value <= this.max;
    }
}


export class Regexp extends Constraint {

    regexp : RegExp;

    constructor( regexp : RegExp, id : string = 'regexp' ) {
        super( id );
        this.regexp = regexp;
    }

    match( value : any ) : boolean {
        if ( _.isString( value )  ) {
            return value.match( this.regexp );
        }
        return false;
    }
}


export const Email = new Regexp( /\S+@\S+\.\S+/, 'email' );


export class OneOf extends Constraint {

    values : Array< any >;

    constructor( ...values : Array< any >  ) {
        super( 'oneOf' );
        this.values = values;
    }

    match( value : any ) : boolean {
        return !!_.find( this.values, v => v === value );
    }
}
