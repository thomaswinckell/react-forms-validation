/* @flow */

import _ from 'lodash';


export function toDecorator( constraint : Class|Constraint ) {

    function _toDecorator( constraint : Class|Constraint ) {

        return function decorator( target, name, descriptor ) {

            // if no arguments
            if( !target ) {
                return decorator;
            }

            if( !target.constructor || !name ) {
                throw 'Constraint decorator should be used on a class property declaration';
            }

            if ( !target.constructor.__constraints ) {
                Object.defineProperty( target.constructor, '__constraints', {
                    enumerable   : false,
                    configurable : false,
                    writable     : false,
                    value        : { [ name ] : [ constraint ] }
                } );
            } else {
                if ( !target.constructor.__constraints[ name ] ) {
                    target.constructor.__constraints[ name ] = [];
                }
                target.constructor.__constraints[ name ].unshift( constraint );
            }
            return descriptor;
        }
    }

    if( typeof constraint === 'object' ) {
        return _toDecorator( constraint );
    } else if( typeof constraint === 'function' ) {
        return ( ...constraintsParams : Array< any > ) => _toDecorator( new constraint( ...constraintsParams ) );
    } else {
        throw 'Constraint should be either a function or an object';
    }
}


class _Constraint {

    constructor( id : string, matchFunc : ( value: any ) => boolean  ) {
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

export const Constraint = toDecorator( _Constraint );


export const Required = toDecorator( new _Constraint( 'required', value => !!value ) );


export class NonEmptyConstraint extends _Constraint {

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

export const NonEmpty = toDecorator( new NonEmptyConstraint() );


export class MinLengthConstraint extends _Constraint {

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

export const MinLength = toDecorator( MinLengthConstraint );


export class MaxLengthConstraint extends _Constraint {

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

export const MaxLength = toDecorator( MaxLengthConstraint );



export class NumberConstraint extends _Constraint {

    constructor( id : string = 'number' ) {
        super( id );
    }

    match( value : any ) : boolean {
        return parseInt( value ).toString() === value;
    }
}

export const Number = toDecorator( new NumberConstraint() );

export class MinConstraint extends NumberConstraint {

    constructor( min : number = 0 ) {
        super( 'min' );
        this.min = min;
    }

    match( value : any ) : boolean {
        return super.match( value ) && value >= this.min;
    }
}

export const Min = toDecorator( MinConstraint );


export class MaxConstraint extends NumberConstraint {

    constructor( max : number = 0 ) {
        super( 'max' );
        this.max = max;
    }

    match( value : any ) : boolean {
        return super.match( value ) && value <= this.max;
    }
}

export const Max = toDecorator( MaxConstraint );


export class RegexpConstraint extends _Constraint {

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

export const Regexp = toDecorator( RegexpConstraint );


export const Email = toDecorator( new RegexpConstraint( /\S+@\S+\.\S+/, 'email' ) );


export class OneOfConstraint extends _Constraint {

    constructor( ...values : Array< any >  ) {
        super( 'oneOf' );
        this.values = values;
    }

    match( value : any ) : boolean {
        return !!_.find( this.values, v => v === value );
    }
}

export const OneOf = toDecorator( OneOfConstraint );
