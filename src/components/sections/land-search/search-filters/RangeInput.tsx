// Having fun using svelte components in React :D
// Reference: https://simeydotme.github.io/svelte-range-slider-pips/en/introduction/
import React, { useEffect, useRef } from "react";
import RangeSlider from "svelte-range-slider-pips";

import "./RangeInput.sass";

interface Props {
  id: string;
  values: number[];
  onUpdateValues: (values: number[]) => void;
  options?: {
    max?: number;
    min?: number;
    step?: number;
  };
}

const defaultOptions = {
  max: 100,
  min: 0,
  step: 0.1,
};

const RangeInput: React.FC<Props> = ({
  id,
  values,
  onUpdateValues,
  options,
}) => {
  const { max, min, step } = { ...defaultOptions, ...options };

  const $node = useRef<HTMLDivElement>(null);
  const MySlider = useRef<RangeSlider>();

  useEffect(() => {
    if (!MySlider.current) {
      MySlider.current = new RangeSlider({
        target: $node.current!,
        props: {
          values: values,
          range: true,
          min,
          max,
          step,
          pips: false,
          pushy: true,
          float: true,
        },
      });
      MySlider.current.$on("change", (e) => {
        onUpdateValues(e.detail.values);
      });
    }
  }, []);

  // Watch for changes in the 'values' prop
  useEffect(() => {
    if (MySlider.current) {
      MySlider.current.$set({ values });
    }
  }, [values]);

  return (
    <>
      <div id={id} ref={$node}></div>
      <output className="flex justify-between text-[--color-secondary] font-semibold text-sm cursor-default mt-2.5">
        <span>{values[0]}</span>
        <span>{values[1]}</span>
      </output>
    </>
  );
};

export default RangeInput;
