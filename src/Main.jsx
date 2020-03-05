import React from 'react';
import './App.css';
import data from './data/data';
import Answers from './components/Answers';
import Popup from './components/Popup';

class Main extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          nr: 1,
          total: data.length,
          showButton: false,
          questionAnswered: false,
          isTurnNewPage: false,
          displayPopup: 'flex',
          uuid: this._uuid()
      }
      this.nextQuestion = this.nextQuestion.bind(this);
      this.handleShowButton = this.handleShowButton.bind(this);
      this.handleStartQuiz = this.handleStartQuiz.bind(this);
      this.saveAnswer = this.saveAnswer.bind(this);
      this.saveToAnswerList = this.saveToAnswerList.bind(this);
      this.getAnswerList = this.getAnswerList.bind(this);
      this.toggleIsNextPage = this.toggleIsNextPage.bind(this);
      this.endQuiz = this.endQuiz.bind(this);
      this.currentAnswer = -1;
      this.answerlist = [];
  }

  pushData(nr) {
      let choiceCount = data[nr-1].answers.length;
      let answerlist = [];
      for (var i=0; i< choiceCount; i++) {
          answerlist.push(data[nr-1].answers[i]);
      }
      this.setState({
          question: data[nr-1].question,
          answers: answerlist
      });
  }

  componentWillMount() {
      let { nr } = this.state;
      this.pushData(nr);
  }

  async nextQuestion() {
      this.saveToAnswerList();
      let { nr, total } = this.state;
      if (nr == total) {
        this.setState({
            displayPopup: 'flex'
        });
      } else {
        let ca  = this.currentAnswer[nr.toString()];
        const response = await fetch(`/api/${nr}/${ca}`);
        const json = await response.json();    
        this.pushData(json.data);    
        this.setState({
            showButton: false,
            questionAnswered: false,
            nr: json.data
        });
        this.toggleIsNextPage();
      }     
  }

  saveAnswer(answer) {
      let { nr } = this.state;
      let data = {};
      data[nr] = answer;
      this.currentAnswer = data;
  }

  saveToAnswerList() {
    this.answerlist.push(this.currentAnswer);
  }

  handleShowButton() {
      this.setState({
          showButton: true,
          questionAnswered: true,
      })
  }

  handleStartQuiz() {
      this.setState({
          displayPopup: 'none',
          nr: 1
      });
  }

  endQuiz() {
      this.setState({
          displayPopup: 'none'
      });
  }

  toggleIsNextPage() {
      this.setState({
          isTurnNewPage : !this.state.isTurnNewPage
      })
  }

  getAnswerList() {
    return this.answerlist;
  }

  _uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
  

  render() {
      let { nr, total, question, answers, correct, showButton, questionAnswered, displayPopup, score, uuid, isTurnNewPage} = this.state;

      return (
          <div className="container">

              <Popup style={{display: displayPopup}} score={score} total={total} startQuiz={this.handleStartQuiz} getAnswerList={this.getAnswerList} endQuiz={this.endQuiz} uuid={uuid}/>

              <div className="row">
                  <div className="col-lg-10 col-lg-offset-1">
                      <div id="question">
                          <h4>Question {nr}/{total}</h4>
                          <p>{question}</p>
                      </div>
                      <Answers answers={answers} correct={correct} showButton={this.handleShowButton} isAnswered={questionAnswered} saveAnswer={this.saveAnswer} isTurnNewPage={isTurnNewPage} toggleIsNextPage={this.toggleIsNextPage}/>
                      <div id="submit">
                          {showButton ? <button className="fancy-btn" onClick={this.nextQuestion} >{nr===total ? 'Finish quiz' : 'Next question'}</button> : null}
                      </div>
                  </div>
              </div>
          </div>
      );
  }
};


export default Main;
