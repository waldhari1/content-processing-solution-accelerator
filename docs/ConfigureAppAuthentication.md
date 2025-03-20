# Azure App Registrations Setup

This document provides step-by-step instructions to configure Azure App Registrations for a front-end and back-end application.

## Prerequisites
- Access to **Azure Active Directory (Azure AD)**
- Necessary permissions to create and manage **App Registrations**

## Step 1: Create Back-End App Registration
1. Go to the [Azure Portal](https://portal.azure.com/).
1. Navigate to **App registrations**.
1. Click **New registration**.
1. Provide a **Name** for the back-end app (e.g., `cps-backend-<env_name>-app`).
1. Choose **Supported account types**.
1. Click **Register**.

### Step 1.1: Expose an API for the Back-End App
1. In the back-end app registration, go to **Expose an API**.
1. Click **Add a scope**.
1. Click **Save and Continue**.
1. Set the **Scope name** to `user_impersonation`.
1. Set the **Admin consent display name** to `user_impersonation`. 
1. Provide a description and enable **Admin consent**.
1. Click **Add Scope**.
1. Copy the **Scope value**.
1. Go to the **Overview** section and copy the **Client ID** of the back-end app.

### Step 1.2: Generate Client Secret
1. In the back-end app registration, go to **Certificates & secrets**.
1. Click **New Client Secret**.
1. Enter a **Description**.
1. Select the **Expiration time** for the secret.
1. Click **Add**.
1. Copy the **Secret value**.

## Step 2: Copy Front-End App URL from Azure Container Apps
1. Navigate to the **Resource Group** where your Azure resources are deployed.
1. Select the deployed front-end application named **ca-cps-<env_name>-web**.
1. Copy the **Front-End Application URL** displayed under the **Overview** section.

## Step 3: Create Front-End App Registration
1. Navigate to **App registrations**.
1. Click **New registration**.
1. Provide a **Name** for the front-end app (e.g., `cps-frontend-<env_name>-app`).
1. Choose **Supported account types** as per your requirement.
1. In the **Redirect URI** section, select **Single-page application** and paste the copied **Front-End Application URL** from Step 2 in the textbox next to it.
1. Click **Register**.

### Step 3.1: Expose an API for the Front-End App
1. In the front-end app registration, go to **Expose an API**.
1. Click **Add a scope**.
1. Click **Save and Continue**.
1. Set the **Scope name** to `user_impersonation`.
1. Set the **Admin consent display name** to `user_impersonation`. 
1. Provide a description and enable **Admin consent**.
1. Click **Add Scope**.
1. Copy the **Scope value**.
1. Go to the **Overview** section and copy the **Client ID** of the app.

### Step 3.2: Configure API Permissions in the Front-End App
1. In the front-end app registration, go to **API permissions**.
1. Click **Add a permission**.
1. Select **My APIs**.
1. Select the back-end app registration created in Step 1.
1. If you don’t find it under **My APIs**, search under **APIs My organization uses**.
1. Choose the `user_impersonation` permission.
1. Click **Add permissions**.
1. Click **Grant admin consent**.

## Step 4: Configure Authentication Settings in the Front-End Container App (Web)
1. Navigate to the **Resource Group** where your Azure resources are deployed.
1. Select the deployed front-end application named **ca-cps-<env_name>-web**.
1. Click **Containers** under **Application** from the left-side menu.
1. Click **Environment variables**.
1. For the key **APP_MSAL_AUTH_CLIENT_ID**, add the front-end app **Client ID** copied from Step 3.1.
1. For the key **APP_MSAL_AUTH_SCOPE**, add the scope copied from Step 3.1.
1. For the key **APP_MSAL_TOKEN_SCOPE**, add the scope copied from Step 1.1.
1. Click **Save as a new revision**.

## Step 5: Configure Identity Provider in the Back-End Container App (API)
1. Navigate to the **Resource Group** where your Azure resources are deployed.
1. Select the deployed back-end application named **ca-cps-<env_name>-api**.
1. Under **Settings**, go to **Authentication**.
1. Click **Add Identity Provider**.
1. Select the **Identity Provider** as **Microsoft**.
1. Select **Provide the details of an existing app registration**.
1. Enter the **Back-End API App Client ID** copied from Step 1.1 into the **Application (client) ID** field.
1. Enter the **Client Secret** generated in Step 1.2 into the **Client secret (recommended)** field.
1. Under **Allowed token audiences**, add the value **api://<Back-End App Client ID>**.
1. Under **Client application requirement**, select **Allow requests from specific client applications**.
1. Click the **Edit** icon under the **Allowed client applications** section.
1. Add the **Client ID of the Back-End App** copied from Step 1.1.
1. Add the **Client ID of the Front-End App** copied from Step 3.1.
1. Click **OK**.
1. Under the **Unauthenticated requests** section, select **HTTP 401 Unauthorized: recommended for APIs**.
1. Click **Add**.

## Conclusion
You have successfully configured the front-end and back-end Azure App Registrations with proper API permissions and security settings.