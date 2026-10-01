/** Material Symbols (Apache-2.0) paths used in stories. */
const icon = (d: string) =>
  function Icon() {
    return (
      <svg viewBox="0 -960 960 960" fill="currentColor">
        <path d={d} />
      </svg>
    );
  };

export const AddIcon = icon('M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z');
export const SendIcon = icon('M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Z');
export const StarIcon = icon(
  'm233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z',
);
export const ArrowIcon = icon('M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z');
