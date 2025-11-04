// src/CharacterLoader.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Form, InputGroup, Button } from 'react-bootstrap';
import { Search } from 'lucide-react';

function CharacterLoader() {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [minMass, setMinMass] = useState('');
  const [maxMass, setMaxMass] = useState('');

  const fetchAllCharacters = async () => {
    setLoading(true);
    try {
      let allCharacters = [];
      let url = 'https://swapi.dev/api/people/';
      while (url) {
        const response = await axios.get(url);
        allCharacters = [...allCharacters, ...response.data.results];
        url = response.data.next;
      }
      const sorted = allCharacters.sort((a, b) => a.name.localeCompare(b.name));
      setCharacters(sorted);
      setFilteredCharacters(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCharacters();
  }, []);

  useEffect(() => {
    let results = characters.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
    if (gender) {
      results = results.filter((c) => c.gender === gender);
    }
    if (minMass) {
      results = results.filter(
        (c) => !isNaN(parseFloat(c.mass)) && parseFloat(c.mass) >= parseFloat(minMass)
      );
    }
    if (maxMass) {
      results = results.filter(
        (c) => !isNaN(parseFloat(c.mass)) && parseFloat(c.mass) <= parseFloat(maxMass)
      );
    }
    results.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredCharacters(results);
  }, [search, gender, minMass, maxMass, characters]);

  return (
    <Container className="my-5">
      <h1 className="mb-4 text-primary fw-bold text-center">
        Personajes de Star Wars
      </h1>

      <InputGroup className="mb-4">
        <InputGroup.Text><Search size={18} /></InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Buscar personaje..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outline-secondary" onClick={() => setSearch('')}>
          Limpiar
        </Button>
      </InputGroup>

      <Row className="mb-4">
        <Col md={4} sm={6} className="mb-2">
          <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Filtrar por género</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="n/a">No aplica</option>
          </Form.Select>
        </Col>
        <Col md={4} sm={6} className="mb-2">
          <Form.Control
            type="number"
            placeholder="Peso mínimo"
            value={minMass}
            onChange={(e) => setMinMass(e.target.value)}
          />
        </Col>
        <Col md={4} sm={6} className="mb-2">
          <Form.Control
            type="number"
            placeholder="Peso máximo"
            value={maxMass}
            onChange={(e) => setMaxMass(e.target.value)}
          />
        </Col>
      </Row>

      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando personajes...</p>
        </div>
      )}

      {!loading && filteredCharacters.length === 0 && (
        <p className="text-muted text-center">
          No se encontraron personajes con esos filtros.
        </p>
      )}

      <Row>
        {filteredCharacters.map((character, index) => (
          <Col key={index} sm={6} md={4} lg={3} className="mb-4">
            <Card className="shadow-sm border-0 h-100 hover-card">
              <Card.Body>
                <Card.Title className="fw-bold text-dark">
                  {character.name}
                </Card.Title>
                <Card.Text className="text-muted">
                  <strong>Género:</strong> {character.gender}<br />
                  <strong>Peso:</strong> {character.mass} kg<br />
                  <strong>Año de nacimiento:</strong> {character.birth_year}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CharacterLoader;
