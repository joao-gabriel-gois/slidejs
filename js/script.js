import { SlideNav } from './slide.js';
//Repo usada apenas para estudos: -u stdnt-cl -p [psswd]Git
const slide = new SlideNav ('.slide', '.wrapper');
console.log(slide);
slide.init();
slide.addArrow('.prev', '.next');
slide.addArrowEvents();
//Testing each slide display with 
/*
for (let i = 0; i < 6; i++) {
   setTimeout(() => {
      slide.changeSlide(i);
   }, 933 * i);
}
*/