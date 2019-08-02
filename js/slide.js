export default class Slide {
   constructor(sld, wrppr) {
      this.slide = document.querySelector(sld); 
      this.wrapper = document.querySelector(wrppr);
   }
   onStart(event) {
      event.preventDefault();
   }
   addSlideEvents() {
      this.wrapper.addEventListener('mouseon', this.onStart);
      console.log(event);
   }
    init() {
      this.addSlideEvents();
      return this; 
    }
}