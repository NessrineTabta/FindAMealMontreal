import '../Css/App.css'
import '../Css/index.css'
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Button onClick={() => alert('ShadCN Button Clicked!')}>
        Click Me!
      </Button>
    </div>
  );
}

export default App
