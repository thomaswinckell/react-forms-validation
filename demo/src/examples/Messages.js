/* @flow */

export default {
    form : {
        id            : {
            label       : 'Id',
            placeholder : 'Write a id',
            errors      : {
                maxLength : 'Id should have a maximum length of {maxLength} characters.',
                minLength : 'Id should have a minimum length of {minLength} characters.',
                required  : 'Id is required'
            }
        },
        textNumber    : {
            label       : 'Text Number',
            placeholder : 'Write a number',
            errors      : {
                number : 'Should be a number.',
                min    : 'Should be at least {min}.',
                max    : 'Should be {max} maximum.'
            }
        },
        email         : {
            label       : 'Email',
            placeholder : 'Write an email',
            errors      : {
                email    : 'Should be a valid email.',
                required : 'Email is required'
            }
        },
        termsAccepted : {
            label  : 'Accept terms & agreements',
            errors : {
                acceptTerms : 'You should accept the terms and agreements'
            }
        },
        civility      : {
            label       : 'Civility',
            placeholder : 'Mr or Mme ?',
            errors      : {
                oneOfValues : 'Civility should be either `Mme` or `Mr`.'
            }
        }
    }
};
