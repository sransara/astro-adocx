import { Show, createSignal } from 'solid-js';

export const Counter = ({init}: {init: number}) => {
  const [number, setNumber] = createSignal(init);

  return (
    <div style={{ border: '1px black solid', padding: '1em', margin: '1em' }}>
      <div>The number is: {number()}</div>
      <hr />
      <div style={{ display: 'flex' }}>
        <button onClick={() => setNumber(number() + 1)}>Increase</button>
        <button onClick={() => setNumber((prev) => prev - 1)}>Decrease</button>
      </div>
      <hr />
      <Show when={number() === 2} fallback={"The number isn't two"}>
        The number is two
      </Show>
    </div>
  );
};
