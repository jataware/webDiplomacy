import Country from "../enums/Country";
import UIState from "../enums/UIState";

export interface navIconProps {
  iconState?: UIState.ACTIVE | UIState.INACTIVE;
}

export interface gameIconProps {
  country: Country;
  height?: number;
  iconState?: UIState;
  onClick?: React.MouseEventHandler<SVGSVGElement> | undefined;
  viewBox?: string;
  width?: number;
}
