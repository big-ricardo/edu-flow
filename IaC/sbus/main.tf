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
  name     = "sbus-rg"
  location = "brazilsouth"
}

resource "azurerm_servicebus_namespace" "sbus" {
  name                = "sbus-queue"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "Basic"
  minimum_tls_version = "1.2"
  public_network_access_enabled = true
}

resource "azurerm_servicebus_queue" "send_email" {
  name                = "send_email"
  namespace_id = azurerm_servicebus_namespace.sbus.id
  enable_partitioning = false
  max_delivery_count = 10
  lock_duration = "PT5M"
}

resource "azurerm_servicebus_queue" "change_status" {
  name                = "change_status"
  namespace_id = azurerm_servicebus_namespace.sbus.id
  enable_partitioning = false
  max_delivery_count = 10
  lock_duration = "PT5M"
}

resource "azurerm_servicebus_queue" "swap_workflow" {
  name                = "swap_workflow"
  namespace_id = azurerm_servicebus_namespace.sbus.id
  enable_partitioning = false
  max_delivery_count = 10
  lock_duration = "PT5M"
}

resource "azurerm_servicebus_queue" "interaction" {
  name                = "interaction"
  namespace_id = azurerm_servicebus_namespace.sbus.id
  enable_partitioning = false
  max_delivery_count = 10
  lock_duration = "PT5M"
}

resource "azurerm_servicebus_queue" "evaluated" {
  name                = "evaluated"
  namespace_id = azurerm_servicebus_namespace.sbus.id
  enable_partitioning = false
  max_delivery_count = 10
  lock_duration = "PT5M"
}

resource "azurerm_servicebus_queue" "interaction_process" {
  name                = "interaction_process"
  namespace_id = azurerm_servicebus_namespace.sbus.id
  enable_partitioning = false
  max_delivery_count = 10
  lock_duration = "PT5M"
}

resource "azurerm_servicebus_queue" "evaluation_process" {
  name                = "evaluation_process"
  namespace_id = azurerm_servicebus_namespace.sbus.id
  enable_partitioning = false
  max_delivery_count = 10
  lock_duration = "PT5M"
}

resource "azurerm_servicebus_queue" "web_request" {
  name                = "web_request"
  namespace_id = azurerm_servicebus_namespace.sbus.id
  enable_partitioning = false
  max_delivery_count = 10
  lock_duration = "PT5M"
}