import React from 'react';
import { Icon } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import './landing/css/main.css';

const year = new Date().getFullYear();

const Landing = () => (
  <div>
    <Header id="header">
      <div className="content">
        <img src="logo-small.png" alt="Agromotiva" />
        <p>
          Agromotiva te ayuda a hacer crecer tu negocio a trav&eacute;s de la
          compra y venta de productos agr&iacute;colas.
        </p>
        <ul className="actions">
          {/* <li>
            <a href="#download" className="button special icon fa-download">
              Descargar
            </a>
          </li> */}
          <li>
            <a
              href="#learn-more"
              className="button icon fa-chevron-down scrolly"
            >
              Leer mas
            </a>
          </li>
        </ul>
      </div>
      <div className="image phone">
        <div className="inner">
          <img src="cover.jpg" alt="" />
        </div>
      </div>
    </Header>

    <section id="learn-more" className="wrapper style2 special">
      <Container>
        <header className="major">
          <h2>Agromotiva apoyando tu emprendimiento agricola en linea</h2>

          <p>
            Como comprador puede ingresar a la aplicacion, visualizar los
            productos, y ponerse en contacto con el proveedor de su preferencia.
          </p>

          <p>&nbsp;</p>

          <h2>AGROMOTIVA</h2>
          <p>
            Capacita, crea y mantiene una ecologia productiva y emprendedora.
          </p>
          <p>
            Recuerda: <i>para todo p&uacute;blico y gratis.</i>
          </p>
        </header>
        <ul className="icons major">
          <li>
            <span className="icon fa-camera-retro">
              <span className="label">Shoot</span>
            </span>
          </li>
          <li>
            <span className="icon fa-refresh">
              <span className="label">Process</span>
            </span>
          </li>
          <li>
            <span className="icon fa-cloud">
              <span className="label">Upload</span>
            </span>
          </li>
        </ul>
      </Container>
    </section>

    <section id="download" className="wrapper style2 special">
      <Container>
        <header className="major">
          <h2>Descarga la aplicacion</h2>
          <p>
            Descarga la aplicacion totalmente gratis! Disponible en ambas
            plataformas, android y ios.
          </p>
        </header>
        {/* <ul className="actions">
          <li>
            <a href="#app" className="button special">
              <Icon type="android" /> Play Store
            </a>
          </li>
          <li>
            <a href="#one" className="button special">
              <Icon type="apple" /> Apple Store
            </a>
          </li>
        </ul> */}
        <h4>Muy pronto!</h4>
      </Container>
    </section>

    <footer id="footer">
      <p className="copyright">
        { year } &reg; AGROMOTIVA. &mdash; <Link to="/privacy-policy">Politicas de Privacidad</Link>
      </p>
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
