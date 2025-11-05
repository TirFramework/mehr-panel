import { useState } from "react";
// import useNavigationPrompt from "use-navigation-prompt";

function Prompt() {
  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);
  //   useNavigationPrompt(isNavigationBlocked);

  return (
    <div>
      Navigation is: {!isNavigationBlocked ? "not" : ""} Blocked
      <button
        onClick={() =>
          setIsNavigationBlocked(
            (prevIsNavigationBlocked) => !prevIsNavigationBlocked
          )
        }
      >
        Toggle
      </button>
    </div>
  );
}

export default Prompt;
