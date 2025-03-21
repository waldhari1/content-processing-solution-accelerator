// msalConfig.ts
import { Configuration, LogLevel } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_MSAL_AUTH_CLIENT_ID as string,
    authority: process.env.REACT_APP_MSAL_AUTH_AUTHORITY,
    redirectUri: process.env.REACT_APP_MSAL_REDIRECT_URL as string,
    postLogoutRedirectUri: process.env.REACT_APP_MSAL_POST_REDIRECT_URL as string,
  },
  cache: {
    cacheLocation: 'localStorage', // Use localStorage for persistent cache
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        if (level === LogLevel.Error) console.error(message);
        // if (level === LogLevel.Info) console.info(message);
        // if (level === LogLevel.Verbose) console.debug(message);
        // if (level === LogLevel.Warning) console.warn(message);
      },
    },
  },
};

const loginScope = process.env.REACT_APP_MSAL_AUTH_SCOPE as string;
const tokenScope = process.env.REACT_APP_MSAL_TOKEN_SCOPE as string;

// console.log("loginScope", loginScope);
// console.log("tokenScope", tokenScope);
export const loginRequest = {
  scopes: ["user.read", loginScope],  // Define the scope you need
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};

export const tokenRequest = {
  scopes: [tokenScope],
}