/* @flow */

import type { Constraint } from './Constraints';

/**
 * Helper that transform a constraint definition or instance into a decorator
 * 
 * @param constraint    Either a constraint class instance or a constraint class
 * @returns Constraint decorator
 */
export function toDecorator( constraint : Function|Constraint ) {

    function _toDecorator( constraint : Function|Constraint ) {

        return function decorator( target : ?Function, name : string, descriptor : ?any ) : ?any {

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
        // $FlowFixMe
        return ( ...constraintsParams : Array< any > ) => _toDecorator( new constraint( ...constraintsParams ) );
    } else {
        throw 'Constraint should be either a function or an object';
    }
}
