import { Button } from "@nextui-org/react";
import { useToast } from "./toast/use-toast";
import { ToastContainer } from "./toast/container";
import type { Toast } from "./toast/types";
import { useEffect } from "react";

function CustomMessage() {
  return (
    <div>
      <p className="text-black">This is a custom message component!</p>
      <Button>Click me!</Button>
    </div>
  );
}

function App() {
  const { addNotification } = useToast();

  const fetchSomething = () => {
    return new Promise((resolve, reject) => {
      if (Math.random() < 0.5) {
        addNotification({
          content: "SUCCESS",
          variant: "success",
          duration: 5000,
          position: "top-left",
        });
        resolve("Success");
      } else {
        addNotification({
          content: "REJECTED",
          variant: "error",
          duration: 10000,
          position: "top-left",
        });
        reject("Error");
      }
    });
  };

  const showStringNotification = (position: Toast["position"]) => {
    addNotification({
      content: "This is a string message!",
      variant: "success",
      duration: 5000,
      position,
      halted: true,
    });
  };

  const showCustomNotification = (position: Toast["position"]) => {
    addNotification({
      content: CustomMessage,
      variant: "success",
      duration: 5000,
      position,
      halted: true,
    });
  };

  useEffect(() => {
    const t = setTimeout(() => {
      addNotification({
        content: "REJECTED",
        variant: "error",
        duration: 10000,
        position: "bottom-right",
      });
    }, 2000);

    return () => clearTimeout(t);
  }, [addNotification]);

  return (
    <main className="h-screen w-screen flex items-center justify-center gap-4">
      <Button
        onClick={() => showStringNotification("top-right")}
        color="primary"
      >
        Top Right (String)
      </Button>
      <Button onClick={() => showCustomNotification("bottom-left")}>
        Button Left (Component)
      </Button>

      <Button
        onClick={() =>
          addNotification({
            content: "New Toast",
            position: "bottom-right",
            duration: 15000,
            halted: true,
          })
        }
      >
        New Toast
      </Button>

      <Button onClick={() => fetchSomething()}>Fetch Something </Button>

      <ToastContainer />
    </main>
  );
}

export default App;
