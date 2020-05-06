import React, { Component } from 'react';

import TechItem from './TechItem';

// além do uso de funções, posso estar usando também classes
class TechList extends Component {
 
    // declaração do estado (propriedade state)
    // inicia com newTech e techs vazio (estado inicial)
    // newTech vai armazenar o novo valor da tecnologia que vai ir para a lista techs
    state = {
        newTech: '',
        techs: []
    };

    // aqui estamos abordando o ciclo de vida do react
    // executado assim que componente aparece em tela
    componentDidMount(){
        //buscar dados de uma api externa (no caso de um local storage no navegador)
        const techs = localStorage.getItem('techs');

        // se houver tecnologias no storage, seta o estado e adiciona elas
        // o estado atualizado mostra as tecnologias inseridas
        if(techs){
            this.setState({ techs: JSON.parse(techs) });
        }
    }

    // executado sempre que houver alterações nas props ou estado
    componentDidUpdate(prevProps, prevState){
        // ele recebe essas props e estado antes de serem alterados como parametros
        // por exemplo, se houver alguma alteração nas props
        // a gente consegue acessar as novas props que foram alteradas atraves de this.props
        // se houve alteracoes no estado, atraves de this.state
        if(prevState !== this.state.techs){
            localStorage.setItem('techs', JSON.stringify(this.state.techs));
        }
    }

    // executado quando o componente deixa de existir
    componentWillUnmount(){
        // podemos limpar alguma coisa que ficou
    }

    
    // este método é acionado quando o state é alterado
    // cada mudança no input aciona isto aqui e ele muda o valor de newTech (setState)
    // está no formato de arrow function para poder ter acesso ao this (função própria)
    // se não estiver neste formato, acaba não tendo acesso ao this
    handleInputChange = e => {
        console.log(e.target.value);
        this.setState({ newTech: e.target.value })
    }

    // este método é acionado quando o form é submetido
    handleSubmit = e => {
        //evita o refresh da página
        e.preventDefault();
        // aqui estou mudando o estado
        // ele pega as tecnologias que já existiam no estado
        // e também adiciona a tecnologia que está em newTech como ultima posicao do array
        // depois disso zera a newTech (zera o input)
        this.setState({
            techs: [...this.state.techs, this.state.newTech],
            newTech: ''
        });
    }

    // este método é acionado quando clicar no botão delete
    // ele muda o estado
    // acessa a lista de techs, busca pela tecnologia
    // deixa somente aquelas que nao iguais a tecnologia passada para ser deletada
    handleDelete = (tech) => {
        this.setState({ techs: this.state.techs.filter(t => t !== tech) })
    }

    // com a classe, precisamos ter um método render 
    render() {
        return (
            // aqui cria o nosso formulário
            // quando ele for submetido, aciona a função handleSubmit
            // ul cria a nossa lista
            // o map acessa o estado e acessa a techs e percorre este array de tecnologias
            // daí pego cada uma destas tecnologias e posso retornar o que desejar
            // quando fazemos um map com uma lista de itens
            // ele precisa ter uma propriedade key (valor único)
            // depois passamos a tecnologia em si (valor)

            // o primeiro TechItem representa a lista completa (com os dados que teriam no storage)
            // a segunda lista representa a busca de um valor padrao no TechItem
            // a terceira lista representa a definição aqui de um valor padrão (local)

            // caso eu clique no botão remover, ele aciona o método handleDelete
            // eu tenho que passar uma funcao para chamar dai o metodo handleDelete
            // se eu fizer direto, ele ja executa o codigo assim que montar em tela

            // o input recebe o valor que eu quero adicionar na lista
            // o button aciona o submit do form

            // estamos também exercitando o conceito de propriedade
            // propriedade é tudo que passamos para o componente dentro da tag
            // entao to passando para a propriedade tech, as techs (tech)
            // também vou passar a propriedade onDelete, que é uma funcao
            // e essa funcao vai chamar o metodo handleDelete
            // a funcao handleDelete tem que ficar aqui, para ver a parte do estado
            // eu passo para o TechItem ele conhecer a funcao handleDelete
            <form onSubmit={this.handleSubmit}>
                <ul>
                    {this.state.techs.map(tech => 
                    <TechItem 
                        key={tech} 
                        tech={tech} 
                        onDelete={() => this.handleDelete(tech)} 
                    />)}
                    <TechItem />
                    <TechItem tech="Adonis" />
                </ul>
                <input
                    type="text"
                    onChange={this.handleInputChange}
                    value={this.state.newTech}
                />
                <button type="submit">Enviar</button>
            </form>
        )
    }
}

export default TechList;