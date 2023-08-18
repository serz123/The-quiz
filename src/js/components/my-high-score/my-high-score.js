/**
 * The my-high-score web component module.
 *
 * @author Vanja Maric <vm222hx@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style> 
.hs {
      font-size: 20px;
      margin: 10px;
    }
    #restBut {
      height: 35px
    }
    #go {
      font-size: 30px;
    }
  </style>
<div id="container">
<p id="go"> GAME OVER </p>
  <ol class="hs" id="OlList">
  </ol>
  <button class="hs" type="button" id="restBut">Restart</button>
</div>
`

customElements.define('my-high-score',
  /**
   * Represents a my-high-score element.
   */
  class extends HTMLElement {
    /**
     * The list element.
     *
     * @type {*}
     */
    #listElement

    /**
     * The div element.
     *
     * @type {*}
     */
    #container

    /**
     * The nickname.
     */
    #nick
    /**
     * The scores from the current game.
     */
    #result

    #resultsJSON = [] // array za rezultate
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#listElement = this.shadowRoot.querySelector('#OlList')
      this.#container = this.shadowRoot.querySelector('#container')
      this.#container.addEventListener('click', (event) => this.#onClick(event))
    // window.localStorage.removeItem('quiz_higscore')
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['nick', 'result', 'completed']
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.#setHighScoreResults()
      this.#getHighScoreResults()
    }

    /**
     * Dispatch event whent the restart button is clicked.
     */
    #onClick () {
      this.dispatchEvent(new window.CustomEvent('restart', {
        bubbles: true
      }))
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'nick' && oldValue !== newValue) {
        this.#nick = newValue
      }
      if (name === 'result' && oldValue !== newValue) {
        this.#result = newValue
      }
      if (name === 'completed' && oldValue !== newValue) {
        this.#result = newValue
      }
    }

    /**
     * Setting high score results.
     */
    #setHighScoreResults () {
      if (this.hasAttribute('completed')) {
        const a = this.#getHighScores()
        if (a) { // If it is not the first result
          a.forEach(element => {
            this.#resultsJSON.push(element)
          })
        }
        // window.localStorage.removeItem('quiz_higscore')
        const userResults = {
          username: this.#nick,
          score: this.#result
        }
        this.#resultsJSON.push(userResults)
        window.localStorage.setItem('quiz_higscore', JSON.stringify(this.#resultsJSON))
      }
    }

    /**
     * Getting high score results.
     *
     * @returns {Array} Sorted results.
     */
    #getHighScoreResults () {
      let results = this.#getHighScores()
      if (results === null) {
        results = []
      } else {
        if (results.length > 1) {
          results.sort((a, b) => b.score - a.score).reverse()
        } if (results.length <= 5) {
          for (let i = 0; i <= results.length - 1; i++) {
            const liste = document.createElement('li')
            liste.innerText = 'Username: ' + results[i].username + '\nScore: ' + results[i].score
            this.#listElement.appendChild(liste)
          }
        }
        if (results.length > 5) {
          for (let i = 0; i <= 4; i++) {
            const liste = document.createElement('li')
            liste.innerText = 'Username: ' + results[i].username + '\nScore: ' + results[i].score
            this.#listElement.appendChild(liste)
          }
        }
      }
      return results
    }

    /**
     * Getting high score results.
     *
     * @returns {Array} previous high score results.
     */
    #getHighScores () {
      return JSON.parse((localStorage.getItem('quiz_higscore')))
    }
  }
)
