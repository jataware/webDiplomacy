import { useTheme } from "@mui/material";
import * as React from "react";
import countryMap from "../../../data/map/variants/classic/CountryMap";
import TerritoryMap from "../../../data/map/variants/classic/TerritoryMap";
import Territories from "../../../data/Territories";
import UIState from "../../../enums/UIState";
import { TerritoryMapData } from "../../../interfaces";
import {
  gameApiSliceActions,
  gameOrder,
  gameOrdersMeta,
  gameOverview,
  gameTerritoriesMeta,
  gameUnitState,
} from "../../../state/game/game-api-slice";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { TerritoryMeta } from "../../../state/interfaces/TerritoriesState";
import ClickObjectType from "../../../types/state/ClickObjectType";
import UnitType from "../../../types/UnitType";
import WDUnit from "../../ui/units/WDUnit";
import WDCenter from "./WDCenter";
import WDLabel from "./WDLabel";
import WDUnitSlot from "./WDUnitSlot";
import { Unit } from "../../../utils/map/getUnits";
import Territory from "../../../enums/map/variants/classic/Territory";

interface WDTerritoryProps {
  territoryMapData: TerritoryMapData;
  units: Unit[];
}

const WDTerritory: React.FC<WDTerritoryProps> = function ({
  territoryMapData,
  units,
}): React.ReactElement {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const territoriesMeta = useAppSelector(gameTerritoriesMeta);

  const { user, members } = useAppSelector(gameOverview);
  const userCountry = countryMap[user.member.country];

  const { territory } = territoryMapData;
  const territoryMeta = territoriesMeta[territoryMapData.territory];

  let territoryFill = "none";
  let territoryFillOpacity = 0;
  const territoryStrokeOpacity = 1;
  if (territoryMeta?.countryID) {
    const ownerCountryID = territoryMeta?.countryID;
    const ownerCountry =
      members.find(({ countryID }) => String(countryID) === ownerCountryID)
        ?.country || "null";
    territoryFill = theme.palette[ownerCountry]?.main;
    territoryFillOpacity = 0.4;
  }
  const curOrder = useAppSelector(gameOrder);
  if (territoryMeta?.territory === curOrder.toTerritory) {
    territoryFillOpacity = 0.9;
  }

  const unitState = useAppSelector(gameUnitState); // FIXME: too global
  const unitFCs: { [key: string]: any } = {};
  if (territory === Territory.BERLIN) {
    console.log({ territory, units, territoryMeta });
  }
  units
    .filter(
      (unit) =>
        (unit.mappedTerritory.parent || unit.mappedTerritory.territory) ===
        territoryMeta?.territory,
    )
    .forEach((unit) => {
      console.log(`Found unit in ${territory}`);
      unitFCs[unit.mappedTerritory.unitSlotName] = (
        <WDUnit
          id={`${territory}-unit`} // n.b. the id here is ref'd by drawOrders, do not change!
          country={unit.country}
          meta={unit}
          type={unit.unit.type as UnitType}
          iconState={unitState[unit.unit.id]} // FIXME make declarative
        />
      );
    });

  const ordersMeta = useAppSelector(gameOrdersMeta);
  Object.values(ordersMeta)
    .filter(
      ({ update }) =>
        update &&
        update.type.split(" ")[0] === "Build" && // updates can be something supporting you or moving to this territory???
        update.toTerrID === territoryMeta?.id,
    )
    .forEach(({ update }) => {
      territoryFillOpacity = 0.9;
      unitFCs.main = ( // FIXME: needs to support coasts
        <WDUnit
          id={`${territory}-unit`} // n.b. the id here is ref'd by drawOrders, do not change!
          country={userCountry}
          meta={{
            country: userCountry,
            mappedTerritory: TerritoryMap[territory],
            unit: {
              id: `${territory}-unit`,
              countryID: "NA",
              type: update?.type.split(" ")[1] as unknown as string, // Build Army --> Army
              terrID: territoryMeta?.id || "null",
            },
          }}
          type={update?.type.split(" ")[1] as UnitType}
          iconState={UIState.BUILD}
        />
      );
    });

  const clickAction = function (evt, clickObject: ClickObjectType) {
    dispatch(
      gameApiSliceActions.processMapClick({
        clickObject,
        evt,
        name: territory,
      }),
    );
  };
  return (
    <svg
      height={territoryMapData.height}
      id={`${territory}-territory`}
      viewBox={territoryMapData.viewBox}
      width={territoryMapData.width}
      x={territoryMapData.x}
      y={territoryMapData.y}
    >
      <g onClick={(e) => clickAction(e, "territory")}>
        {territoryMapData.texture?.texture && (
          <path
            d={territoryMapData.path}
            fill={territoryMapData.texture.texture}
            id={`${territory}-texture`}
            stroke={territoryMapData.texture.stroke}
            strokeOpacity={territoryMapData.texture.strokeOpacity}
            strokeWidth={territoryMapData.texture.strokeWidth}
          />
        )}
        <path
          d={territoryMapData.path}
          fill={territoryFill}
          fillOpacity={territoryFillOpacity}
          id={`${territory}-control-path`}
          stroke={theme.palette.primary.main}
          strokeOpacity={1}
          strokeWidth={territoryStrokeOpacity}
        />
      </g>
      {territoryMapData.centerPos && (
        <g className="no-pointer-events">
          <WDCenter
            territory={territory}
            x={territoryMapData.centerPos.x}
            y={territoryMapData.centerPos.y}
          />
        </g>
      )}
      {territoryMapData.labels &&
        territoryMapData.labels.map(({ name, text, style, x, y }, i) => {
          let txt = text;
          const id = `${territory}-label-${name}`;
          if (!txt) {
            txt = territoryMapData.abbr;
          }
          return (
            <g key={id} className="no-pointer-events">
              <WDLabel
                id={id}
                name={name}
                key={id || i}
                style={style}
                text={txt}
                x={x}
                y={y}
              />
            </g>
          );
        })}
      {territoryMapData.unitSlots &&
        territoryMapData.unitSlots.map(({ name, x, y }) => (
          <WDUnitSlot key={name} name={name} territory={territory} x={x} y={y}>
            {unitFCs[name]}
          </WDUnitSlot>
        ))}
      {territoryMapData.arrowReceiver && (
        <rect
          id={`${territory}-arrow-receiver`}
          x={territoryMapData.arrowReceiver.x}
          y={territoryMapData.arrowReceiver.y}
          width="1"
          height="1"
        />
      )}
    </svg>
  );
};

export default WDTerritory;
