import { toDate, getTimezoneOffset } from "date-fns-tz";
import tzlookup from "tz-lookup";
import { ITimeZone } from "pages/configurator/data/types";
import { MutableRefObject } from "react";
import SunCalc from "suncalc";
import { DirectionalLight } from "three";
import Sky from "./Sky";

export const calculateSunPosition = (
  lngLat: Array<number>,
  selectedDate: Date,
  lightRef: MutableRefObject<DirectionalLight>,
  skyRef: MutableRefObject<Sky>,
  utcOffset: number
) => {
  const DISTANCE = 500;

  /**
   * suncalc needs the local time offset from the destination time along
   * with the destination's coordinates.
   *
   * Ex. If we want to know the position of the sun in California at noon,
   * then we need to give suncalc the time that it would be locally when it
   * is noon in LA. In Sydney's case that would be 5 am.
   */

  // const date = new Date(selectedDate);
  const date = new Date(selectedDate);
  const [lng, lat] = lngLat;
  // const [timeZone]: Array<ITimeZone> = geoTz(lat, lng);
  // const utcOffset = moment(date).tz(timeZone).utcOffset();
  /**
   * the utcOffset will round the minutes so we need to store
   * the minutes that the user selected with the slider.
   */
  const lostMinutes = date.getUTCMinutes();

  date.setUTCMinutes(-utcOffset + lostMinutes);

  const { altitude, azimuth } = SunCalc.getPosition(date, lat, lng);

  /**
   * when the sun's position is of an altitude greater than 0.7,
   * the intensity needs to be lowered so as not to white-out the map.
   */
  if (altitude > 0.7) {
    const AltitudeLimit = 0.7;

    // the highest altitude the sun reaches.
    const highestAltitude = 1.24;

    /**
     * the range and altitude difference is needed to calculate the percentage of intensity that
     * needs to be removed from the current light's intensity.
     */
    const altitudeRange = highestAltitude - AltitudeLimit;
    const altitudeDifferece = altitude - AltitudeLimit;

    /**
     * now we can calculate how much intensity to remove from 20% (0.2 of 1)
     * from the original intensity. As the sun's altitude increases, this figure
     * increases which will decrease the light's intensity.
     */
    const intensityDifference = 0.2 * (altitudeDifferece / altitudeRange);

    /**
     * The current intensity, which was initially at 1, is too bright, so within
     * this altitude we give it an initial intensity of 0.9 and remove intensity
     * as altitude increases.
     */
    lightRef.current.intensity = 0.9 - intensityDifference;
  }

  const alpha = Math.cos(altitude) * Math.cos(Math.PI / 2 + azimuth);

  const theta = Math.cos(altitude) * Math.sin(Math.PI / 2 + azimuth) * -1;

  const gamma = Math.sin(altitude);
  lightRef.current.position.set(DISTANCE * alpha, DISTANCE * theta, DISTANCE * gamma);

  skyRef.current.material.uniforms.sunPosition.value.copy(lightRef.current.position);
};

export const getTimezoneFromCoordinates = (longitude: number, latitude: number): ITimeZone => {
  return tzlookup(latitude, longitude);
};

export const calculateUTCOffset = (coordinates: number[], date: Date) => {
  const [lng, lat] = coordinates;
  const timeZone: ITimeZone = getTimezoneFromCoordinates(lng, lat);
  const localisedDate = getTimezoneOffset(timeZone, toDate(date));
  // DEVNOTE: getTimezoneOffset returns milliseconds, hence we need to convert to minutes
  return localisedDate === 0 ? 0 : localisedDate / 1000 / 60;
};

export const getDateFromMinutes = (minutes: number) => {
  let date: Date;
  let hour24 = minutes < 0 ? 0 : 12;

  const timeHours = Math.floor(minutes / 60) + hour24;
  const timeMinutes = minutes % 60;

  date = new Date(new Date().setUTCHours(timeHours));
  date.setUTCMinutes(timeMinutes);

  return date;
};

export const getMinutesFromDate = (date: Date) => {
  const START_HOURS = 12; // noon

  const dateHours = date.getUTCHours();
  const dateMinutes = date.getUTCMinutes();

  const minutes = (dateHours - START_HOURS) * 60 + dateMinutes;

  return minutes;
};
