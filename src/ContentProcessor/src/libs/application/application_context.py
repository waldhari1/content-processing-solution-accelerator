from azure.identity import DefaultAzureCredential

from libs.application.application_configuration import AppConfiguration
from libs.base.application_models import AppModelBase


class AppContext(AppModelBase):
    """
    This is Application Context Model.
    This object will be passed to all the classes which needs to access the application context.
    """

    configuration: AppConfiguration = None
    credential: DefaultAzureCredential = None

    def set_configuration(self, configuration: AppConfiguration):
        self.configuration = configuration

    def set_credential(self, credential: DefaultAzureCredential):
        self.credential = credential
