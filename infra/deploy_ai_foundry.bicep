// Creates Azure dependent resources for Azure AI studio
param solutionName string
param solutionLocation string
@secure()
param keyVaultName string
param cuLocation string
param deploymentType string
param gptModelName string
param gptModelVersion string
param gptDeploymentCapacity int
// param embeddingModel string
// param embeddingDeploymentCapacity int
param managedIdentityObjectId string
param applicationInsightsId string
param containerRegistryId string

// Load the abbrevations file required to name the azure resources.
var abbrs = loadJsonContent('./abbreviations.json')

var storageName = '${abbrs.storage.storageAccount}${solutionName}hubs'
var storageSkuName = 'Standard_LRS'
var aiServicesName = '${abbrs.ai.aiServices}${solutionName}'
var aiServicesName_cu = '${abbrs.ai.aiServices}${solutionName}-cu'
var location_cu = cuLocation
// var aiServicesName_m = '${solutionName}-aiservices_m'
// var location_m = solutionLocation
var keyvaultName = '${abbrs.security.keyVault}${solutionName}'
var location = solutionLocation //'eastus2'
var aiHubName = '${abbrs.ai.aiHub}${solutionName}'
var aiHubFriendlyName = aiHubName
var aiHubDescription = 'AI Hub for CPS template'
var aiProjectName = '${abbrs.ai.aiHubProject}${solutionName}'
var aiProjectFriendlyName = aiProjectName
var aiModelDeployments = [
  {
    name: gptModelName
    model: gptModelName
    version: gptModelVersion
    sku: {
      name: deploymentType
      capacity: gptDeploymentCapacity
    }
    raiPolicyName: 'Microsoft.Default'
  }
  // {
  //   name: embeddingModel
  //   model: embeddingModel
  //   sku: {
  //     name: 'Standard'
  //     capacity: embeddingDeploymentCapacity
  //   }
  //   raiPolicyName: 'Microsoft.Default'
  // }
]

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' existing = {
  name: keyVaultName
}

var storageNameCleaned = replace(storageName, '-', '')

resource aiServices 'Microsoft.CognitiveServices/accounts@2021-10-01' = {
  name: aiServicesName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  sku: {
    name: 'S0'
  }
  kind: 'AIServices'
  properties: {
    customSubDomainName: aiServicesName
    apiProperties: {
      statisticsEnabled: false
    }
    publicNetworkAccess: 'Enabled'
    disableLocalAuth: true
  }
}

resource aiServices_CU 'Microsoft.CognitiveServices/accounts@2021-10-01' = {
  name: aiServicesName_cu
  location: location_cu
  identity: {
    type: 'SystemAssigned'
  }
  sku: {
    name: 'S0'
  }
  kind: 'AIServices'
  properties: {
    customSubDomainName: aiServicesName_cu
    apiProperties: {
      statisticsEnabled: false
    }
    publicNetworkAccess: 'Enabled'
    disableLocalAuth: true
  }
}

@batchSize(1)
resource aiServicesDeployments 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = [for aiModeldeployment in aiModelDeployments: {
  parent: aiServices //aiServices_m
  name: aiModeldeployment.name
  properties: {
    model: {
      format: 'OpenAI'
      name: aiModeldeployment.model
      version: aiModeldeployment.version
    }
    raiPolicyName: aiModeldeployment.raiPolicyName
  }
  sku:{
    name: aiModeldeployment.sku.name
    capacity: aiModeldeployment.sku.capacity
  }
}]

resource storage 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageNameCleaned
  location: location
  sku: {
    name: storageSkuName
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: false
    allowCrossTenantReplication: false
    allowSharedKeyAccess: true
    encryption: {
      keySource: 'Microsoft.Storage'
      requireInfrastructureEncryption: false
      services: {
        blob: {
          enabled: true
          keyType: 'Account'
        }
        file: {
          enabled: true
          keyType: 'Account'
        }
        queue: {
          enabled: true
          keyType: 'Service'
        }
        table: {
          enabled: true
          keyType: 'Service'
        }
      }
    }
    isHnsEnabled: false
    isNfsV3Enabled: false
    keyPolicy: {
      keyExpirationPeriodInDays: 7
    }
    largeFileSharesState: 'Disabled'
    minimumTlsVersion: 'TLS1_2'
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
    }
    supportsHttpsTrafficOnly: true
  }
}

@description('This is the built-in Storage Blob Data Contributor.')
resource blobDataContributor 'Microsoft.Authorization/roleDefinitions@2018-01-01-preview' existing = {
  scope: resourceGroup()
  name: 'ba92f5b4-2d11-453d-a403-e96b0029c9fe'
}

resource storageroleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(resourceGroup().id, managedIdentityObjectId, blobDataContributor.id)
  properties: {
    principalId: managedIdentityObjectId
    roleDefinitionId: blobDataContributor.id
    principalType: 'ServicePrincipal' 
  }
}

resource aiHub 'Microsoft.MachineLearningServices/workspaces@2023-08-01-preview' = {
  name: aiHubName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    // organization
    friendlyName: aiHubFriendlyName
    description: aiHubDescription

    // dependent resources
    keyVault: keyVault.id
    storageAccount: storage.id
    applicationInsights: applicationInsightsId
    containerRegistry: containerRegistryId
  }
  kind: 'hub'
  resource aiServicesConnection 'connections@2024-07-01-preview' = {
    name: '${aiHubName}-connection-AzureOpenAI'
    properties: {
      category: 'AIServices'
      target: aiServices.properties.endpoint
      authType: 'AAD'
      isSharedToAll: true
      metadata: {
        ApiType: 'Azure'
        ResourceId: aiServices.id
      }
    }
    dependsOn: [
      aiServicesDeployments
    ]
  }

  resource aiServiceContentUnderstandingConnection 'connections@2024-07-01-preview' = {
    name: '${aiHubName}-cu-connection-AzureOpenAI'
    properties: {
      category: 'AIServices'
      target: aiServices_CU.properties.endpoint
      authType: 'AAD'
      isSharedToAll: true
      metadata: {
        ApiType: 'Azure'
        ResourceId: aiServices_CU.id
      }
    }
    dependsOn: [
      aiServicesDeployments
    ]
  }
}

resource aiHubProject 'Microsoft.MachineLearningServices/workspaces@2024-01-01-preview' = {
  name: aiProjectName
  location: location
  kind: 'Project'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    friendlyName: aiProjectFriendlyName
    hubResourceId: aiHub.id
  }
}

// var phiModelRegions = ['East US', 'East US 2', 'North Central US', 'South Central US', 'Sweden Central', 'West US', 'West US 3', 'eastus','eastus2','northcentralus','southcentralus','swedencentral','westus','westus3']
  
// var isInPhiList = contains(phiModelRegions, location)

// var serverlessModelName = 'Phi-4' //'Phi-3-medium-4k-instruct'
// var phiserverlessName = '${solutionName}-${serverlessModelName}'
// resource phiserverless 'Microsoft.MachineLearningServices/workspaces/serverlessEndpoints@2024-10-01' = if (isInPhiList) {
//   parent: aiHubProject
//   location: location
//   name: phiserverlessName
//   properties: {
//     authMode: 'Key'
//     contentSafety: {
//       contentSafetyStatus: 'Enabled'
//     }
//     modelSettings: {
//       modelId: 'azureml://registries/azureml/models/${serverlessModelName}'
//     }
//   }
//   sku: {
//     name: 'Consumption'
//     tier: 'Free'
//   }
// }

resource tenantIdEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'TENANT-ID'
  properties: {
    value: subscription().tenantId
  }
}

// resource adlsAccountNameEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'ADLS-ACCOUNT-NAME'
//   properties: {
//     value: storageName
//   }
// }

// resource adlsAccountContainerEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'ADLS-ACCOUNT-CONTAINER'
//   properties: {
//     value: 'data'
//   }
// }

// resource adlsAccountKeyEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'ADLS-ACCOUNT-KEY'
//   properties: {
//     value: storage.listKeys().keys[0].value
//   }
// }

// resource azureOpenAIInferenceEndpoint 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'AZURE-OPENAI-INFERENCE-ENDPOINT'
//   properties: {
//     value: phiserverless != null ? phiserverless.properties.inferenceEndpoint.uri : ''
//     // value: phiserverless.properties.inferenceEndpoint.uri
//   }
// }

// resource azureOpenAIInferenceKey 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'AZURE-OPENAI-INFERENCE-KEY'
//   properties: {
//     value: phiserverless != null ? listKeys(phiserverless.id, '2024-10-01').primaryKey : ''
//     // listKeys(phiserverless.id, '2024-10-01').primaryKey
//   }
// }

resource azureOpenAIApiKeyEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-KEY'
  properties: {
    value: aiServices.listKeys().key1 //aiServices_m.listKeys().key1
  }
}

resource azureOpenAIDeploymentModel 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPEN-AI-DEPLOYMENT-MODEL'
  properties: {
    value: gptModelName
  }
}

resource gptModelVersionEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-PREVIEW-API-VERSION'
  properties: {
    value: gptModelVersion  //'2024-02-15-preview'
  }
}

resource azureOpenAIEndpointEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-ENDPOINT'
  properties: {
    value: aiServices.properties.endpoint //aiServices_m.properties.endpoint
  }
}

resource azureAIProjectConnectionStringEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-AI-PROJECT-CONN-STRING'
  properties: {
    value: '${split(aiHubProject.properties.discoveryUrl, '/')[2]};${subscription().subscriptionId};${resourceGroup().name};${aiHubProject.name}'
  }
}

resource azureOpenAICUEndpointEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-CU-ENDPOINT'
  properties: {
    value: aiServices_CU.properties.endpoint
  }
}

resource azureOpenAICUApiKeyEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-CU-KEY'
  properties: {
    value: aiServices_CU.listKeys().key1
  }
}

resource azureOpenAICUApiVersionEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-CU-VERSION'
  properties: {
    value: '?api-version=2024-12-01-preview'
  }
}

// resource azureSearchAdminKeyEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'AZURE-SEARCH-KEY'
//   properties: {
//     value: aiSearch.listAdminKeys().primaryKey
//   }
// }

// resource azureSearchServiceEndpointEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'AZURE-SEARCH-ENDPOINT'
//   properties: {
//     value: 'https://${aiSearch.name}.search.windows.net'
//   }
// }

// resource azureSearchServiceEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'AZURE-SEARCH-SERVICE'
//   properties: {
//     value: aiSearch.name
//   }
// }

// resource azureSearchIndexEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'AZURE-SEARCH-INDEX'
//   properties: {
//     value: 'transcripts_index'
//   }
// }

resource cogServiceEndpointEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'COG-SERVICES-ENDPOINT'
  properties: {
    value: aiServices.properties.endpoint
  }
}

resource cogServiceKeyEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'COG-SERVICES-KEY'
  properties: {
    value: aiServices.listKeys().key1
  }
}

resource cogServiceNameEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'COG-SERVICES-NAME'
  properties: {
    value: aiServicesName
  }
}

resource azureSubscriptionIdEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-SUBSCRIPTION-ID'
  properties: {
    value: subscription().subscriptionId
  }
}

resource resourceGroupNameEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-RESOURCE-GROUP'
  properties: {
    value: resourceGroup().name
  }
}

resource azureLocatioEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-LOCATION'
  properties: {
    value: solutionLocation
  }
}

output aiServicesTarget string = aiServices.properties.endpoint //aiServices_m.properties.endpoint
output aiServicesCUEndpoint string = aiServices_CU.properties.endpoint //aiServices_m.properties.endpoint
output aiServicesName string = aiServicesName //aiServicesName_m
output aiServicesId string = aiServices.id //aiServices_m.id
output aiServicesCuId string = aiServices_CU.id //aiServices_cu.id
output aiServicePrincipalId string = aiServices.identity.principalId
output aiServiceCuPrincipalId string = aiServices_CU.identity.principalId

// output aiInfereceEndpoint string = phiserverless.properties.inferenceEndpoint.uri
output aiProjectPrincipalId string = aiHubProject.identity.principalId
output aiProjectConnectionString string = '${location}.api.azureml.ms;${subscription().subscriptionId};${resourceGroup().name};${aiHubProject.name}'
output aiProjectName string = aiHubProject.name
output aiProjectId string = aiHubProject.id
