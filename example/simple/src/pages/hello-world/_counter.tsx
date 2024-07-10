import { Show, createSignal } from 'solid-js';

export const Counter = ({init}: {init: number}) => {
  const [number, setNumber] = createSignal(init);

  return (
    <>
      <h2>The number is: {number()}</h2>
      <div style={{ display: 'flex' }}>
        <button onClick={() => setNumber(number() + 1)}>Increase</button>
        <button onClick={() => setNumber((prev) => prev - 1)}>Decrease</button>
      </div>
      <Show when={number() === 2} fallback={"The number isn't two"}>
        The number is two
      </Show>
    </>
  );
};
