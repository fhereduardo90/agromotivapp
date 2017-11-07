export const config = {
  name: 'Agromotiva',
  logo: '/'
};

export const mainMenu = [
  {
    icon: 'home',
    label: 'Dashboard',
    href: '/dashboard'
  },
  {
    icon: 'user',
    label: 'Usuarios',
    href: '/user-list'
  },
  {
    icon: 'shopping-cart',
    label: 'Productos',
    href: '/products'
  },
  {
    icon: 'setting',
    label: 'Configuracion',
    href: '/settings'
  }
];

export const transformStatesToOptions = (states, cities) => {
  const mapCities = (data = []) => data.map( city => {
    return {
      value: city.id,
      label: city.name
    };
  } );

  const mapStates = () => states.map( state => {
    const stateCities = cities[state.id].fetched ? mapCities(cities[state.id].data) : [];

    return {
      value: state.id,
      label: state.name,
      children: [
        {
          value: '',
          label: 'No especificar municipio',
        },
        ...stateCities
      ]
    };
  } );

  return mapStates();
};

export const arrayToFormData = (name = 'key', arr = []) => {
  let parsed = {};

  arr.forEach( item => {
    Object.keys(item).forEach( key => {
      parsed[`${ name }[][${ key }]`] = item[key];
    } );
  });

  return parsed;
};

export const mutateState = nextState => state => {
  let stateObj = {};

  Object.keys( nextState ).forEach( key => {
    stateObj[key] = nextState[key];
  } );

  return stateObj;
};

export const normallizeUnits = units => {
  return units.map( item => {
    return {
      ...item,
      unit_id: item.unit ? item.unit.id : 0,
      price: item.price.replace('$', '')
    };
  } );
};