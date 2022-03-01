export const mapConfig = {
  mapStyleBaseUrl: "https://api.mapbox.com/styles/v1",
  user: process.env.REACT_APP_MAPBOX_USER || "",
  token: process.env.REACT_APP_MAPBOX_TOKEN || "",
  styles: {
    basic: "ckq8q3dvl071117p7vz0ytxms",
    satellite: "ckq8ui3ov0bbf17p7p7t4vcih"
  }
};

// TODO: This is temporary, while massing configurator designs don't yet work well with the latest map styles.
//       Remove once massing configurator is up to date with latest designs
//       https://lendleasegroup.atlassian.net/browse/ENV-1067
export const massingMapConfig = {
  user: "izaactrpeski",
  token: "pk.eyJ1IjoiamF6aXphIiwiYSI6ImNrNWxxNGhzMjByZmgzb253MTNvcWF5MXcifQ.yQmTfZGk3wCw3yBy7XKbTA",
  styles: {
    basic: "ckaq1sylp0g7c1ilbuadip3v0",
    satellite: "ckaq3vsc70lt41imxpodh622r"
  }
};
