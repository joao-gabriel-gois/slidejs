import Slide from './slide.js';
//Repo usada apenas para estudos: -u stdnt-cl -p [psswd]Git
const slide = new Slide ('.slide', '.wrapper');
console.log(slide);
slide.init();
/* Testing each slide display with a loop
for (let i = 0; i < 6; i++) {
   setTimeout(() => {
      slide.changeSlide(i);
   }, 1833 * i);
}
*/