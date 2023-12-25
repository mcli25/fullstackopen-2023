import { useState } from "react";

const Statistics = ({ good, neutral, bad }) => {
  //# of clicks
  const sum = good + neutral + bad;

  const average = (good - bad) / sum;
  const positive = (good / sum) * 100 + " %";
  return (
    <div>
      <h1>Statistics</h1>
      {sum === 0 ? (
        <div>No feedback given</div>
      ) : (
        <table>
          <tbody>
            <StatisticLine text="good" value={good} />
            <StatisticLine text="neutral" value={neutral} />
            <StatisticLine text="bad" value={bad} />
            <StatisticLine text="all" value={sum} />
            <StatisticLine text="average" value={average} />
            <StatisticLine text="positive" value={positive} />
          </tbody>
        </table>
      )}
    </div>
  );
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const FeedBack = ({ handleGood, handleNeutral, handleBad }) => {
  return (
    <div>
      <h1>Give feedback</h1>
      <div>
        <button onClick={handleGood}>good</button>
        <button onClick={handleNeutral}>neutual</button>
        <button onClick={handleBad}>bad</button>
      </div>
    </div>
  );
};
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGood = () => {
    setGood((good) => good + 1);
  };
  const handleNeutral = () => {
    setNeutral((neutral) => neutral + 1);
  };
  const handleBad = () => {
    setBad((bad) => bad + 1);
  };

  return (
    <div>
      <FeedBack
        handleGood={handleGood}
        handleNeutral={handleNeutral}
        handleBad={handleBad}
      ></FeedBack>
      <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
    </div>
  );
};

export default App;
