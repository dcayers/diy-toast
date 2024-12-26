import { Button, ButtonGroup } from "@nextui-org/react";
import { useToast } from "./toast/use-toast";
import { ToastContainer } from "./toast/container";
import type { Toast } from "./toast/types";
import { useEffect } from "react";

function CustomMessage() {
  return (
    <div className="grid gap-4">
      <h2 className="text-2xl font-bold">Custom Title</h2>
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
    <main className="h-screen w-screen flex flex-col items-center justify-center gap-4">
      <ButtonGroup>
        <Button
          onClick={() => showStringNotification("top-right")}
          color="primary"
        >
          With String Content
        </Button>
        <Button onClick={() => showCustomNotification("bottom-left")}>
          With Custom Content
        </Button>
      </ButtonGroup>

      <Button onClick={() => fetchSomething()}>Fetch Something </Button>

      <ButtonGroup>
        <Button
          onClick={() =>
            addNotification({
              content: "Top Left",
              position: "top-left",
            })
          }
        >
          Top Left
        </Button>
        <Button
          onPress={() =>
            addNotification({
              content: "Top Center",
              position: "top-center",
            })
          }
        >
          Top Center
        </Button>
        <Button
          onClick={() =>
            addNotification({
              content: "Top Left",
              position: "top-right",
            })
          }
        >
          Top Right
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          onClick={() =>
            addNotification({
              content: "Center Left",
              position: "center-left",
            })
          }
        >
          Center Left
        </Button>
        <Button
          onPress={() =>
            addNotification({
              content: "Center Toast",
              position: "center-center",
            })
          }
        >
          Centered
        </Button>
        <Button
          onClick={() =>
            addNotification({
              content: "Center Left",
              position: "center-right",
            })
          }
        >
          Center Right
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          onClick={() =>
            addNotification({
              content: "Bottom Left",
              position: "bottom-left",
            })
          }
        >
          Bottom Left
        </Button>
        <Button
          onPress={() =>
            addNotification({
              content: "Bottom Center",
              position: "bottom-center",
            })
          }
        >
          Bottom Center
        </Button>
        <Button
          onClick={() =>
            addNotification({
              content: "Bottom Left",
              position: "bottom-right",
            })
          }
        >
          Bottom Right
        </Button>
      </ButtonGroup>

      <ToastContainer />
    </main>
  );
}

export default App;
