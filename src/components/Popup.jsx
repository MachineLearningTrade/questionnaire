import React from 'react';

class Popup extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            time: 'start',
            title: 'Welcome to Questionnaire',
            text: 'This is a questionnaire application built using ReactJS. <br /><br /> Currently it\'s loaded with CSS questions from W3Scools, but you can easily load any type of questions into it. <br /><br /> It will dynamically load the question->answers pair and upload them into the components.' ,
            buttonText: 'Start the questionnaire' 
        };
        
        this.popupHandle = this.popupHandle.bind(this);
    }
    
    popupHandle() {
        let { time } = this.state;
        let uuid = this.props.uuid;
        let answerlist  = this.props.getAnswerList();
        
        if(time === 'start'){
            this.setState({
                time: 'end',
                title: 'Congratulations!',
                buttonText: 'End'
            });
            
            this.props.startQuiz();
        } else if (time == 'end') {
            const profile = {'data': {'id': uuid, 'answer': answerlist}};
            fetch('/api/savequestionnaire', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profile)
            });
            this.props.endQuiz(); 
        }
    }
    
    componentWillReceiveProps(nextProps) {
        let answerlist = this.props.getAnswerList();
        let response = 'You have completed the questionnaire. <br /><br />Your session id is: ' + this.props.uuid;
        this.setState({
            text: response
        })
    }
    
    createMarkup(text) {
        return {__html: text};
    }
    
    
    render() {
       
        let { title, text, buttonText } = this.state;
        
        let { style } = this.props;
        
        return (
            <div className="popup-container" style={style}>
                <div className="container">
                    <div className="col-md-8 col-md-offset-2">
                        <div className="popup">
                            <h1>{title}</h1>
                            <p dangerouslySetInnerHTML={this.createMarkup(text)} />
                            <button className="fancy-btn" onClick={this.popupHandle}>{buttonText}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Popup
