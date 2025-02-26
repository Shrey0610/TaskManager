import { useState, useEffect } from "react";
import { Button } from "@mui/material"; // or @mui/material

 // eslint-disable-next-line react/prop-types
export default function Countdown({ start }) {
    const [time, setTime] = useState(start);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime(prevTime => Math.max(0, prevTime - 1000));
            }, 1000);
        }
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [isRunning, time]);

    const formatTime = (t) => {
        return `${Math.floor(t / (1000 * 60 * 60 * 24))}d ${Math.floor((t / (1000 * 60 * 60)) % 24)}h ${Math.floor((t / 1000 / 60) % 60)}m ${Math.floor((t / 1000) % 60)}s`;
    };

    return (
        <div>
            {formatTime(time)}
            <Button onClick={() => setIsRunning(true)} disabled={isRunning || time <= 0}>
                {isRunning ? "Running..." : "Start"}
            </Button>
        </div>
    );
}
