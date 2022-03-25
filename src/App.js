import { useState, useEffect, useCallback } from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";
import Modal from './components/Modal';

const cardImages = [
  { "src": "/img/helmet-1.png", matched: false },
  { "src": "/img/potion-1.png", matched: false },
  { "src": "/img/ring-1.png", matched: false },
  { "src": "/img/scroll-1.png", matched: false },
  { "src": "/img/shield-1.png", matched: false },
  { "src": "/img/sword-1.png", matched: false }
];

export default function App() {

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const duplicateItems = (arr, times) => {
    let res = [];
    for (const element of arr) {
      for (let i = 0; i < times; i++) {
        res.push(element);
      }
    }
    return res;
  } 

  const shuffleCards = useCallback(() => {
    const shuffledCards = duplicateItems(cardImages, 2)
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setShowScore(false);
    setCards(shuffledCards);
    setTurns(0);
  }, []);
  
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  }

  const closeModal = () => {
    setShowModal(false);
  }

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              return {...card, matched: true};
            } else {
              return card;
            }
          })
        })
        resetTurn();
        setScore(prevScore => prevScore + 1);
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
    if (score === 6) {
      setShowScore(true);
    }
  }, [choiceOne, choiceTwo, score]);

  useEffect(() => {
    shuffleCards();
  }, [shuffleCards]);
  
  // console.log(setShowScore);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevState => prevState + 1);
    setDisabled(false);
  }

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards} >New Game</button>

      <div className="card-grid">
        {cards.map(card => (
          <SingleCard 
            handleChoice={handleChoice} 
            key={card.id} 
            card={card} 
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <p>turns: {turns}</p>

      {showModal && <Modal>
          <h2>welcome to memory game!</h2>
          <p>
              there are 6 pairs of unique pictures of magic
              items such as a helmet, a scroll, sword, etc.
              it's your task to figure out these pairs using
              your strong memory with a minimum number of turns!
          </p>
          <h3>all the best!</h3>
          <button onClick={closeModal}>let's begin</button>
        </Modal>}

      {showScore && <Modal>
        <h2>you won!</h2>
        <p>
          congratulations dear wizard! you have completed the quest
          to become a strong and magical wizard! would you like to 
          go on the quest again?
        </p>
        <p>You managed to win in {turns} number of turns!</p>
        <button onClick={shuffleCards}>play again</button>
        </Modal>}
    </div>
  );
}