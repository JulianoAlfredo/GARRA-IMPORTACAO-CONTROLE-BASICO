import React, { Component } from 'react';

import api from './axio';

class AddUser extends Component {
  state = {
    userName: '',
  };

  handleUserNameChange = (event) => {
    this.setState({ userName: event.target.value });
  };

  handleAddUser = async () => {
    const { userName } = this.state;
    if (!userName) {
      return;
    }

    try {
      await api.post('/api/people', { name: userName });
      this.setState({ userName: '' });
      this.props.onUserAdded(); // Atualiza a lista de pessoas após a adição de um novo usuário
    } catch (error) {
      console.error('Erro ao adicionar o usuário:', error);
    }
  };

  render() {
    const { userName } = this.state;

    return (
      <div>
        <h2>Adicionar Usuário</h2>
        <div>
          <label>Nome do usuário:</label>
          <input type="text" value={userName} onChange={this.handleUserNameChange} />
        </div>
        <button onClick={this.handleAddUser}>Adicionar Usuário</button>
      </div>
    );
  }
}

export default AddUser;
