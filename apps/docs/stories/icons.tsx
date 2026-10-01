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
export const StarOutlineIcon = icon(
  'm354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z',
);
export const SearchIcon = icon(
  'M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z',
);
