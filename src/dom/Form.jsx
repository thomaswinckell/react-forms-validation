/* @flow */

import React                            from 'react';

import AbstractForm                     from '../core/AbstractForm';


export default class Form extends AbstractForm {

    /**
     * @override AbstractForm
     */
    render() : React.Element {
        
        const { triggerOnChangeOnInit, ...other } = this.props;
        
        return(
            <form { ...other } onChange={ null }>
                { this.renderChildren() }
            </form>
        );
    }
}
