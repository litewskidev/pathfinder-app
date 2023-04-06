export const select = {
  templateOf: {
    aboutWidget: '#template__about__widget',
    finderWidget: '#template__finder__widget'
  },

  containerOf: {
    pages: '#pages',
    about: '.about__wrapper',
    finder: '.finder__wrapper'
  },

  widgets: {
    description: '.finder__description',
    map: '.finder__map',
    button: '.finder__button'
  },

  nav: {
    links: '.main__nav a'
  },
};

export const classNames = {
  description: {
    activeDsc: 'active'
  },

  button: {
    activeBtn: 'active'
  },

  nav: {
    active: 'active'
  },

  pages: {
    active: 'active'
  }
};

export const settings = {
  db: {
    url: '//' + window.location.hostname + (window.location.hostname=='localhost' ? ':3131' : '')
  }
};

export const templates = {
  aboutWidget: Handlebars.compile(document.querySelector(select.templateOf.aboutWidget).innerHTML),
  finderWidget: Handlebars.compile(document.querySelector(select.templateOf.finderWidget).innerHTML)
};
