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

export const SettingsIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
  </Icon>
);

// Rail-group icons.
export const BoltIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M360-120 440-440 160-440 520-840 440-520 760-520 360-120Zm62-112 217-284H472l40-324-217 299h167l-40 309Z" />
  </Icon>
);

export const ExploreIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="m300-300 280-80 80-280-280 80-80 280Zm180-120q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
  </Icon>
);

export const NotificationsIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
  </Icon>
);

export const CalendarMonthIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
  </Icon>
);

export const CategoryIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z" />
  </Icon>
);

export const CodeToggleIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z" />
  </Icon>
);

export const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </Icon>
);

export const MenuBookIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM248-300q53 0 103.5 12.5T450-250v-427q-45-30-97.5-46.5T248-740q-38 0-74.5 9.5T100-704v428q35-12 72-18t76-6Zm282 50q50-25 99.5-37.5T732-300q39 0 76 6t72 18v-428q-36-16-72.5-26t-75.5-10q-56 0-108.5 16.5T530-677v427Zm-50 90q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-497q0-11 5.5-21T62-767q46-24 96-35.5T260-814q65 0 127 19t113 55q51-36 113-55t127-19q54 0 104 11.5t96 35.5q11 5 16.5 15t5.5 21v497q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-290q-60 0-116 21t-104 59ZM280-499Z" />
  </Icon>
);

export const ExpandMoreIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
  </Icon>
);

export const ContentCopyIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
  </Icon>
);
