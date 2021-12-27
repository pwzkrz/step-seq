export default function PlayerRow(props) {
  let steps = [];
  for (let i = 0; i < 16; i++) {
    steps[i] = i;
  }

  return (
    <div className="flex gap-4">
      <div className="w-32">&nbsp;</div>
      <div className="flex gap-2 justify-between w-full">
        {steps.map((element, index) => {
          let hightlightStep = props.currentStep - 1;
          if (hightlightStep === -1) {
            hightlightStep = 15;
          }
          if(!props.isPlaying) {
            hightlightStep = 0
          }

          return (
            <div
              key={index}
              data-id={index}
              className={
                hightlightStep === index
                  ? "border w-6 min-h-6 rounded-md bg-gray-400"
                  : "border w-6 min-h-6 rounded-md"
              }
            />
          );
        })}
      </div>
    </div>
  );
}
