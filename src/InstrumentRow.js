export default function InstrumentRow(props) {
  let steps = [];
  for (let i = 0; i < 16; i++) {
    steps[i] = i;
  }
  return (
    <div className="flex gap-4 min-w-[560px]">
      <div className="w-32 text-sm leading-loose font-light">{props.name}</div>
      <div className="flex gap-2 justify-between w-full">
        {steps.map((element, index) => (
          <button
            key={index}
            data-name={props.name}
            data-id={index}
            className="border w-6 min-h-6 hover:scale-125 rounded-md duration-100 transition-all"
            onClick={props.toggleSequencerButton}
          />
        ))}
      </div>
    </div>
  );
}
