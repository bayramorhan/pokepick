import Container from "./components/layout/container";
import MainHeader from "./components/layout/main-header";
import Picker from "./components/picker";

function App() {
  return (
    <div className="space-y-10">
      <MainHeader />
      <Container>
        <Picker />
      </Container>
    </div>
  );
}

export default App;
