import React from 'react';    

class Answers extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isAnswered: false,
            isNewPage: true,
            classNames: this.getCurrentClassList()
        }
        
        this.checkAnswer = this.checkAnswer.bind(this);
    }

    getCurrentClassList() {
        let currentChoiceCount = this.props.answers.length;
        let classNameList = []
        for (var i=0; i< currentChoiceCount; i++) {
            classNameList.push('');
        }
        return classNameList;
    }
    
    checkAnswer(e) {
        let { isAnswered, toggleIsNextPage } = this.props;
        if(!isAnswered) {
            let elem = e.currentTarget;
            let {saveAnswer} = this.props;
            let answer = Number(elem.dataset.id);
            let updatedClassNames = this.state.classNames;
            updatedClassNames[answer] = 'right';
            
            this.setState({
                classNames: updatedClassNames,
                isNewPage: false
            });
            saveAnswer(answer+1);
            this.props.showButton();
        }
    }
    
    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.isTurnNewPage!==prevState.isNewPage){
            return { isNewPage: nextProps.isTurnNewPage};
        }
        else return null;
     }
     
     componentDidUpdate(prevProps, prevState) {
        if(this.state.isNewPage!==prevState.isNewPage){
            this.setState({
                isNewPage: this.props.isTurnNewPage,
                classNames: this.getCurrentClassList()
            });
        }
     }
    
    render() {
        let { answers } = this.props;
        let { classNames } = this.state;
        console.log(answers);
        console.log(classNames);
        let transition = {
            transitionName: "example",
            transitionEnterTimeout: 500,
            transitionLeaveTimeout: 300
        }
        
        return (
            <div id="answers">
                <ul>
                {classNames.map((item, i) => <li onClick={this.checkAnswer} className={item} data-id={i}><span>{String.fromCharCode(65+i)}</span> <p>{answers[i]}</p></li>)}
                </ul>
            </div>
        );
    }
}

export default Answers