import { useState, useEffect } from "react";

let intervalId: string | number | NodeJS.Timeout | undefined;
const startTimer = (
  duration: number,
  display: React.Dispatch<React.SetStateAction<string>>,
  handleNext: () => void
) => {
  let timer = duration;
  let minutes;
  let seconds;
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    minutes = parseInt(`${timer / 60}`, 10);
    seconds = parseInt(`${timer % 60}`, 10);

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    display(`${minutes}:${seconds}`);

    // eslint-disable-next-line no-plusplus
    if (--timer < 0) {
      timer = 0;
      if (intervalId) clearInterval(intervalId);
      handleNext();
    }
  }, 1000);
};
export function Timer({
  time,
  handleNext,
}: {
  time: number | string | null;
  handleNext: () => void;
}) {
  const [timer, setTimer] = useState<string>("00:00");

  useEffect(() => {
    if (time) startTimer(Number(time.toString()) * 60, setTimer, handleNext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return <span>{timer}</span>;
}
