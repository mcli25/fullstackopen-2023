const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  const Header = ({ course }) => {
    return <h1>{course.name}</h1>;
  };

  const Part = ({ part, exercises }) => {
    return (
      <p>
        {part} {exercises}
      </p>
    );
  };

  const Content = ({ parts }) => {
    return (
      <div>
        {parts.map((p, index) => (
          <Part part={p.name} exercises={p.exercises} key={index}></Part>
        ))}
      </div>
    );
  };

  const Total = ({ parts }) => {
    const sum = parts.reduce((acc, p) => acc + p.exercises, 0);
    return (
      <div>
        <p>Number of exercises {sum}</p>
      </div>
    );
  };

  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default App;
