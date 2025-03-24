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


3. Grap Scope Name for Impersonation  
      - Select **Expose an API** in left menu. Copy the Scope name then paste in some temporary place.  
      The copied text will be used for Web Application Environment variable - **APP_MSAL_AUTH_SCOPE**.  
![configuration_app_registration_web_9](./Images/configure_app_registration_web_9.png)

4. Grap Client Id for Web App  
      - Select **Overview** in left menu. Copy the Client Id then paste in some temporary place.  
        The copied text will be used for Web Application Environment variable - **APP_MSAL_AUTH_CLIENT_ID**  
![configuration_app_registration_web_10](./Images/configure_app_registration_web_10.png)
  
## Step 3: Configure Application Registration - API Application  
1. Grap Scope Name for Impersonation  
   - Go to deployed Container App **ca-< your environment >-< randomname >-api** and select **Authentication** menu then select created Application Registration  
![configuration_app_registration_api_1](./Images/configure_app_registration_api_1.png)

    - Select **Expose an API** in left menu.Copy the Scope name then paste in some temporary place.  
    The copied text will be used for Web Application Environment variable - **APP_MSAL_TOKEN_SCOPE**.  
![configuration_app_registration_api_2](./Images/configure_app_registration_api_2.png)

2. Grap Client Id for API  
      - Select **Overview** in left menu. Copy the Client Id then paste in some temporary place.  
        The copied text will be used for **allowed  client applications** list
![configuration_app_registration_api_3](./Images/configure_app_registration_api_3.png)

## Step 4: Add API Client Id to Allowed Client Applications list in Web Application's Registration  
1. Go to deployed Container App **ca-< your environment >-< randomname >-web** and select **Authentication** menu then select **Edit**  
![add_client_id_to_web_1](./Images/add_client_id_to_web_1.png) 
2. Select **Allow requests from specific client applications** then click **pencil** icon to add client Id  
![add_client_id_to_web_2](./Images/add_client_id_to_web_2.png)  
1. Add **Client Id** from [API App registration from previous step] then Save(#step-3-configure-application-registration---api-application).  
![add_client_id_to_web_3](./Images/add_client_id_to_web_3.png)


## Step 5: Update Environment Variable in Container App for Web Application
In previous 2 steps for [Configure Application Registration - Web Application](#step-2-configure-application-registration---web-application) and [Configure Application Registration - API Application](#step-3-configure-application-registration---api-application), we could grap Client Id for Web App's Application Registration and Scopes for Web and API's Application Registration.  

Now, We will Edit and deploy Web Application Container with updated Environment variables.  

1. Select **Containers** menu under **Application** then **click Edit and Deploy** menu.
![update_env_app_1](./Images/update_env_app_1.png)

2. Select Container image and Click **Edit**. under **Environment variables** sections, update 3 values which were taken in previous steps for **APP_MSAL_AUTH_CLIENT_ID**, **APP_MSAL_AUTH_SCOPE**, **APP_MSAL_TOKEN_SCOPE**.  
Now updated Revision will be activated soon.









## Conclusion
You have successfully configured the front-end and back-end Azure App Registrations with proper API permissions and security settings.