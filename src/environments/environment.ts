// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "http://192.46.230.183:3000/api",
  oauth: {
    google: {
      clientId: "342494603612-q6vfmrrm9eou65u3gfgo7krsn7vro053.apps.googleusercontent.com"
    }
  },
  // apiUrl: "https://applesaucesystem.com/api",
  accessKeyId: "AKIARGBOXP35BONONB4J",
  secretAccessKey: "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",
  platform: "mobile",
  alertsUrl: "http://localhost:9999/alerts",
  razorPayKey: "rzp_test_OakZMZyF0KpCkj",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
