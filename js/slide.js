export default class Slide {
   constructor(sld, wrppr) {
      this.slide = document.querySelector(sld); 
      this.wrapper = document.querySelector(wrppr);
   }
   onStart(event) {
      event.preventDefault();
      console.log(event);
   }
   addSlideEvents() {
      this.wrapper.addEventListener('mousedown', this.onStart);
   }
    init() {
      this.addSlideEvents();
      return this; 
    }
}