/* @flow */

import { Constraint, Number,
    Min, Max, Email, MaxLength,
    MinLength, OneOfValues }      from 'react-forms-validation';

export default class ModelExample {

    @MinLength( 10 ) @MaxLength( 20 )
    id : string;

    @OneOfValues( 'Mme', 'Mr' )
    civility : string;

    @Number @Min( 10 ) @Max( 20 )
    textNumber : number;

    @Email
    email : string;

    @Constraint( 'acceptTerms', value => !!value )
    termsAccepted : boolean;

    /*static constraints = {
        number : [ Number(), Min( 10 ), Max( 20 ) ]
     };*/
}
