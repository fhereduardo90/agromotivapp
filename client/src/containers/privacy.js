import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import './landing/css/main.css';

const year = new Date().getFullYear();

class Landing extends PureComponent {
  componentWillMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div>
        <Header id="header" className="small">
          <div className="container">
            <Link to="/">
              <img src="logo-small.png" alt="Agromotiva" />
            </Link>
          </div>
        </Header>

        <section id="learn-more" className="wrapper style2 special">
          <Container>
            <header className="major">
              <h2>Pol&iacute;ticas de Privacidad</h2>

              <ul className="privacy-items">
                <li>
                  <h2>
                    SECCI&Oacute;N 1 - ¿QU&Eacute; HACEMOS CON TU
                    INFORMACI&Oacute;N?
                  </h2>
                  <p>
                    Cuando navegas en nuestro sitio{' '}
                    <a href="https://www.agromotiva.org/">
                      https://www.agromotiva.org/
                    </a>{' '}
                    no recolectamos informacion de ning&uacute;n tipo y no se
                    instalan cookies. Se utiliza localStorage solo para efectos
                    de mantener la sesion de usuario activa. Cuando bajas la
                    aplicaci&oacute;n AGROMOTIVA de la Play Store o Apple Store,
                    como parte del proceso del registro de cuenta, la
                    aplicaci&oacute;n solo pide acceso a tu ubicaci&oacute;n,
                    nombre, correo y numero de tel&eacute;fono. Esta
                    informaci&oacute;n no es obtenida de forma autom&aacute;tica
                    por la aplicaci&oacute;n, sino que es escrita directamente
                    por el usuario.
                  </p>
                </li>
                <li>
                  <h2>SECTION 2 - CONSENTIMIENTO</h2>
                  <h4>¿C&oacute;mo obtienen mi consentimiento?</h4>
                  <p>
                    Cuando nos provees tu informaci&oacute;n personal para
                    completar un registro, implicamos que aceptas la
                    recolecci&oacute;n y uso de esos datos solo para esa
                    raz&oacute;n espec&iacute;fica. Si te pedimos tu
                    informaci&oacute;n personal por una raz&oacute;n secundaria,
                    como marketing, te pediremos directamente tu expreso
                    consentimiento, o te daremos la oportunidad de negarte.
                  </p>
                  <h4>¿C&oacute;mo puedo anular mi consentimiento?</h4>
                  <p>
                    Si luego de haber aceptado cambias de opini&oacute;n, puedes
                    anular tu consentimiento para que te contactemos, por la
                    recolecci&oacute;n, uso o divulgaci&oacute;n de tu
                    informaci&oacute;n, en cualquier momento,
                    contact&aacute;ndonos a{' '}
                    <a href="mailto:myhconsultoressv@gmail.com">
                      myhconsultoressv@gmail.com
                    </a>{' '}
                    o escribi&eacute;ndonos a: Agromotiva Av. Independencia Sur
                    #35, Santa Ana, SA, , El Salvador
                  </p>
                </li>
                <li>
                  <h2>SECCI&Oacute;N 3 - DIVULGACI&Oacute;N</h2>
                  <p>
                    No divulgaremos informaci&oacute;n que hayas compartido con
                    nosotros para efectos de registro o como parte del manejo de
                    tu cuenta.
                  </p>
                </li>
                <li>
                  <h2>SECCI&Oacute;N 4 - AGROMOTIVA</h2>
                  <p>
                    Nuestra aplicaci&oacute;n esta alojada en PLAY STORE y APPLE
                    STORE. Ellos nos proporcionan la plataforma en l&iacute;nea
                    que nos permite que bajes e instales la aplicaci&oacute;n
                    AGROMOTIVA donde puedes ver y ofrecer productos
                    agr&iacute;colas y servicios relacionados al agro. Tus datos
                    se almacenan a trav&eacute;s del almacenamiento de datos y
                    servidores en la nube alojados en HEROKU. Tus datos se
                    almacenan en un servidor seguro detr&aacute;s de un firewall
                    y con conecci&oacute;n encriptada con un certificado SSL, y
                    solo nosotros tenemos acceso a ellos.
                  </p>

                  <h4>Payment:</h4>
                  <p>
                    Todo contacto y tipo de transacci&oacute;n que resultare del
                    uso de AGROMOTIVA estar&aacute; a cargo del ofertante desde
                    la forma de compra que haya establecido en la plataforma,
                    AGROMOTIVA por el momento no proporciona una compra desde la
                    aplicaci&oacute;n. Los requisitos del PCI-DSS ayudan a
                    garantizar el manejo seguro de la informaci&oacute;n que
                    cualquier usuario proporcione.
                  </p>
                </li>
                <li>
                  <h2>SECCI&Oacute;N 5 - SERVICIOS DE TERCEROS</h2>
                  <p>
                    En general, los proveedores de terceras partes utilizados
                    por nosotros NO recopilar&aacute;n, usar&aacute;n y
                    divulgar&aacute;n tu informaci&oacute;n BAJO NINGUNA
                    CIRCUNSTANCIA. En caso de cambiar esto te ser&aacute;
                    notificado. Una vez que abandonas el sitio web de nuestra
                    aplicaci&oacute;n o te rediriges a un sitio o
                    aplicaci&oacute;n de terceros, ya no est&aacute;s siendo
                    regulados por la presente Pol&iacute;tica de Privacidad o
                    los T&eacute;rminos de Servicio de nuestra p&aacute;gina
                    web.
                  </p>
                </li>
                <li>
                  <h2>SECCI&Oacute;N 6 - SEGURIDAD</h2>
                  <p>
                    Para proteger tu informaci&oacute;n personal, tomamos
                    precauciones razonables y seguimos las mejores
                    pr&aacute;cticas de la industria para asegurarnos de que no
                    haya p&eacute;rdida de manera inapropiada, mal uso, acceso,
                    divulgaci&oacute;n, alteraci&oacute;n o destrucci&oacute;n
                    de la misma.
                  </p>
                </li>
                <li>
                  <h2>SECCI&Oacute;N 7 - EDAD DE CONSENTIMIENTO</h2>
                  <p>
                    Al utilizar este sitio, declaras que tienes al menos la
                    mayor&iacute;a de edad en tu estado o provincia de
                    residencia, o que tienes la mayor&iacute;a de edad en tu
                    estado o provincia de residencia y que nos has dado tu
                    consentimiento para permitir que cualquiera de tus
                    dependientes menores use este sitio.
                  </p>
                </li>
                <li>
                  <h2>
                    SECCI&Oacute;N 8 - CAMBIOS A ESTA POL&Iacute;TICA DE
                    PRIVACIDAD
                  </h2>
                  <p>
                    Nos reservamos el derecho de modificar esta pol&iacute;tica
                    de privacidad en cualquier momento, asi que por favor
                    rev&iacute;sala frecuentemente. Cambios y aclaraciones
                    entrar&aacute;n en vigencia inmediatamente despu&eacute;s de
                    su publicaci&oacute;n en el sitio web{' '}
                    <a href="https://www.agromotiva.org/">
                      https://www.agromotiva.org/
                    </a>. Si hacemos cambios materiales a esta pol&iacute;tica,
                    notificaremos aqu&iacute; que ha sido actualizada, por lo
                    que cual est&aacute;s enterado de qu&eacute;
                    informaci&oacute;n recopilamos, c&oacute;mo y bajo
                    qu&eacute; circunstancias, si las hubiere, la utilizamos y/o
                    divulgamos.
                  </p>
                  <p>
                    Si nuestra APLICACION es adquirida o fusionada con otra
                    empresa, tu informaci&oacute;n puede ser transferida a los
                    nuevos propietarios, para que podamos seguir ofreciendo
                    nuestros servicios.
                  </p>
                </li>
                <li>
                  <h2>PREGUNTAS E INFORMACI&Oacute;N DE CONTACTO</h2>
                  <p>
                    Si quieres: acceder, corregir, enmendar o borrar cualquier
                    informaci&oacute;n personal que poseamos sobre ti, registrar
                    una queja, o simplemente quieres m&aacute;s
                    informaci&oacute;n contacta a nuestro Oficial de
                    Cumplimiento de Privacidad{' '}
                    <a href="mailto:myhconsultoressv@gmail.com">
                      myhconsultoressv@gmail.com
                    </a>{' '}
                    con el asunto PREGUNTA o por correo postal a Agromotiva [Av.
                    Independencia Sur #35, Santa Ana, SA, , El Salvador]
                  </p>
                </li>
              </ul>
            </header>
          </Container>
        </section>

        <footer id="footer">
          <p className="copyright">
            {year} &reg; AGROMOTIVA. &mdash;{' '}
            <Link to="/privacy-policy">Politicas de Privacidad</Link>
          </p>
        </footer>
      </div>
    );
  }
}

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
