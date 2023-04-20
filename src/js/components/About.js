import { templates } from '../settings.js';

class About {
  constructor(element){
    const thisAbout = this;
    
    thisAbout.render(element);
  }

  render(element){
    const thisAbout = this;

    const generatedHTML = templates.aboutWidget();
    thisAbout.dom = {};
    thisAbout.dom.wrapper = element;
    element.innerHTML = generatedHTML;
  }
}

export default About;
