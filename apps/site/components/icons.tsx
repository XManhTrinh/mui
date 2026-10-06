import type { ReactElement, SVGProps } from 'react';

/**
 * Local Material Symbols SVG icons passed to library components. Raw `<svg>` React
 * elements are the documented way to supply icons; this is not a UI library, so it is
 * allowed by the "only our components" rule. All paths use the Material Symbols
 * `0 -960 960 960` viewBox and `fill="currentColor"`, so they inherit the colour role of
 * the component they sit in.
 */
function Icon({ children, ...props }: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
  </Icon>
);

export const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
  </Icon>
);

export const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Z" />
  </Icon>
);

export const PaletteIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127.5Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 73.5T480-80ZM260-440q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Z" />
  </Icon>
);

export const MotionIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M160-160q-33 0-56.5-23.5T80-240v-240h80v240h240v80H160Zm400 0v-80h240v-240h80v240q0 33-23.5 56.5T800-160H560ZM480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM80-560v-240q0-33 23.5-56.5T160-880h240v80H160v240H80Zm720 0v-240H560v-80h240q33 0 56.5 23.5T880-800v240h-80Z" />
  </Icon>
);

export const TuneIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z" />
  </Icon>
);

export const AccessibilityIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M480-760q-33 0-56.5-23.5T400-840q0-33 23.5-56.5T480-920q33 0 56.5 23.5T560-840q0 33-23.5 56.5T480-760ZM360-80v-520q-60-5-122-15t-118-25l20-80q78 21 166 30.5t174 9.5q86 0 174-9.5T820-720l20 80q-56 15-118 25t-122 15v520h-80v-240h-80v240h-80Z" />
  </Icon>
);

export const CodeIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z" />
  </Icon>
);

export const WidgetsIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M560-560v-280h280v280H560ZM120-440v-400h400v400H120Zm520 320v-320h200v320H640ZM120-120v-320h400v320H120Zm80-400h240v-240H200v240Zm440-120h120v-120H640v120ZM200-200h240v-160H200v160Zm520-80v-200h40v200h-40ZM440-520Zm200-120Zm0 280ZM440-360Z" />
  </Icon>
);

export const AddIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
  </Icon>
);

export const SendIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Z" />
  </Icon>
);

export const EditIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
  </Icon>
);

export const StarIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
  </Icon>
);

export const StarOutlineIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
  </Icon>
);

export const ArrowForwardIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
  </Icon>
);

export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </Icon>
);

export const DeleteIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
  </Icon>
);

export const FormatBoldIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z" />
  </Icon>
);

export const FormatItalicIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z" />
  </Icon>
);

export const FormatUnderlinedIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z" />
  </Icon>
);

export const ArrowBackIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M313-440l224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
  </Icon>
);

export const MoreVertIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
  </Icon>
);

export const MicIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm-40 280v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Z" />
  </Icon>
);
