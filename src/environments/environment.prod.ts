// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  // apiUrl: "https://moleculesystem.com/api",
  apiUrl: "http://192.168.121.182:3000/api",
  oauth: {
    google: {
      clientId: "342494603612-q6vfmrrm9eou65u3gfgo7krsn7vro053.apps.googleusercontent.com"
    }
  },
  accessKeyId: "AKIASJF5UAUY46FOA5GB",
  secretAccessKey: "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",
  platform: "mobile",
  alertsUrl: "https://moleculesystem.com/alerts",
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
