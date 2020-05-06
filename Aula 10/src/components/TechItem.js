import React from 'react';

import PropTypes from 'prop-types';

// aqui nao preciso ter o state, armazenar informacoes, etc
// posso usar o formato de funcao

// quando esta funcao é chamada no TechList
// ele executa este trecho de código
// aqui estou recebendo a info de lá por meio de parametros (tech, onDelete)
// foi desestruturado porque vem props.tech, ai pega a tech direto

// this.props.tech - aqui seria a forma de acesso no formato de classe dentro de um metodo
function TechItem({ tech, onDelete }) {
    return (
        <li>
            {tech}
            <button onClick={onDelete} type="button">Remover</button>
        </li>
    )
}

// aqui eu posso ter um valor padrao para TechItem, caso nao seja informado nenhum valor
// defaultProps - modifico uma propriedade dentro deste componente
// entao quando o tech nao for informado, vai ser inserido nele Oculto
// se fosse uma classe, la no inicio dela
// eu ia definir static defaultProps = {tech: 'Oculto'}
TechItem.defaultProps = {
    tech: 'Oculto',
};

// temos uma forma de validar as props que nosso componente recebe
// para isso usamos a dependência propTypes
// estou dizendo que a propriedade é do tipo string e poderia ser obrigatória
// como tem o defaultProps, ai ela nao precisa ser obrigatória
// o mesmo funciona para funcoes 
TechItem.propTypes = {
    tech: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
};

export default TechItem;