import React, { Component } from 'react';

import api from './axio';
class Dashboard extends Component {
  state = {
    people: [],
    selectedPersonId: null,
    productName: '',
    productValue: '',
    products: [],
  };

  componentDidMount() {
    this.fetchPeople();
  }

  fetchPeople = async () => {
    try {
      const response = await api.get('/api/people/list');
      console.log(response)
      this.setState({ people: response.data });
    } catch (error) {
      console.error('Erro ao buscar a lista de pessoas:', error);
    }
  };

  handlePersonChange = (event) => {
    this.setState({ selectedPersonId: event.target.value });
  };

  handleProductNameChange = (event) => {
    this.setState({ productName: event.target.value });
  };

  handleProductValueChange = (event) => {
    this.setState({ productValue: event.target.value });
  };

  handleAddProduct = async () => {
    const { selectedPersonId, productName, productValue } = this.state;
    if (!selectedPersonId || !productName || !productValue) {
      return;
    }

    try {
      await api.post('/api/products', {
        personId: selectedPersonId,
        name: productName,
        value: productValue,
      });
      this.setState({ productName: '', productValue: '' });
      this.fetchPeople(); // Atualiza a lista de pessoas após a adição do produto
    } catch (error) {
      console.error('Erro ao adicionar o produto:', error);
    }
  };

  render() {
    const { people, selectedPersonId, productName, productValue } = this.state;

    return (
      <div>
        <h1>Gerenciamento de Pessoas e Produtos</h1>
        <div>
          <h2>Adicionar Produto</h2>
          <div>
            <label>Escolha o usuário:</label>
            <select value={selectedPersonId} onChange={this.handlePersonChange}>
              <option value="">Selecione um usuário</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Nome do produto:</label>
            <input type="text" value={productName} onChange={this.handleProductNameChange} />
          </div>
          <div>
            <label>Valor do produto:</label>
            <input type="number" value={productValue} onChange={this.handleProductValueChange} />
          </div>
          <button onClick={this.handleAddProduct}>Adicionar Produto</button>
        </div>
      </div>
    );
  }
}

export default Dashboard;
