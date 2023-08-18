/**
 * The my-quiz-app web component module.
 *
 * @author Vanja Maric <vm222hx@student.lnu.se>
 * @version 1.1.0
 */
import '../my-countdown-timer'
import '../my-nickname'
import '../my-quiz-question1'
import '../my-quiz-question-few-choises'
import '../my-high-score'
// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .hidden {
      display: none;
    }
    #board {
      text-align: center;
      font-size: 20px;
      color: black;
      background-color: antiquewhite;
      padding: 1em;
      margin-top: 1em;
      margin-left: 6em;
      margin-right: 6em;
      height: 80%;
      border-radius: 25px;
      
    }
  </style>
  <div id="board">
  <my-nickname id="nick"></my-nickname>
  </div>
`

customElements.define('my-quiz-application',
  /**
   * Represents a my-quiz-application element.
   */
  class extends HTMLElement {
    /**
     * The board element.
     *
     * @type {HTMLDivElement}
     */
    #board

    /**
     * Represents next URL got from question.
     */
    #nextURL

    /**
     * Represents next URL got from answer.
     */
    #nextURLFromAnswer

    /**
     * Question.
     */
    #getque1

    /**
     * Timer.
     */
    #timer

    /**
     * Saves nckname.
     */
    #nickToSave

    /**
     * High score list.
     */
    #HSList

    /**
     * Status code.
     */
    #statusCode

    /**
     * Time that the player spent in game.
     */
    #timeInGame = 0

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#board = this.shadowRoot.querySelector('#board')
      this.#board.addEventListener('submited', (event) => {
        if (event.detail.length < 4) {
          if (this.#board.childElementCount === 1) {
            const valid = document.createElement('p')
            valid.setAttribute('id', 'validator')
            valid.textContent = 'Your nickname must have at least 4 characters!'
            this.#board.appendChild(valid)
          }
        } else {
          this.#nickToSave = event.detail
          this.#nickToQuest()
        }
      })
      this.#board.addEventListener('outOfTime', (event) => {
        this.#presentHighScores()
      })

      this.#board.addEventListener('timerstopped', (event) => {
        this.#timeInGame += Number.parseInt(event.detail)
      })
      this.#board.addEventListener('answered', (event) => {
        const data = {
          answer: event.detail
        }
        this.#postAnswer(this.#nextURL, data)
      })
      this.#board.addEventListener('restart', (event) => {
        this.#restartGame()
      })
    }

    /**
     * Presents high scores list.
     */
    #setHighScores () {
      this.#board.removeChild(this.#getque1)
      this.#timer.stopTimer()
      this.#board.removeChild(this.#timer)
      this.#HSList = document.createElement('my-high-score')
      this.#HSList.setAttribute('completed', true)
      this.#HSList.setAttribute('nick', this.#nickToSave)
      this.#HSList.setAttribute('result', this.#timeInGame)
      this.#board.appendChild(this.#HSList)
    }

    /**
     * Presents high scores list.
     */
    #presentHighScores () {
      this.#board.removeChild(this.#getque1)
      this.#timer.stopTimer()
      this.#board.removeChild(this.#timer)
      this.#HSList = document.createElement('my-high-score')
      this.#board.appendChild(this.#HSList)
    }

    /**
     * Changes from nickname to first question.
     */
    async #nickToQuest () {
      const nick = this.#board.firstElementChild
      nick.setAttribute('class', 'hidden')
      while (this.#board.childElementCount > 1) {
        this.#board.removeChild(this.#board.lastChild)
      }
      const getque = await this.#get('https://courselab.lnu.se/quiz/question/1')
      this.#timer = document.createElement('my-countdown-timer')
      if (getque.limit) {
        this.#timer.setAttribute('time', getque.limit)
      }
      this.#timer.startTimer()
      this.#board.appendChild(this.#timer)
      if (getque.alternatives) {
        this.#getque1 = document.createElement('my-quiz-question-few-choises')
        this.#getque1.presentQuestion(getque.question)
        this.#getque1.addButtons(getque.alternatives)
        this.#board.appendChild(this.#getque1)
      } else {
        this.#getque1 = document.createElement('my-quiz-question1')
        this.#getque1.setAttribute('text', getque.question)
        this.#board.appendChild(this.#getque1)
        this.#nextURL = getque.nextURL
      }
    }

    /**
     * Gets data from server.
     *
     * @param {string} url Url.
     */
    async #get (url) {
      try {
        const res = await window.fetch(url)
        if (!res.ok) {
          const error = new Error('Fetch error')
          error.status = res.status
          throw error
        }
        return res.json()
      } catch (err) {
        const error = document.createElement('p')
        error.textContent = err
        this.#board.appendChild(error)
        const error2 = document.createElement('p')
        error.textContent = 'Something went wrong.\nReload your page and check your internet connection.'
        this.#board.appendChild(error2)
        console.log(err)
        this.#board.removeChild(this.#timer)
      }
    }

    /**
     * Sends answer to the server.
     *
     * @param {string} url Url that we got from previous question.
     * @param {string} answer Users answer.
     */
    async #postAnswer (url, answer) {
      try {
        const response = await window.fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(answer)
        })
        if (response.ok) {
          const data = await response.json()
          this.#nextURLFromAnswer = data.nextURL
          this.#statusCode = response.status
          this.#onAnswer()
        } else {
          this.#presentHighScores()
        }
      } catch (err) {
        const error = document.createElement('p')
        error.textContent = err
        this.#board.appendChild(error)
        console.log(err)
        const error2 = document.createElement('p')
        error.textContent = 'Something went wrong. Reload your page and check your internet connection.'
        this.#board.appendChild(error2)
      }
    }

    /**
     * This to do when user cilick to "Answer".
     */
    async #onAnswer () {
      if (this.#nextURLFromAnswer !== undefined) {
        const resp = await this.#get(this.#nextURLFromAnswer)
        this.#board.removeChild(this.#getque1)
        this.#timer.stopTimer()
        this.#board.removeChild(this.#timer)
        this.#timer = document.createElement('my-countdown-timer')
        if (resp.limit) {
          this.#timer.setAttribute('time', resp.limit)
        }
        this.#timer.startTimer()
        this.#board.appendChild(this.#timer)
        this.#nextURL = resp.nextURL
        if (resp.alternatives) {
          this.#getque1 = document.createElement('my-quiz-question-few-choises')
          this.#getque1.presentQuestion(resp.question)
          this.#getque1.addButtons(resp.alternatives)
          this.#board.appendChild(this.#getque1)
        } else {
          this.#getque1 = document.createElement('my-quiz-question1')
          this.#getque1.setAttribute('text', resp.question)
          this.#board.appendChild(this.#getque1)
          this.#nextURL = resp.nextURL
        }
      } else {
        this.#setHighScores()
      }
    }

    /**
     * The game restarts.
     */
    #restartGame () {
      this.#board.removeChild(this.#HSList)
      const nick = this.#board.firstElementChild
      nick.removeAttribute('class')
      this.#timeInGame = 0
    }
  }
)
