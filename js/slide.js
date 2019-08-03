export default class Slide {
   constructor(sld, wpr) {
      this.slide = document.querySelector(sld); 
      this.wrapper = document.querySelector(wpr);
      this.dist = { finalPosition: 0, startX: 0, movement: 0 };//movement parameters
   }
   moveSlide(distX) {
      this.dist.movePosition = distX;
      this.slide.style.transform = `translate3d(${distX}px,0px,0px)`;
   }
   updatePosition(clientX) {s
      this.dist.movement = (this.dist.startX - clientX) * 1.45;
      return this.dist.finalPosition - this.dist.movement;
   }
   onStart(event) {
      let movetype;
      if (event.type === 'mousedown') {
         event.preventDefault();
         this.dist.startX = event.clientX;
         movetype = 'mousemove';
      } else {
         this.dist.startX = event.changedTouches[0].clientX;
         movetype = 'touchmove';
      }
      this.wrapper.addEventListener(movetype, this.onMove);
   }
   onMove() {
      const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
      const finalPosition = this.updatePosition(pointerPosition);
      this.moveSlide(finalPosition);
   }
   onEnd() {
      const movetype = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
      this.wrapper.removeEventListener(movetype, this.onMove);
      this.dist.finalPosition = this.dist.movePosition;
   }
   bindingEvents() {
      this.onStart = this.onStart.bind(this);
      this.onMove = this.onMove.bind(this);
      this.onEnd = this.onEnd.bind(this);
   }
   addSlideEvents() {
      this.wrapper.addEventListener('mousedown', this.onStart);
      this.wrapper.addEventListener('touchstart', this.onStart);
      this.wrapper.addEventListener('mouseup', this.onEnd);
      this.wrapper.addEventListener('touchend', this.onEnd);
   }

   //Slide Configs
   slidePosition(slide) {//Fix the offset original position to put the current slide at the center of window
      const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
      console.log(margin);
      return margin - slide.offsetLeft;
   }
   slidesConfig() {
      this.slideArray = [...this.slide.children].map((element) => {
         const position = this.slidePosition(element);
         return { element, position };
      });
      console.log(this.slideArray);
   }
   changeSlide(index) {
      this.moveSlide(this.slideArray[index].position);
   }
   init() {
      this.bindingEvents()
      this.addSlideEvents();
      this.slidesConfig();
      return this; 
    }
}
/*

_This class flow is:

this.init() -> [it will bind events, then add all slide events. After this, it will cnfg slides and return the obj]
   bindingEvents -> [bind all functions used as callback for events]
   addSlideEvents -> [add all events despite 'mousemove']
   slidesConfig -> [creates an array which each value is a obj within the respective slide element and its position\
      slidePosition -> [Make the calculation to set image in the center]

_After this, events will wait for either a touchstar or a mousedown, and they occur, callbacks are activated, so:

'mousedown' / 'touchstart' events occurs
      onStart (1) -> [checks movetype(either touch/mousemove)* & applies the correct calc. to get startX for tha case, that is,_
                     _the first horizontal pos. of the event. At the end, it adds a listener for move for the right movetype*]
            'mousemove/'touchmove'events occurs
                     onMove (1.a) -> [check movetype* to apply the right clientX value to a pointer const, after this,_
                                     _uses updatePosition(1.a.i). After this, pass this updated value to moveSlide(1.a.i.I)]
                           updatePosition (1.a.i)->[get the current the half of the differece between movedmouse/touch position_
                                             _and the first click startX saved as this.startX prop by onStart method. With this va-
                                             _lue stored in const finalPosition, it calls moveSlide function passing it as argv]
                                 moveSlide (1.a.i.I) -> applies a dynamic value for X at translate3d css method based on value_
                                                      _used as argument. In this case is the difference stored at updated in_
                                                      _finalPosition's value]
'mouseup' / 'touchend' events occurs
      onEnd (1) -> [create a const that checks the right event type to storage the current value_
                        _use the right value tho, to set up a removeEventListener for onMove callback function_
                        _storages in the finalPosition prop. the last movePostion used and saved by moveSlide _
                        _in the movePostion prop. to return to next updatePosition used in a next onStart callback's_
                        _event the current position that user has stopped. Basically, it resets for the next use cycle]

_The only function that are not used yet in the flow is__
changeSlides() 
*/
