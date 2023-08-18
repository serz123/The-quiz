/**
 * The my-countdown-timer web component module.
 *
 * @author // Vanja Maric <vm222hx@student.lnu.se>
 * @version 1.1.0
 */
const TIMER_IMG_URL = (new URL('./images/computer.png', import.meta.url)).href
// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
 #timer {
  padding-top: 23px;
 
  text-align: center;
      width: 63px;
      height: 47px;
      background-image: url(${TIMER_IMG_URL});
      background-repeat: no-repeat;
      background-position: center;
 }
</style>
  <div id="timer">
  </div>
`

customElements.define('my-countdown-timer',
  /**
   * Represents a my-countdown-timer element.
   */
  class extends HTMLElement {
    /**
     * The timer element.
     *
     * @type {HTMLDivElement}
     */
    #timerElement
    /**
     * Seconds passed until timer is stopped.
     */
    #spentSeconds = 0

    #timerStart
    #time

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#timerElement = this.shadowRoot.querySelector('#timer')
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['time']
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'time' && oldValue !== newValue) {
        this.#time = Number.parseInt(newValue)
      }
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () { // ???????????????????????????
      this.stopTimer()
    }

    /**
     * Count down the time.
     *
     * @param {number} seconds - Seconds to count down.
     */
    #timeCountdown (seconds) {
      this.#timerStart = setInterval(() => {
        this.#timeForm(seconds)
        seconds -= 1
        this.#spentSeconds += 1
        if (seconds === 0) {
          this.dispatchEvent(new window.CustomEvent('outOfTime', {
            bubbles: true
          }))
        }
      }, 1000)
    }

    /**
     * Make form for time.
     *
     * @param {number} time - Time to count down.
     */
    #timeForm (time) {
      const min = Math.floor(time / 60)
      let sec = time % 60
      if (sec < 10) {
        sec = `0${sec}`
      }
      this.#timerElement.innerText = `${min}:${sec}`
    }

    /**
     * Starts the timer.
     */
    startTimer () {
      if (!this.hasAttribute('time')) {
        this.setAttribute('time', 20)
      }
      this.#timeCountdown(this.#time)
    }

    /**
     * Stops the timer.
     */
    stopTimer () {
      this.dispatchEvent(new window.CustomEvent('timerstopped', {
        detail: this.#spentSeconds,
        bubbles: true
      }))
      window.clearInterval(this.#timerStart)
    }
  }
)
