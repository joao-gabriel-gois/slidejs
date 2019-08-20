import { SlideNav } from './slide.js';

//Only for 1st studies
const slide = new SlideNav ('.slide', '.wrapper');
slide.initSlideNav('.prev', '.next', '.custom-control');
