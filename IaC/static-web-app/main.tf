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
  name     = "statics-web-app-rg"
  location = "eastus2"
}

resource "azurerm_static_web_app" "static" {
  name                = "eduflow"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku_tier = "Free"
  sku_size = "Free"
}
