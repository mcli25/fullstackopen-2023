const Total = ({ parts }) => {
  const sum = parts.reduce((acc, p) => acc + p.exercises, 0);
  return (
    <div>
      <h3>total of {sum} exercises</h3>
    </div>
  );
};

export default Total;
