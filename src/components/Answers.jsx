import React from 'react';    
import './Answers.css'

class Answers extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isAnswered: false,
            isNewPage: true,
            classNames: this.getCurrentClassList(),
            stocksToHold: [{"code": ""}]
        }
        
        this.checkAnswer = this.checkAnswer.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit = evt => {
        const { stocksToHold } = this.state;
        let {saveAnswer} = this.props;
        this.setState({
            isNewPage: false
        })
        saveAnswer(stocksToHold);
        this.props.showButton();
    };
    
    handleAddStock = () => {
        if (this.state.stocksToHold.length < 5) {
            this.setState({
                stocksToHold: this.state.stocksToHold.concat([{ "code": "" }])
              });
        }
    };

    handleStockChange = idx => evt => {
        const newStocksToHold = this.state.stocksToHold.map((stock, sidx) => {
          if (idx !== sidx) return stock;
          return {...stock, "code":evt.target.value };
        });
    
        this.setState({ stocksToHold: newStocksToHold });
    };
    
    handleRemoveStock = idx => () => {
        this.setState({
          stocksToHold: this.state.stocksToHold.filter((s, sidx) => idx !== sidx)
        });
    };
    
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
        let isOpenEndQ = answers.length == 0;
        let transition = {
            transitionName: "example",
            transitionEnterTimeout: 500,
            transitionLeaveTimeout: 300
        }
        let mydiv;
        if (isOpenEndQ) {
            mydiv =
            <section>
                <div id="formA">
                {this.state.stocksToHold.map((stock, idx) => (
                    <div className="stocklist">
                        <input type="text"
                        placeholder={`Stock code #${idx + 1}`}
                        value={stock.code}
                        onChange={this.handleStockChange(idx)}
                    />
                    <button type="button"
                    onClick={this.handleRemoveStock(idx)}
                    className="small">-</button>
                    </div>
                ))}
                </div>
                <div id="formB">
                    <button type="button"
                    onClick={this.handleAddStock}>Add Stock</button>
                    <button onClick={this.handleSubmit}>Submit</button>
                </div>            
            </section>;
            } else {
            mydiv =  
            <div id="answers">
                <ul>
                    {classNames.map((item, i) => <li onClick={this.checkAnswer} className={item} data-id={i}><span>{String.fromCharCode(65+i)}</span> <p>{answers[i]}</p></li>)}
                </ul>
            </div>
        }
        return (mydiv);
    }
}

export default Answers