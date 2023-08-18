/**
 * The my-quiz-question1 web component module.
 *
 * @author Vanja Maric <vm222hx@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style> 
.input {
      height: 35px;
      font-size: 20px;
      margin: 10px;
    }
    </style>
  <div id="questions">
  <p id="question"></p>
  <form id="formEl"><input class="input" type="text" id="answerInput" placeholder="Write your answer here"/> <br>
  <input class="input" type="submit" value="Answer" /></form>
  </div>
`

customElements.define('my-quiz-question1',
  /**
   * Represents a my-quiz-question1 element.
   */
  class extends HTMLElement {
    /**
     * The question p element.
     *
     * @type {*}
     */
    #questionP
    /**
     * The answer p element.
     *
     * @type {*}
     */
    #answerInputElement
    /**
     * The form element.
     *
     */
    #formElement
    /**
     * The question text.
     *
     */
    #text

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#questionP = this.shadowRoot.querySelector('#question')
      this.#formElement = this.shadowRoot.querySelector('#formEl')
      this.#answerInputElement = this.shadowRoot.querySelector('#answerInput')
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['text']
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.focus()
      this.#presentQestion()
      this.#formElement.addEventListener('submit', (event) => this.#onSubmit(event))
    }

    /**
     * Focus input element.
     */
    focus () {
      this.#answerInputElement.focus()
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'text' && oldValue !== newValue) {
        this.#text = newValue
      }
    }

    /**
     * Presents the question.
     */
    #presentQestion () {
      this.#questionP.textContent = this.#text
    }

    /**
     * Handles submit event - saves the nickname.
     *
     * @param {SubmitEvent} event - The submit event.
     */
    #onSubmit (event) {
      // Do not submit the form!
      event.preventDefault()

      // Skapa händelse som utlöser händelsen answer
      this.dispatchEvent(new window.CustomEvent('answered', {
        detail: this.#answerInputElement.value,
        bubbles: true
      }))
    }
  }
)
