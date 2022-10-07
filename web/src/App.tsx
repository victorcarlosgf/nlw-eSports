interface ButtonProps {
  title: string;
}

function Button(props: ButtonProps) {
  return (
    <button>
      {props.title}
    </button>
  )
}

function App() {
  return (
    <div>
      <h1>Hello world</h1>
      <Button title=""/>
      <Button title=""/>
    </div>
  )
}

export default App
