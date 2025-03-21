# Set up Authentication in Azure Container App

This document provides step-by-step instructions to configure Azure App Registrations for a front-end and back-end application.

## Prerequisites
- Access to **Azure Active Directory (Azure AD)**
- Necessary permissions to create and manage **App Registrations**

## Step 1: Add Authentication Provider  
We will add Microsoft Entra ID as an authentication provider to API and Web Application. 

1. Add Authentication Provider in Web Application  
 
   - Go to deployed Container App and select ca-< your environment >-< randomname >-web and click **Add Identity Provider** button in Authentication  
![add_auth_provider_web_1](./Images/add_auth_provider_web_1.png)

   - Select **Microsoft** and set **Client secret expiration** then Click **Add** button  
![add_auth_provider_web_2](./Images/add_auth_provider_web_2.png)

2. Add Authentication Provider in API Service  
 
    - Go to deployed Container App and select **ca-< your environment >-< randomname >-api** and click **Add Identity Provider** button in Authentication  
![add_auth_provider_web_1](./Images/add_auth_provider_api_1.png)

    - Select **Microsoft** and set **Client secret expiration**  
![add_auth_provider_web_2](./Images/add_auth_provider_api_2.png)  

    - Set **Unauthenticated requests** then Click **Add** button  
![add_auth_provider_web_3](./Images/add_auth_provider_api_3.png)

## Step 2: Configure Application Registration - Web Application
1. Set Redirect URI in Single Page Application Platform
    - Go to deployed Container App **ca-< your environment >-< randomname >-web** and select **Authentication** menu then select created Application Registration  
![configure_app_registration_web_1](./Images/configure_app_registration_web_1.png)  

    - Select **Authentication** then Select **+ Add a platform** menu  
![configuration_app_registration_web_2](./Images/configure_app_registration_web_2.png)  

    - Select **Single-page application**  
![configuration_app_registration_web_3](./Images/configure_app_registration_web_3.png)

    - Add Container App **ca-< your environment >-< randomname >-web**'s URL  
![configuration_app_registration_web_4](./Images/configure_app_registration_web_4.png)   
   -  You may get this URL from here in your Container App
![configuration_app_registration_web_5](./Images/configure_app_registration_web_5.png)

2. Add Permission and Grant Permission  
     - Add Permission for API application. Select **+ Add a permission** button then search API application with name **ca-< your environment name >-<unique string>-api**  
![configuration_app_registration_web_6](./Images/configure_app_registration_web_6.png)
![configuration_app_registration_web_7](./Images/configure_app_registration_web_7.png)
      - Grant admin consent to permissions  
![configuration_app_registration_web_8](./Images/configure_app_registration_web_8.png)


## Step 3: Configure Application Registration - API Application  
Add Web Application Registration's Client Id to API's Allowed client application list.

## Step 4: Update Environment Variable in Container App for Web Application
Update Environment variable for Client Id in Web App's application registration, Scope for Web as auth scope, Scope for API as token scope





## Conclusion
You have successfully configured the front-end and back-end Azure App Registrations with proper API permissions and security settings.