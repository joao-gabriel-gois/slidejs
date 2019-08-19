import { SlideNav } from './slide.js';

//Only for 1st studies
const slide = new SlideNav ('.slide', '.wrapper');
console.log(slide);
slide.init();
slide.addArrow('.prev', '.next');
slide.addArrowEvents();
