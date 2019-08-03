export default class Slide {
   constructor(sld, wrppr) {
      this.slide = document.querySelector(sld); 
      this.wrapper = document.querySelector(wrppr);
      this.dist = { finalPosition: 0, startX: 0, movement: 0 };
   }
   moveSlide(distX) {
      this.dist.movePosition = distX;
      this.slide.style.transform = `translate3d(${distX}px,0px,0px)`;
   }
   updatePosition(clientX) {
      this.dist.movement = (this.dist.startX - clientX) * 1.45;
      return this.dist.finalPosition - this.dist.movement;
   }
   onStart(event) {
      event.preventDefault();
      this.dist.startX = event.clientX;
      this.wrapper.addEventListener('mousemove', this.onMove);
   }
   onMove() {
      const finalPosition = this.updatePosition(event.clientX);
      this.moveSlide(finalPosition);
   }
   onEnd() {
      this.wrapper.removeEventListener('mousemove', this.onMove);
      this.dist.finalPosition = this.dist.movePosition;
   }
   bindingEvents() {
      this.onStart = this.onStart.bind(this);
      this.onMove = this.onMove.bind(this);
      this.onEnd = this.onEnd.bind(this);
   }
   addSlideEvents() {
      this.wrapper.addEventListener('mousedown', this.onStart);
      this.wrapper.addEventListener('mouseup', this.onEnd);
   }
    init() {
      this.bindingEvents()
      this.addSlideEvents();
      return this; 
    }
}