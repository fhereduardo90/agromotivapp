import React, { Component } from 'react';
import PropTypes from 'prop-types';

const values = (obj)=> {
  return Object.keys(obj).map(key => obj[key]);
};

const IMAGE_FORMATS = {
  PNG: 'png',
  PNG32: 'png32',
  GIF: 'gif',
  JPG: 'jpg',
  JPG_BASELINE: 'jpg-baseline',
};

const MAP_TYPES = {
  ROADMAP: 'roadmap',
  SATELLITE: 'satellite',
  TERRAIN: 'terrain',
  HYBRID: 'hybrid',
};

const IMAGE_FORMATS_VALUES = values(IMAGE_FORMATS);
const MAP_TYPES_VALUES = values(MAP_TYPES);

class GoogleStaticMap extends Component {

  state = {
    loading: true,
    coords: {
      latitude: 14.1249952,
      longitude: -89.4984326
    },
    url: '',
    willUnmount: false
  };

  componentWillMount() {
    const {
      zoom,
      size,
      scale,
      format,
      mapType,
      address,
      } = this.props;

    const { width, height } = size;
    const rootUrl = this.RootUrl;

    const getUrl = ({ addr }) => {
      return `${rootUrl}?center=${addr}&zoom=${zoom}&scale=${scale}&size=${width}x${height}&maptype=${mapType}&format=${format}&${this.apiKeyParam()}`;
    };

    this.setState({
      url: getUrl({ addr: address[0] })
    });
  }

  componentDidMount() {
    this.staticMapUrl();
  }

  componentWillUnmount() {
    this.setState({
      willUnmount: true
    });
  }

  RootUrl = 'http://maps.googleapis.com/maps/api/staticmap';

  ImageFormats = IMAGE_FORMATS

  MapTypes = MAP_TYPES

  static propTypes = {
    address: PropTypes.array.isRequired,
    size: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }),
    style: PropTypes.object,
    zoom: PropTypes.number.isRequired,
    scale: PropTypes.number,
    format: PropTypes.oneOf(IMAGE_FORMATS_VALUES),
    mapType: PropTypes.oneOf(MAP_TYPES_VALUES),
    hasCenterMarker: PropTypes.bool,
  }

  static defaultProps = {
    format: IMAGE_FORMATS.PNG,
    mapType: MAP_TYPES.ROADMAP,
    hasCenterMarker: true,
    scale: 1
  }

  render() {
    const { url } = this.state;
    const { address, style } = this.props;

    return (
      <img
        alt={ `user location: ${ address[0] }` }
        style={ style }
        src={ url }
      />
    );
  }

  staticMapUrl = () => {
    const {
      address,
      zoom,
      size,
      scale,
      format,
      mapType,
    } = this.props;

    const { width, height } = size;
    const rootUrl = this.RootUrl;

    const getUrl = ({ latitude, longitude }) => {
      return `${rootUrl}?center=${latitude},${longitude}&zoom=${zoom}&scale=${scale}&size=${width}x${height}&maptype=${mapType}&format=${format}&markers=color:green|${latitude},${longitude}&${this.apiKeyParam()}`;
    };

    const geocoder = new google.maps.Geocoder(); // eslint-disable-line
    let tries = 0;

    const loadAddress = (addr) => {
      geocoder.geocode( { 'address': addr }, ( results, status ) => {

        if (status === 'OK') {
          const latitude = results[0].geometry.location.lat();
          const longitude = results[0].geometry.location.lng();

          this.setState((state) => {
            if ( state.willUnmount ) {
              return {};
            }

            return {
              loading: false,
              coords: { latitude, longitude },
              url: getUrl({ latitude, longitude })
            };
          });
        } else {

          if ( tries < address.length ) {
            tries++;
            loadAddress(address[tries]);
          }
        }
      } );
    }

    loadAddress(address[0]);
  }

  apiKeyParam = () => {
    const apiKey = 'AIzaSyBcCAMUx2XoTD4elmb09j2EliOq11w9nI0';
    return `key=${apiKey}`;
  }
}


export default GoogleStaticMap;