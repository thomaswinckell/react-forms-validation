/* @flow */

import React                            from 'react';

import AbstractForm                     from '../core/AbstractForm';


export default class Form extends AbstractForm {

    render() : React.Element {
        console.log('renderForm')
        return(
            <form { ...this.props } onChange={ null }>
                { this.renderChildren() }
            </form>
        );
    }
}
