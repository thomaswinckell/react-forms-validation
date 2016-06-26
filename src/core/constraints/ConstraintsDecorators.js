/* @flow */

import * as Constraints from './Constraints';
import { toDecorator }  from './Tools';


export const Constraint     = toDecorator( Constraints.Constraint );

export const Required       = toDecorator( Constraints.Required );

export const MinLength      = toDecorator( Constraints.MinLength );
export const MaxLength      = toDecorator( Constraints.MaxLength );

export const Number         = toDecorator( new Constraints.Number() );

export const Min            = toDecorator( Constraints.Min );
export const Max            = toDecorator( Constraints.Max );

export const Regexp         = toDecorator( Constraints.Regexp );

export const Email          = toDecorator( Constraints.Email );

export const OneOfValues    = toDecorator( Constraints.OneOfValues );
