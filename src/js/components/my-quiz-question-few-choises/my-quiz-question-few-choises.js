/**
 * The my-quiz-question-few-choises web component module.
 *
 * @author Vanja Maric <vm222hx@student.lnu.se>
 * @version 1.1.0
 */
// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style> 
.que {
      height: 35px;
      font-size: 20px;
      margin: 10px;
    }
  </style>
  <div id="questions">
  <p class="que" id="question"></p>
  <form class="que" id="answerForm"> 
 </form>
  </div>
`

customElements.define('my-quiz-question-few-choises',
  /**
   * Represents a my-quiz-question-few-choises element.
   */
  class extends HTMLElement {
    /**
     * The question p element.
     *
     * @type {*}
     */
    #questionP
    /**
     * The answer form element.
     *
     * @type {*}
     */
    #answerFormElement

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
      this.#answerFormElement = this.shadowRoot.querySelector('#answerForm')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.#answerFormElement.addEventListener('submit', (event) => this.#onSubmit(event))
    }

    /**
     * Presents the question.
     *
     * @param {string} text Text that represents question.
     */
    presentQuestion (text) {
      this.#questionP.textContent = text
    }

    /**
     * Adds radio buttons.
     *
     * @param {object} alt Alternatives for radio buttons.
     */
    addButtons (alt) {
      for (const property in alt) {
        const radio = document.createElement('input')
        radio.setAttribute('type', 'radio')
        radio.setAttribute('name', 'answers')
        radio.setAttribute('value', alt[property])
        radio.setAttribute('id', property)
        this.#answerFormElement.appendChild(radio)
        const lab = document.createElement('label')
        lab.setAttribute('for', property)
        const textForRadioB = document.createTextNode(alt[property])
        lab.appendChild(textForRadioB)
        this.#answerFormElement.appendChild(lab)
        const newLine = document.createElement('br')
        this.#answerFormElement.appendChild(newLine)
      }
      const inp = document.createElement('input')
      inp.setAttribute('type', 'submit')
      inp.setAttribute('value', 'Answer')
      inp.setAttribute('class', 'que')
      this.#answerFormElement.appendChild(inp)
    }

    /**
     * Gets checked radio button.
     *
     * @returns {*} Selected radio button value.
     */
    #getSelectedValue () {
      const checkedButton = this.#answerFormElement.querySelector('input[type=radio]:checked')
      return checkedButton.getAttribute('id')
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
        detail: this.#getSelectedValue(),
        bubbles: true
      }))
    }
  }
)
