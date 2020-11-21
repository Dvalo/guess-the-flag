import React from 'react';
import axios from 'axios';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countriesArr: [],
            tempAnswers: [],
            countryFlag: '',
            correctAnswer: '',
            playerGuess: '',
            currentStreak: 0
        }
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        axios
          .get("https://restcountries.eu/rest/v2/all")
          .then((response) => {
            this.setState({ countriesArr: response.data });
            this.getGameCountries();
          })
          .catch((error) => console.log(error));
    }

    getGameCountries() {
        const { countriesArr, tempAnswers } = this.state;

        while (tempAnswers.length < 4) {
            let randomCountry = countriesArr[Math.floor(Math.random() * countriesArr.length)];
            if(!tempAnswers.includes(randomCountry)) {
                tempAnswers.push(randomCountry);
            }
        }
        let randCorrectAnswer = tempAnswers[Math.floor(Math.random() * tempAnswers.length)]
        this.setState({ countryFlag: randCorrectAnswer.alpha2Code, correctAnswer: randCorrectAnswer.name });
    }

    newRound() {
        this.setState({
            tempAnswers: [],
            countryFlag: '',
            correctAnswer: '',
            playerGuess: ''
        }, function() {
            this.getGameCountries();
        });
    }

    handleAnswer(answer) {
        const answerDiv = document.getElementById("answer-field");
        answerDiv.className = "game-title";
        if (answer) {
            answerDiv.innerHTML = "Correct";
            answerDiv.classList.add("correct");
            this.setState({ currentStreak: this.state.currentStreak + 1});
        } else {
            answerDiv.innerHTML = "Incorrect";
            answerDiv.classList.add("incorrect");
            this.setState({ currentStreak: 0});
        }
    }

    handleClick(e) {
        let playerSelection = e.target.dataset.value;
        if (playerSelection === this.state.correctAnswer) {
            this.handleAnswer(true);
        } else {
            this.handleAnswer(false);
        }
        this.newRound();
    }

    render() {
        const { tempAnswers, countryFlag, currentStreak } = this.state;
        return (
          <div className="game-wrapper">
            <div className="game-details game-inner">
                <div className="game-title" id="answer-field">Flag Quiz</div>
                <div className="game-streak">Current Streak: {currentStreak}</div>
            </div>  
          
            <div className="game-quiz game-inner">
                {/* {this.state.countryFlag ? <img src={this.state.countryFlag} className="country-flag" alt="country_flag" /> : 'not'} */}
                {countryFlag ? <img src={`https://flagcdn.com/256x192/${countryFlag.toLowerCase()}.png`} className="country-flag" alt="country_flag" /> : 'not'}
                <div className="country-choices">
                    { tempAnswers.map(function(country, i){
                        return (
                            <div className="choice" data-value={country.name} onClick={this.handleClick} key={country.name}>
                                {country.name}
                            </div>
                        )
                    },this) }
                </div>
            </div>
          </div>
        );
      }
}

export default Game;