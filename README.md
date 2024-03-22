# The quiz

All questions are served to my quiz using [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) way, and your application sends the user's answers back to the server for validation.

The quiz is a single-page client application in which the user can answer quiz questions by the server given. The user must do this within a specific time frame. If the user provides the correct answer, the application should present the next question to the user. If the user provides the wrong answer or does not answer in time, the quiz is over, and a high score list is presented to the user.

At the start of the game, the user should write a nickname they want in the quiz game. The game must have a timer that gives the user a maximum of 20 seconds to answer each question. If the user doesn't answer during the time or provides a false answer, the game is over, and the user can start over.

If the user answers all the questions correctly, the game saves that user:s total time and presents it in a high-score list showing the five quickest tries. The high score is saved in the browser's Web Storage.
