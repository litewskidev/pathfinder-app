import About from './components/About.js';
import Finder from './components/Finder.js';
import { classNames, select } from './settings.js';

const app = {

  initPages: function(){
    this.pages = document.querySelector(select.containerOf.pages).children;
    this.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#', '');
    let pageMatchingHash = this.pages[0].id;

    for (let page of this.pages){
      if (page.id === idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    this.activatePage(pageMatchingHash);
    
    for (let link of this.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();
        const id = clickedElement.getAttribute('href').replace('#', '');

        this.activatePage(id);
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId){
    for (let page of this.pages){
      page.classList.toggle(
        classNames.pages.active,
        page.id === pageId
      );
    }

    for (let link of this.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initAbout: function(){
    const aboutContainer = document.querySelector(select.containerOf.about);
    this.about = new About(aboutContainer);
  },

  initFinder: function(){
    const finderContainer = document.querySelector(select.containerOf.finder);
    this.finder = new Finder(finderContainer);
  },

  init: function(){
    this.initPages();
    this.initAbout();
    this.initFinder();
  }
};

app.init();
