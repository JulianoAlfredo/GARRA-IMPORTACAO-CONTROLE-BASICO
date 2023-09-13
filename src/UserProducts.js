import React, { Component } from 'react';
import api from './axio';
class Report extends Component {
  state = {
    report: {
      people: [],
    },
    expandedPeople: {}, // Um objeto para controlar o estado de expansão de cada funcionário
  };

  componentDidMount() {
    this.fetchReport();
  }

  fetchReport = async () => {
    try {
      const response = await api.get('/api/reports');
      this.setState({ report: response.data });
    } catch (error) {
      console.error('Erro ao buscar o relatório:', error);
    }
  };

  toggleExpand = (personId) => {
    // Clone o estado atual de expandedPeople para evitar mutações diretas
    const updatedExpandedPeople = { ...this.state.expandedPeople };

    // Verifique se o funcionário está expandido ou recolhido
    if (updatedExpandedPeople[personId]) {
      // Se expandido, recolha
      delete updatedExpandedPeople[personId];
    } else {
      // Se recolhido, expanda
      updatedExpandedPeople[personId] = true;
    }

    this.setState({ expandedPeople: updatedExpandedPeople });
  };

  render() {
    const { report, expandedPeople } = this.state;

    return (
      <div>
        <h1>Relatório</h1>
        <ul>
          {report.people.map((person) => (
            <li key={person.id}>
              <strong onClick={() => this.toggleExpand(person.id)} style={{ cursor: 'pointer' }}>
                Nome: {person.name}
              </strong>
              {expandedPeople[person.id] && (
                <ul>
                  {person.products.map((product) => (
                    <li key={product.id}>
                      <strong>Nome do Produto:</strong> {product.name}
                      <br />
                      <strong>Data e Hora de Criação:</strong> {product.created_at}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Report;
