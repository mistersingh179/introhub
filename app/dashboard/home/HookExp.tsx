"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const HookExp = () => {
  const [options, setOptions] = useState<number>(0);
  const hasBeenRendered = useRef(false);

  useEffect(() => {
    if (hasBeenRendered.current == false) {
      console.log("will not run as it has not been rendered");
      hasBeenRendered.current = true;
      return;
    }
    console.log("options have changed: ", options);
  }, [options]);

  return (
    <>
      <h1> Hook Exp</h1>
      <div>Options: {options}</div>
      <Button onClick={() => setOptions(Date.now())}>Hello</Button>
    </>
  );
};

export default HookExp;
