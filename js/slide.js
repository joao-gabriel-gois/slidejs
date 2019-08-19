import debounce from './debounce.js';

export class Slide {
  constructor(sld, wpr) {
    this.slide = document.querySelector(sld);
    this.wrapper = document.querySelector(wpr);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };// movement parameters
    this.changeEvent = new Event('changeEvent');
  }
  transition(active) {
    this.slide.style.transition = active ? 'all 0.3s' : '';
  }
  moveSlide(distX) {
    this.dist.movePosition = distX;//prop created while used
    this.slide.style.transform = `translate3d(${distX}px,0px,0px)`;
  }
  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.45;
    return this.dist.finalPosition - this.dist.movement;
  }
  //Callbacks
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
    this.transition(false);
  }
  onMove() {
    const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }
  onEnd() {
    const movetype = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
    this.wrapper.removeEventListener(movetype, this.onMove);
    this.transition(true);
    this.changeSlideOnEnd();
  }
  onResize() {//need debounce to stop adding many events  
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 333);
  }
  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }
  //Adding events
  addSlideEvents() {
    window.addEventListener('resize', this.onResize);
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }
  // Slide Configs + Navigation Functions
  slidePosition(slide) { // Fix original offset position to put the current slide at window's center
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return margin - slide.offsetLeft;
  }
  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { element, position };
    });
  }
  slideIndexNav(index) {
    this.index = {
      prev: index ? index - 1 : undefined, // 0 returns false
      active: index,
      next: index === this.slideArray.length - 1 ? undefined : index + 1, // Works for any array size for next pag.
    };
  }
  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slideIndexNav(index);
    this.dist.finalPosition = activeSlide.position;// updates the position after changing
    this.toggleActiveClass();
    this.wrapper.dispatchEvent(this.changeEvent);
  }
  activePrevSlide() {
    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
      /*if (this.controlElement) { my solution before know bout Y for subclass SlideNav
        [...this.controlElement].forEach(child => {
          child.classList.remove('active');
        });
        [...this.controlElement][this.index.active].classList.add('active');
      }*/
    }
  }
  activeNextSlide() {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next)
      /*if (this.controlElement) { my solution before know about X for sublcass SlideNav
        [...this.controlElement].forEach(child => {
          child.classList.remove('active');
        });
        [...this.controlElement][this.index.active].classList.add('active');
      }*/
    }
  }
  toggleActiveClass() {
    this.slideArray.forEach(listItem => listItem.element.classList.remove('active'));
    this.slideArray[this.index.active].element.classList.add('active');
  }
  bindingEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 12);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
  }
  init() {
    this.bindingEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();
    this.slideIndexNav(0);
    return this;
  }
}

export class SlideNav extends Slide {
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
  }
  addArrowEvents(ev) {
    this.prevElement.addEventListener(ev = 'click', this.activePrevSlide);
    this.nextElement.addEventListener(ev = 'click', this.activeNextSlide); 
  }
  createControl() {
    const control = document.createElement('ul');
    control.dataset.control = 'slide';
    this.slideArray.forEach((item, index) => {
      control.innerHTML += `<li><a href="#slide${index + 1}">${index + 1}</a></li>`;
    });
    this.wrapper.appendChild(control);
    return control;
  }
  addControlEvent(item, index) {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      this.changeSlide(index);
    });
    this.wrapper.addEventListener('changeEvent', this.activeControlItem);
  }
  activeControlItem() {
    this.controlArray.forEach(child => child.classList.remove('active'));
    this.controlArray[this.index.active].classList.add('active');
  }
  addControl() {
    const control = this.createControl();
    this.controlArray = [...control.children];
    this.activeControlItem();
    this.controlArray.forEach(this.addControlEvent);
  }
  bindingCtrlEvents() {
    this.addControlEvent = this.addControlEvent.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
  }
  initSlideNav(prev, next, ev) {
    this.init();
    this.addArrow(prev, next);
    this.addArrowEvents();
    this.bindingCtrlEvents();
    this.addControl();
  }
}
/*
_This class flow is:

this.init() -> [it will bind events, then add all slide events. After this, it will cnfg slides and return the obj]
   bindingEvents -> [bind all functions used as callback for events]
   addSlideEvents -> [add all events despite 'mousemove']
   slidesConfig -> [creates an array which each value is a obj within the respective slide element and its position\
      slidePosition -> [Make the calculation to set image in the center]

_After this, events will wait for either a touchstart or a mousedown, and they occur, callbacks are activated, so:

'mousedown' / 'touchstart' events occurs
      onStart (1) -> [checks movetype(either touch/mousemove)* & applies the correct calc. to get startX for tha case, that is,_
                     _the first horizontal pos. of the event. At the end, it adds a listener for move for the right movetype*]
            'mousemove/'touchmove'events occurs
                     onMove (1.a) -> [check movetype* to apply the right clientX value to a pointer const, after this,_
                                     _uses updatePosition(1.a.i). After this, pass this updated value to moveSlide(1.a.i.I)]
                           updatePosition (1.a.i)->[get the current half of the differece between movedmouse/touch position_
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
changeSlides() ->
*/
