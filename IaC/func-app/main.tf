terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "3.97.1"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "functions-rg"
  location = "brazilsouth"
}

resource "azurerm_storage_account" "storage" {
  name                     = "eduflowfiles"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "service-plan1" {
  name                = "eduflow-serv-plan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku_name = "Y1"
  os_type = "Linux"
}

resource "azurerm_linux_function_app" "func1" {
  name                       = "eduflow-services"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location

  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key
  service_plan_id            = azurerm_service_plan.service-plan1.id

  app_settings = jsondecode(file("${path.module}/app-settings.json"))
  site_config {
    cors {
      allowed_origins     = ["*"]
      support_credentials = false
    }
    application_stack {
      node_version = "20"
    }
  }
}