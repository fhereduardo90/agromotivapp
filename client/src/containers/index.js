import React from 'react';
import { Icon } from 'antd';
import styled from 'styled-components';

import './landing/css/main.css'

const Landing = () => (
  <div>
    <Header id="header">
      <div className="content">
        <img src="logo-small.png" alt="Agromotiva" />
        <p>
          Agromotiva te ayuda a hacer crecer tu <br />
          negocio de venta de productos agricolas. <br />
          Enfocado en escuelas.
        </p>
        <ul className="actions">
          <li><a href="#download" className="button special icon fa-download">Descargar</a></li>
          <li><a href="#learn-more" className="button icon fa-chevron-down scrolly">Leer mas</a></li>
        </ul>
      </div>
      <div className="image phone"><div className="inner"><img src="cover.jpg" alt="" /></div></div>
    </Header>

    <section id="learn-more" className="wrapper style2 special">
      <Container>
        <header className="major">
          <h2>Agromotiva<br />
          Apoyando al agricultor</h2>

          <p>
            Agromotiva es una aplicacion creada para apoyar a los estudiantes y escuelas a emprenderse&nbsp;
            con la creacion de huertos y la potenciacion de sus productos en linea a travez de una aplicacion&nbsp;
            de facil uso y de acceso abierto a todo el publico.
          </p>
        </header>
        <ul className="icons major">
          <li><span className="icon fa-camera-retro"><span className="label">Shoot</span></span></li>
          <li><span className="icon fa-refresh"><span className="label">Process</span></span></li>
          <li><span className="icon fa-cloud"><span className="label">Upload</span></span></li>
        </ul>
      </Container>
    </section>

    <section id="download" className="wrapper style2 special">
      <Container>
        <header className="major">
          <h2>Descarga la aplicacion</h2>
          <p>Descarga la aplicacion totalmente gratis! Disponible en ambas plataformas, android y ios.</p>
        </header>
        <ul className="actions">
          <li><a href="#app" className="button special"><Icon type="android" /> Play Store</a></li>
          <li><a href="#one" className="button special"><Icon type="apple" /> Apple Store</a></li>
        </ul>
      </Container>
    </section>

    <footer id="footer">
      <p className="copyright">&copy; AGROMOTIVA.</p>
    </footer>
  </div>
);

const Header = styled.header`
  &#header {
    background-color: #74489e;
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 15px;
`;

export default Landing;